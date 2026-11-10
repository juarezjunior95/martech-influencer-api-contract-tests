jest.mock('components/Form', () => ({
  ChipsSelect: ({
    value,
    options,
    onChange,
  }: {
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (option: { value: string; label: string }) => void;
  }) => (
    <div data-testid="chips-select-component">
      <select
        data-testid="chips-select"
        value={value}
        onChange={(e) => {
          const option = options.find((opt) => opt.value === e.target.value);
          if (option) onChange(option);
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

jest.mock('hooks', () => ({
  usePageFilterData: jest.fn(),
}));

jest.mock('hooks/useFilters/core/useFilterRules/useFilterRules', () => ({
  useFilterRules: jest.fn(),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn(() => []),
    })),
  },
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { usePageFilterData } from 'hooks';
import { useFilterRules } from 'hooks/useFilters/core/useFilterRules/useFilterRules';

import { BrandFilterGroupingsField } from './BrandFilterGroupingFields';

describe('BrandFilterGroupingsField', () => {
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;
  let mockIsBrandClassAvailable: jest.Mock;

  const mockOptions = [
    { value: 'Portfolio', label: 'Portfolio' },
    { value: 'Global Brands', label: 'Global Brands' },
    { value: 'Beer Price Segment', label: 'Beer Price Segment' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn((key: string) => {
      if (key === 'brand_filter_groupings') return 'Portfolio';
      if (key === 'kpis') return 'power';
      if (key === 'growth_levers') return 'All';
      if (key === 'zone') return 'LATAM';
      if (key === 'country') return 'BR';
      return '';
    });

    mockIsBrandClassAvailable = jest.fn(() => true);

    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {},
      defaults: { brand_filter_groupings: 'Portfolio' },
    });
    (useFilterRules as jest.Mock).mockReturnValue({
      isBrandClassAvailable: mockIsBrandClassAvailable,
    });
    (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
      getOptions: jest.fn(() => mockOptions),
    });
  });

  const getDefaultProps = () => ({
    fieldKey: 'brand_filter_groupings',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue,
  });

  describe('Basic rendering', () => {
    it('should render ChipsSelect component', () => {
      render(<BrandFilterGroupingsField {...getDefaultProps()} />);

      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
    });

    it('should display current value from getCurrentValue', () => {
      render(<BrandFilterGroupingsField {...getDefaultProps()} />);

      expect(screen.getByTestId('chips-select')).toHaveValue('Portfolio');
    });

    it('should use default value when form value is empty', () => {
      mockGetCurrentValue.mockReturnValue(undefined);

      render(<BrandFilterGroupingsField {...getDefaultProps()} />);

      expect(screen.getByTestId('chips-select')).toHaveValue('Portfolio');
    });
  });

  describe('Options', () => {
    it('should filter options with isBrandClassAvailable', () => {
      mockIsBrandClassAvailable.mockImplementation((brandClass: string) => {
        return brandClass !== 'Beer Price Segment';
      });

      render(<BrandFilterGroupingsField {...getDefaultProps()} />);

      const select = screen.getByTestId('chips-select');
      const optionElements = select.querySelectorAll('option');
      const values = Array.from(optionElements).map((o) =>
        o.getAttribute('value'),
      );

      expect(values).toContain('Portfolio');
      expect(values).toContain('Global Brands');
      expect(values).not.toContain('Beer Price Segment');
    });

    it('should call isBrandClassAvailable with state from getCurrentValue', () => {
      render(<BrandFilterGroupingsField {...getDefaultProps()} />);

      expect(mockIsBrandClassAvailable).toHaveBeenCalledWith(
        'Portfolio',
        expect.objectContaining({
          kpi: 'power',
          growthLever: 'All',
          zone: 'LATAM',
          country: 'BR',
        }),
      );
    });
  });

  describe('Value change', () => {
    it('should call onValueChange when option is selected', () => {
      render(<BrandFilterGroupingsField {...getDefaultProps()} />);

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: 'Global Brands' } });

      expect(mockOnValueChange).toHaveBeenCalledWith('brand_filter_groupings', {
        value: 'Global Brands',
        label: 'Global Brands',
      });
    });
  });
});

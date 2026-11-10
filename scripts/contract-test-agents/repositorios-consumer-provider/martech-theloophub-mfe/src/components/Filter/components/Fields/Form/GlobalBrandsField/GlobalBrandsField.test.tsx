jest.mock('components/Form', () => ({
  Select: ({
    id,
    label,
    value,
    options,
    onValueChange,
    placeholder,
    disabled,
  }: {
    id: string;
    label: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onValueChange: (option: unknown) => void;
    placeholder: string;
    disabled?: boolean;
  }) => (
    <div data-testid="select-component">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => {
          const option = options.find((opt) => opt.value === e.target.value);
          onValueChange(option);
        }}
        data-placeholder={placeholder}
        disabled={disabled}
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
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(),
}));

jest.mock('hooks/useFilters/core/useFilterRules', () => ({
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
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { useFilterRules } from 'hooks/useFilters/core/useFilterRules';

import { GlobalBrandsField } from './GlobalBrandsField';

describe('GlobalBrandsField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;
  let mockGetFieldConfig: jest.Mock;

  const mockOptions = [
    { value: 'Stella Artois', label: 'Stella Artois' },
    { value: 'Corona', label: 'Corona' },
    { value: 'Budweiser', label: 'Budweiser' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn((key: string) => {
      if (key === 'global_brands') return 'Stella Artois';
      if (key === 'kpis') return 'power';
      if (key === 'country') return 'BR';
      if (key === 'zone') return 'LATAM';
      return '';
    });

    mockGetFieldConfig = jest.fn(() => ({
      hidden: false,
      label: 'Global Brands',
      disabled: false,
    }));

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {},
    });
    (useFilterRules as jest.Mock).mockReturnValue({
      getFieldConfig: mockGetFieldConfig,
    });
    (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
      getOptions: jest.fn(() => mockOptions),
    });
  });

  const getDefaultProps = () => ({
    fieldKey: 'global_brands',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue,
  });

  describe('Basic rendering', () => {
    it('should render the Select component', () => {
      render(<GlobalBrandsField {...getDefaultProps()} />);

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should render with label from field config', () => {
      render(<GlobalBrandsField {...getDefaultProps()} />);

      expect(screen.getByLabelText('Global Brands')).toBeInTheDocument();
    });

    it('should return null when fieldConfig.hidden is true', () => {
      mockGetFieldConfig.mockReturnValue({
        hidden: true,
        label: 'Global Brands',
        disabled: false,
      });

      const { container } = render(
        <GlobalBrandsField {...getDefaultProps()} />,
      );

      expect(screen.queryByTestId('select-component')).not.toBeInTheDocument();
      expect(container.firstChild).toBeNull();
    });

    it('should display current value from formValue', () => {
      render(<GlobalBrandsField {...getDefaultProps()} />);

      expect(screen.getByLabelText('Global Brands')).toHaveValue(
        'Stella Artois',
      );
    });

    it('should use first option value when formValue is null', () => {
      mockGetCurrentValue.mockImplementation((key: string) => {
        if (key === 'global_brands') return null;
        if (key === 'kpis') return 'power';
        if (key === 'country') return 'BR';
        if (key === 'zone') return 'LATAM';
        return '';
      });

      render(<GlobalBrandsField {...getDefaultProps()} />);

      expect(screen.getByLabelText('Global Brands')).toHaveValue(
        'Stella Artois',
      );
    });
  });

  describe('useEffect initial value', () => {
    it('should call onValueChange with first option when formValue is null and options exist', () => {
      mockGetCurrentValue.mockImplementation((key: string) => {
        if (key === 'global_brands') return null;
        if (key === 'kpis') return 'power';
        if (key === 'country') return 'BR';
        if (key === 'zone') return 'LATAM';
        return '';
      });

      render(<GlobalBrandsField {...getDefaultProps()} />);

      expect(mockOnValueChange).toHaveBeenCalledWith('global_brands', {
        value: 'Stella Artois',
        label: 'Stella Artois',
      });
    });

    it('should not call onValueChange when formValue is already set', () => {
      render(<GlobalBrandsField {...getDefaultProps()} />);

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should not call onValueChange when field is hidden', () => {
      mockGetFieldConfig.mockReturnValue({
        hidden: true,
        label: 'Global Brands',
        disabled: false,
      });
      mockGetCurrentValue.mockImplementation((key: string) => {
        if (key === 'global_brands') return null;
        return '';
      });

      render(<GlobalBrandsField {...getDefaultProps()} />);

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Value change', () => {
    it('should call onValueChange when value changes', () => {
      render(<GlobalBrandsField {...getDefaultProps()} />);

      const select = screen.getByLabelText('Global Brands');
      fireEvent.change(select, { target: { value: 'Corona' } });

      expect(mockOnValueChange).toHaveBeenCalledWith(
        'global_brands',
        expect.objectContaining({ value: 'Corona', label: 'Corona' }),
      );
    });

    it('should track Google Analytics event when value changes', () => {
      render(<GlobalBrandsField {...getDefaultProps()} />);

      const select = screen.getByLabelText('Global Brands');
      fireEvent.change(select, { target: { value: 'Corona' } });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Global Brand Select',
        event_action: 'Select',
        event_label: 'Corona',
      });
    });
  });

  describe('getFieldConfig', () => {
    it('should call getFieldConfig with correct context', () => {
      render(<GlobalBrandsField {...getDefaultProps()} />);

      expect(mockGetFieldConfig).toHaveBeenCalledWith('global_brands', {
        kpi: 'power',
        growthLever: '',
        country: 'BR',
        zone: 'LATAM',
        brandClass: '',
        brand: '',
      });
    });
  });

  describe('Disabled state', () => {
    it('should render Select as disabled when fieldConfig.disabled is true', () => {
      mockGetFieldConfig.mockReturnValue({
        hidden: false,
        label: 'Global Brands',
        disabled: true,
      });

      render(<GlobalBrandsField {...getDefaultProps()} />);

      expect(screen.getByLabelText('Global Brands')).toBeDisabled();
    });
  });
});

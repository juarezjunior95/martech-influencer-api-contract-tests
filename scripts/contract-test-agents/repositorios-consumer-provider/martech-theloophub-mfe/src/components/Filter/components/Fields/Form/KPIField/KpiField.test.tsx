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
        value={value ?? ''}
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

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn(() => []),
    })),
  },
}));

jest.mock('components/Filter/hooks', () => ({
  useKpiFeatureToggles: jest.fn(() => ({
    filterOptionsByFeatureToggle: jest.fn((options) => options),
  })),
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { usePageFilterData } from 'hooks';

import { KPIField } from './KpiField';

describe('KPIField', () => {
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockOptions = [
    { value: 'power', label: 'Power' },
    { value: 'volume', label: 'Volume' },
    { value: 'net_revenue', label: 'Net Revenue' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn((key: string) => {
      if (key === 'kpis') return 'power';
      return '';
    });

    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {},
    });
    (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
      getOptions: jest.fn(() => mockOptions),
    });
  });

  const getDefaultProps = () => ({
    fieldKey: 'kpis',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue,
  });

  describe('Basic rendering', () => {
    it('should render ChipsSelect component', () => {
      render(<KPIField {...getDefaultProps()} />);

      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
    });

    it('should display current value from getCurrentValue', () => {
      render(<KPIField {...getDefaultProps()} />);

      expect(screen.getByTestId('chips-select')).toHaveValue('power');
    });

    it('should display options from FilterDataAccessor', () => {
      render(<KPIField {...getDefaultProps()} />);

      const select = screen.getByTestId('chips-select');
      const optionElements = select.querySelectorAll('option');
      expect(optionElements).toHaveLength(3);
    });
  });

  describe('Value change', () => {
    it('should call onValueChange when selecting a different value', () => {
      render(<KPIField {...getDefaultProps()} />);

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: 'volume' } });

      expect(mockOnValueChange).toHaveBeenCalledWith('kpis', {
        value: 'volume',
        label: 'Volume',
      });
    });

    it('should not call onValueChange when selecting the same value', () => {
      render(<KPIField {...getDefaultProps()} />);

      const select = screen.getByTestId('chips-select');
      fireEvent.change(select, { target: { value: 'power' } });

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });
  });

  describe('FilterDataAccessor', () => {
    it('should call getOptions with fieldKey and dataFilters', () => {
      const mockGetOptions = jest.fn(() => mockOptions);
      (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
        getOptions: mockGetOptions,
      });

      render(<KPIField {...getDefaultProps()} />);

      expect(mockGetOptions).toHaveBeenCalledWith('kpis', {}, {});
    });
  });
});

import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('components/Filter/hooks/useQuickFilter', () => ({
  useQuickFilter: jest.fn(),
}));

const mockFilterOptionsByFeatureToggle = jest.fn((options) => options);

jest.mock('components/Filter/hooks', () => ({
  useKpiFeatureToggles: jest.fn(() => ({
    filterOptionsByFeatureToggle: mockFilterOptionsByFeatureToggle,
  })),
}));

jest.mock('components/Form', () => ({
  Select: ({
    id,
    value,
    options,
    onValueChange,
    placeholder,
    chips,
    clearChips,
    onClearSingle,
    valueLabel,
  }: any) => (
    <div data-testid="select-component">
      <select
        id={id}
        value={value}
        data-placeholder={placeholder}
        onChange={(e) => {
          const option = options.find(
            (opt: any) => opt.value === e.target.value,
          );
          onValueChange(option);
        }}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {clearChips && (
        <button data-testid="clear-button" onClick={onClearSingle}>
          Clear
        </button>
      )}
      <span data-testid="value-label">{valueLabel}</span>
    </div>
  ),
}));

import { useKpiFeatureToggles } from 'components/Filter/hooks';
import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';

import { KPIQuickFilter } from './KpiQuickFilter';

const mockHandleValueChange = jest.fn();
const mockHandleClear = jest.fn();

const defaultProps = {
  fieldKey: 'kpi',
  pageName: 'test-page',
  onValueChange: jest.fn(),
  getCurrentValue: jest.fn((key) => (key === 'kpi' ? 'volume' : '')),
};

describe('KPIQuickFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useQuickFilter as jest.Mock).mockReturnValue({
      options: [
        { value: 'volume', label: 'Volume' },
        { value: 'revenue', label: 'Revenue' },
      ],
      currentValue: 'volume',
      handleValueChange: mockHandleValueChange,
      handleClear: mockHandleClear,
      showClearIcon: false,
    });
  });

  describe('Rendering', () => {
    it('should render Select component', () => {
      render(<KPIQuickFilter {...defaultProps} />);

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should render with KPI value label', () => {
      render(<KPIQuickFilter {...defaultProps} />);

      expect(screen.getByTestId('value-label')).toHaveTextContent('KPI');
    });

    it('should render options from useQuickFilter', () => {
      render(<KPIQuickFilter {...defaultProps} />);

      expect(
        screen.getByRole('option', { name: 'Volume' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Revenue' }),
      ).toBeInTheDocument();
    });

    it('should pass id built from fieldKey to Select', () => {
      render(<KPIQuickFilter {...defaultProps} />);

      expect(screen.getByRole('combobox')).toHaveAttribute(
        'id',
        'kpi-select-quick-filter',
      );
    });

    it('should pass placeholder with fieldKey', () => {
      render(<KPIQuickFilter {...defaultProps} />);

      expect(screen.getByRole('combobox')).toHaveAttribute(
        'data-placeholder',
        'Select kpi',
      );
    });

    it('should pass getCurrentValue to useQuickFilter', () => {
      render(<KPIQuickFilter {...defaultProps} />);

      expect(useQuickFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          getCurrentValue: defaultProps.getCurrentValue,
        }),
      );
    });

    it('should use fieldKey for id and placeholder when provided', () => {
      render(
        <KPIQuickFilter
          {...defaultProps}
          fieldKey="customKpi"
          getCurrentValue={jest.fn(() => '')}
        />,
      );

      expect(screen.getByRole('combobox')).toHaveAttribute(
        'id',
        'customKpi-select-quick-filter',
      );
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'data-placeholder',
        'Select customKpi',
      );
    });
  });

  describe('Functionality', () => {
    it('should call handleValueChange when an option is selected', () => {
      render(<KPIQuickFilter {...defaultProps} />);

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'revenue' },
      });

      expect(mockHandleValueChange).toHaveBeenCalledWith({
        value: 'revenue',
        label: 'Revenue',
      });
    });

    it('should show clear button when showClearIcon is true', () => {
      (useQuickFilter as jest.Mock).mockReturnValue({
        options: [{ value: 'volume', label: 'Volume' }],
        currentValue: 'volume',
        handleValueChange: mockHandleValueChange,
        handleClear: mockHandleClear,
        showClearIcon: true,
      });

      render(<KPIQuickFilter {...defaultProps} />);

      expect(screen.getByTestId('clear-button')).toBeInTheDocument();
    });

    it('should not show clear button when showClearIcon is false', () => {
      render(<KPIQuickFilter {...defaultProps} />);

      expect(screen.queryByTestId('clear-button')).not.toBeInTheDocument();
    });

    it('should call handleClear when clear button is clicked', () => {
      (useQuickFilter as jest.Mock).mockReturnValue({
        options: [{ value: 'volume', label: 'Volume' }],
        currentValue: 'volume',
        handleValueChange: mockHandleValueChange,
        handleClear: mockHandleClear,
        showClearIcon: true,
      });

      render(<KPIQuickFilter {...defaultProps} />);

      fireEvent.click(screen.getByTestId('clear-button'));

      expect(mockHandleClear).toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('should use useQuickFilter with correct parameters', () => {
      render(<KPIQuickFilter {...defaultProps} />);

      expect(useQuickFilter).toHaveBeenCalledWith({
        fieldKey: 'kpi',
        pageName: 'test-page',
        gaCategory: 'KPI Select',
        filterContext: {},
        onValueChange: defaultProps.onValueChange,
        getCurrentValue: defaultProps.getCurrentValue,
      });
    });
  });

  describe('Feature Toggle Filtering', () => {
    it('should filter options based on feature toggles', () => {
      const allOptions = [
        { value: 'volume', label: 'Volume' },
        { value: 'nr', label: 'Net Revenue' },
        { value: 'cores', label: 'Cores' },
        { value: 'market_share', label: 'Market Share' },
        { value: 'power', label: 'Brand Power' },
      ];

      (useQuickFilter as jest.Mock).mockReturnValue({
        options: allOptions,
        currentValue: 'volume',
        handleValueChange: mockHandleValueChange,
        handleClear: mockHandleClear,
        showClearIcon: false,
      });

      mockFilterOptionsByFeatureToggle.mockReturnValue([
        { value: 'volume', label: 'Volume' },
        { value: 'cores', label: 'Cores' },
        { value: 'power', label: 'Brand Power' },
      ]);

      render(<KPIQuickFilter {...defaultProps} />);

      expect(
        screen.getByRole('option', { name: 'Volume' }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: 'Net Revenue' }),
      ).not.toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Cores' })).toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: 'Market Share' }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Brand Power' }),
      ).toBeInTheDocument();
    });

    it('should show all options when all feature toggles are enabled', () => {
      const allOptions = [
        { value: 'volume', label: 'Volume' },
        { value: 'nr', label: 'Net Revenue' },
        { value: 'cores', label: 'Cores' },
        { value: 'market_share', label: 'Market Share' },
        { value: 'power', label: 'Brand Power' },
      ];

      (useQuickFilter as jest.Mock).mockReturnValue({
        options: allOptions,
        currentValue: 'volume',
        handleValueChange: mockHandleValueChange,
        handleClear: mockHandleClear,
        showClearIcon: false,
      });

      mockFilterOptionsByFeatureToggle.mockReturnValue(allOptions);

      render(<KPIQuickFilter {...defaultProps} />);

      expect(
        screen.getByRole('option', { name: 'Volume' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Net Revenue' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Cores' })).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Market Share' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Brand Power' }),
      ).toBeInTheDocument();
    });

    it('should call filterOptionsByFeatureToggle with options', () => {
      const allOptions = [
        { value: 'volume', label: 'Volume' },
        { value: 'custom_kpi', label: 'Custom KPI' },
      ];

      (useQuickFilter as jest.Mock).mockReturnValue({
        options: allOptions,
        currentValue: 'volume',
        handleValueChange: mockHandleValueChange,
        handleClear: mockHandleClear,
        showClearIcon: false,
      });

      mockFilterOptionsByFeatureToggle.mockReturnValue(allOptions);

      render(<KPIQuickFilter {...defaultProps} />);

      expect(mockFilterOptionsByFeatureToggle).toHaveBeenCalledWith(allOptions);
      expect(
        screen.getByRole('option', { name: 'Volume' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Custom KPI' }),
      ).toBeInTheDocument();
    });

    it('should use useKpiFeatureToggles hook', () => {
      render(<KPIQuickFilter {...defaultProps} />);

      expect(useKpiFeatureToggles).toHaveBeenCalled();
    });
  });
});

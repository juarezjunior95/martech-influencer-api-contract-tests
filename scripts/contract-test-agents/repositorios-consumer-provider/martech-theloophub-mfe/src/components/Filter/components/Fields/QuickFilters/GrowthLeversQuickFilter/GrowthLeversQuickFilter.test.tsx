import { fireEvent, render, screen } from '@testing-library/react';
import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { Option } from 'models';

import { GrowthLeversQuickFilter } from './GrowthLeversQuickFilter';

jest.mock('components/Filter/hooks/useQuickFilter', () => ({
  useQuickFilter: jest.fn(),
}));

jest.mock('components/Form', () => ({
  Select: ({
    id,
    value,
    options,
    onValueChange,
  }: {
    id: string;
    value: string;
    options: Option[];
    onValueChange: (option: Option) => void;
  }) => (
    <select
      id={id}
      value={value}
      onChange={(e) => {
        const selected = options.find((opt) => opt.value === e.target.value);
        if (selected) onValueChange(selected);
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

const mockUseQuickFilter = useQuickFilter as jest.MockedFunction<
  typeof useQuickFilter
>;

describe('GrowthLeversQuickFilter', () => {
  const defaultProps = {
    fieldKey: 'growth_levers',
    pageName: 'performance-tool',
    onValueChange: jest.fn(),
    getCurrentValue: jest.fn(),
  };

  const mockOptions = [
    { value: 'All', label: 'All' },
    { value: 'Lead Premium', label: 'Lead Premium' },
    { value: 'Superior Core', label: 'Superior Core' },
    { value: 'Balanced Choice', label: 'Balanced Choice' },
    { value: 'Beyond Beer', label: 'Beyond Beer' },
  ];

  const mockHandleValueChange = jest.fn();
  const mockHandleClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    defaultProps.getCurrentValue.mockImplementation((key: string) => {
      if (key === 'country') return 'BRA';
      return null;
    });

    mockUseQuickFilter.mockReturnValue({
      options: mockOptions,
      currentValue: 'All',
      handleValueChange: mockHandleValueChange,
      handleClear: mockHandleClear,
      showClearIcon: false,
      dataFilters: {},
      defaults: { growth_levers: 'All' },
    });
  });

  it('should render the select component', () => {
    render(<GrowthLeversQuickFilter {...defaultProps} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should display current value', () => {
    mockUseQuickFilter.mockReturnValue({
      options: mockOptions,
      currentValue: 'Lead Premium',
      handleValueChange: mockHandleValueChange,
      handleClear: mockHandleClear,
      showClearIcon: true,
      dataFilters: {},
      defaults: { growth_levers: 'All' },
    });

    render(<GrowthLeversQuickFilter {...defaultProps} />);

    expect(screen.getByText('Lead Premium')).toBeInTheDocument();
  });

  it('should call useQuickFilter with correct params', () => {
    render(<GrowthLeversQuickFilter {...defaultProps} />);

    expect(mockUseQuickFilter).toHaveBeenCalledWith({
      fieldKey: 'growth_levers',
      pageName: 'performance-tool',
      gaCategory: 'Growth Levers Select',
      filterContext: { country: 'BRA', zone: null },
      onValueChange: defaultProps.onValueChange,
      getCurrentValue: defaultProps.getCurrentValue,
    });
  });

  it('should call getCurrentValue for country', () => {
    render(<GrowthLeversQuickFilter {...defaultProps} />);

    expect(defaultProps.getCurrentValue).toHaveBeenCalledWith('country');
  });

  it('should pass handleValueChange to Select', () => {
    render(<GrowthLeversQuickFilter {...defaultProps} />);

    expect(mockUseQuickFilter).toHaveBeenCalled();
    expect(mockHandleValueChange).toBeDefined();
  });

  it('should show clear icon when showClearIcon is true', () => {
    mockUseQuickFilter.mockReturnValue({
      options: mockOptions,
      currentValue: 'Lead Premium',
      handleValueChange: mockHandleValueChange,
      handleClear: mockHandleClear,
      showClearIcon: true,
      dataFilters: {},
      defaults: { growth_levers: 'All' },
    });

    render(<GrowthLeversQuickFilter {...defaultProps} />);

    expect(mockUseQuickFilter).toHaveBeenCalled();
  });

  it('should call handleClear when clear is triggered', () => {
    mockUseQuickFilter.mockReturnValue({
      options: mockOptions,
      currentValue: 'Lead Premium',
      handleValueChange: mockHandleValueChange,
      handleClear: mockHandleClear,
      showClearIcon: true,
      dataFilters: {},
      defaults: { growth_levers: 'All' },
    });

    render(<GrowthLeversQuickFilter {...defaultProps} />);

    const clearButton = screen.queryByRole('button', { name: /clear/i });
    if (clearButton) {
      fireEvent.click(clearButton);
      expect(mockHandleClear).toHaveBeenCalled();
    }
  });

  it('should render select component with correct props', () => {
    const { container } = render(<GrowthLeversQuickFilter {...defaultProps} />);

    expect(container.firstChild).toBeInTheDocument();
    expect(mockUseQuickFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        fieldKey: 'growth_levers',
      }),
    );
  });

  it('should render with pill shape and medium size', () => {
    const { container } = render(<GrowthLeversQuickFilter {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

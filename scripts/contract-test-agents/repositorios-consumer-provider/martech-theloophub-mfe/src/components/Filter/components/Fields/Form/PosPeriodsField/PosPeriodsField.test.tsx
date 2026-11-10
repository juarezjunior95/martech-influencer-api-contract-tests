jest.mock('components/Form', () => ({
  ChipsSelect: ({
    dataTestId,
    value,
    onChange,
    options,
  }: {
    dataTestId?: string;
    value: string;
    onChange: (option: { value: string; label: string }) => void;
    options: Array<{ value: string; label: string }>;
  }) => (
    <div data-testid={dataTestId || 'chips-select'} data-value={value}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt)}
          data-testid={`option-${opt.value}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(),
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';

import { PosPeriodsField } from './PosPeriodsField';

describe('PosPeriodsField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockOptions = [
    { value: 'P1', label: 'Period 1' },
    { value: 'P2', label: 'Period 2' },
    { value: 'P3', label: 'Period 3' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn().mockReturnValue('P1');

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        pos_periods: {
          values: mockOptions,
        },
      },
    });
  });

  describe('rendering', () => {
    it('should render ChipsSelect component', () => {
      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('chips-select')).toBeInTheDocument();
    });

    it('should render all options as buttons', () => {
      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('option-P1')).toBeInTheDocument();
      expect(screen.getByTestId('option-P2')).toBeInTheDocument();
      expect(screen.getByTestId('option-P3')).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const control = screen.getByTestId('chips-select');
      expect(control).toHaveAttribute('data-value', 'P1');
    });

    it('should use first option as default when no current value', () => {
      mockGetCurrentValue.mockReturnValue(null);

      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const control = screen.getByTestId('chips-select');
      expect(control).toHaveAttribute('data-value', 'P1');
    });
  });

  describe('data loading', () => {
    it('should load options from dataFilters', () => {
      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(usePageFilterData).toHaveBeenCalledWith('test-page');
    });

    it('should use empty array when pos_periods values is undefined', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {},
      });

      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('chips-select')).toBeInTheDocument();
    });

    it('should filter out options with null values', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          pos_periods: {
            values: [
              { value: 'P1', label: 'Period 1' },
              { value: null, label: 'Invalid' },
              { value: 'P3', label: 'Period 3' },
            ],
          },
        },
      });

      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('option-P1')).toBeInTheDocument();
      expect(screen.queryByTestId('option-null')).not.toBeInTheDocument();
      expect(screen.getByTestId('option-P3')).toBeInTheDocument();
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const option2 = screen.getByTestId('option-P2');
      fireEvent.click(option2);

      expect(mockOnValueChange).toHaveBeenCalledWith('pos_periods', {
        value: 'P2',
        label: 'Period 2',
      });
    });

    it('should track Google Analytics event when value changes', () => {
      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const option3 = screen.getByTestId('option-P3');
      fireEvent.click(option3);

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Period Select',
        event_action: 'Select',
        event_label: 'P3',
      });
    });

    it('should not call onValueChange when option value is null', () => {
      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const chipsSelect = screen.getByTestId('chips-select');
      const onChange = chipsSelect.querySelector('button')?.onclick;

      mockOnValueChange.mockClear();

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });
  });

  describe('value conversion', () => {
    it('should convert numeric values to strings', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          pos_periods: {
            values: [
              { value: 1, label: 'Period 1' },
              { value: 2, label: 'Period 2' },
            ],
          },
        },
      });

      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('option-1')).toBeInTheDocument();
      expect(screen.getByTestId('option-2')).toBeInTheDocument();
    });

    it('should convert current value to string', () => {
      mockGetCurrentValue.mockReturnValue(2);

      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const control = screen.getByTestId('chips-select');
      expect(control).toHaveAttribute('data-value', '2');
    });
  });

  describe('conditional rendering', () => {
    it('should render ChipsSelect disabled when no valid options', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          pos_periods: {
            values: [],
          },
        },
      });

      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('chips-select')).toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to ChipsSelect when provided', () => {
      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
          dataTestId="custom"
        />,
      );

      expect(screen.getByTestId('custom-pos_periods')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('chips-select')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <PosPeriodsField
          fieldKey="pos_periods"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-pos-periods"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});

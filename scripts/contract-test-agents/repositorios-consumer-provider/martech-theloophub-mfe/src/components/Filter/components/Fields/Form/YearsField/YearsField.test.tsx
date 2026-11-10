jest.mock('components/Form', () => ({
  ChipsSelect: ({
    dataTestId,
    value,
    options,
    onChange,
    disabled,
  }: {
    dataTestId?: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (option: any) => void;
    disabled?: boolean;
  }) => (
    <div
      data-testid={dataTestId || 'chips-select-component'}
      data-value={value}
      data-disabled={disabled}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange({ value: opt.value, label: opt.label })}
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

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn((fieldKey, dataFilters) => {
        if (!dataFilters || !dataFilters.time_frame) return [];
        return dataFilters.time_frame.values || [];
      }),
    })),
  },
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';

import { YearsField } from './YearsField';

describe('YearsField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockOptions = [
    { value: '2025', label: "FY'25" },
    { value: '2024', label: "FY'24" },
    { value: '2023', label: "FY'23" },
  ];

  const defaultProps = {
    fieldKey: 'years',
    pageName: 'test-page',
    onValueChange: jest.fn(),
    getCurrentValue: jest.fn().mockReturnValue('2025'),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn().mockReturnValue('2025');

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        time_frame: {
          values: mockOptions,
        },
      },
    });
  });

  describe('rendering', () => {
    it('should render ChipsSelect component', () => {
      render(<YearsField {...defaultProps} />);

      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
    });

    it('should render all year options as buttons', () => {
      render(<YearsField {...defaultProps} />);

      expect(screen.getByTestId('option-2025')).toBeInTheDocument();
      expect(screen.getByTestId('option-2025')).toHaveTextContent("FY'25");
      expect(screen.getByTestId('option-2024')).toBeInTheDocument();
      expect(screen.getByTestId('option-2024')).toHaveTextContent("FY'24");
      expect(screen.getByTestId('option-2023')).toBeInTheDocument();
      expect(screen.getByTestId('option-2023')).toHaveTextContent("FY'23");
    });

    it('should display current value', () => {
      render(<YearsField {...defaultProps} />);

      const control = screen.getByTestId('chips-select-component');
      expect(control).toHaveAttribute('data-value', '2025');
    });

    it('should use first option as default when no current value', () => {
      const getCurrentValue = jest.fn().mockReturnValue(null);

      render(
        <YearsField {...defaultProps} getCurrentValue={getCurrentValue} />,
      );

      const control = screen.getByTestId('chips-select-component');
      expect(control).toHaveAttribute('data-value', '2025');
    });
  });

  describe('data loading', () => {
    it('should load options from dataFilters', () => {
      render(<YearsField {...defaultProps} />);

      expect(usePageFilterData).toHaveBeenCalledWith('test-page');
    });

    it('should render with no options when time_frame values is undefined', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {},
      });

      render(<YearsField {...defaultProps} />);

      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
      expect(
        screen.getByTestId('chips-select-component').querySelectorAll('button'),
      ).toHaveLength(0);
    });

    it('should filter out options with null values', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          time_frame: {
            values: [
              { value: '2025', label: "FY'25" },
              { value: null, label: 'Invalid' },
              { value: '2023', label: "FY'23" },
            ],
          },
        },
      });

      render(<YearsField {...defaultProps} />);

      expect(screen.getByTestId('option-2025')).toBeInTheDocument();
      expect(screen.queryByTestId('option-null')).not.toBeInTheDocument();
      expect(screen.getByTestId('option-2023')).toBeInTheDocument();
    });

    it('should filter out options with null labels', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          time_frame: {
            values: [
              { value: '2025', label: "FY'25" },
              { value: '2024', label: null },
              { value: '2023', label: "FY'23" },
            ],
          },
        },
      });

      render(<YearsField {...defaultProps} />);

      expect(screen.getByTestId('option-2025')).toBeInTheDocument();
      expect(screen.queryByTestId('option-2024')).not.toBeInTheDocument();
      expect(screen.getByTestId('option-2023')).toBeInTheDocument();
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      const onValueChange = jest.fn();

      render(<YearsField {...defaultProps} onValueChange={onValueChange} />);

      const option2024 = screen.getByTestId('option-2024');
      fireEvent.click(option2024);

      expect(onValueChange).toHaveBeenCalledWith('years', {
        value: '2024',
        label: "FY'24",
      });
    });

    it('should track Google Analytics event when value changes', () => {
      const trackGA = jest.fn();
      (useGoogleAnalytics as jest.Mock).mockReturnValue(trackGA);

      render(<YearsField {...defaultProps} />);

      const option2023 = screen.getByTestId('option-2023');
      fireEvent.click(option2023);

      expect(trackGA).toHaveBeenCalledWith({
        event_category: 'Years Select',
        event_action: 'Select',
        event_label: '2023',
      });
    });

    it('should call onValueChange after tracking GA', () => {
      const callOrder: string[] = [];
      const trackGA = jest.fn(() => callOrder.push('trackGA'));
      const onValueChange = jest.fn(() => callOrder.push('onValueChange'));

      (useGoogleAnalytics as jest.Mock).mockReturnValue(trackGA);

      render(<YearsField {...defaultProps} onValueChange={onValueChange} />);

      const option = screen.getByTestId('option-2024');
      fireEvent.click(option);

      expect(callOrder).toEqual(['trackGA', 'onValueChange']);
    });
  });

  describe('value conversion', () => {
    it('should convert numeric values to strings', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          time_frame: {
            values: [
              { value: 2025, label: "FY'25" },
              { value: 2024, label: "FY'24" },
            ],
          },
        },
      });

      render(<YearsField {...defaultProps} />);

      expect(screen.getByTestId('option-2025')).toBeInTheDocument();
      expect(screen.getByTestId('option-2024')).toBeInTheDocument();
    });

    it('should convert current value to string', () => {
      const getCurrentValue = jest.fn().mockReturnValue(2025);

      render(
        <YearsField {...defaultProps} getCurrentValue={getCurrentValue} />,
      );

      const control = screen.getByTestId('chips-select-component');
      expect(control).toHaveAttribute('data-value', '2025');
    });
  });

  describe('conditional rendering', () => {
    it('should render with empty value and no options when no valid options', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          time_frame: {
            values: [],
          },
        },
      });

      const getCurrentValue = jest.fn().mockReturnValue(null);
      render(
        <YearsField {...defaultProps} getCurrentValue={getCurrentValue} />,
      );

      const control = screen.getByTestId('chips-select-component');
      expect(control).toBeInTheDocument();
      expect(control).toHaveAttribute('data-value', '');
      expect(control.querySelectorAll('[data-testid^="option-"]')).toHaveLength(
        0,
      );
    });

    it('should render with empty value when all options have null values', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          time_frame: {
            values: [
              { value: null, label: 'Invalid' },
              { value: null, label: 'Invalid2' },
            ],
          },
        },
      });

      const getCurrentValue = jest.fn().mockReturnValue(null);
      render(
        <YearsField {...defaultProps} getCurrentValue={getCurrentValue} />,
      );

      const control = screen.getByTestId('chips-select-component');
      expect(control).toBeInTheDocument();
      expect(control).toHaveAttribute('data-value', '');
      expect(control.querySelectorAll('[data-testid^="option-"]')).toHaveLength(
        0,
      );
    });

    it('should disable ChipsSelect when only one option is available', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          time_frame: {
            values: [{ value: '2025', label: "FY'25" }],
          },
        },
      });

      render(<YearsField {...defaultProps} />);

      const control = screen.getByTestId('chips-select-component');
      expect(control).toHaveAttribute('data-disabled', 'true');
    });

    it('should not disable ChipsSelect when multiple options are available', () => {
      render(<YearsField {...defaultProps} />);

      const control = screen.getByTestId('chips-select-component');
      expect(control).toHaveAttribute('data-disabled', 'false');
    });
  });

  describe('FilterDataAccessor integration', () => {
    it('should use FilterDataAccessor to get options', () => {
      render(<YearsField {...defaultProps} />);
      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
      expect(screen.getByTestId('option-2025')).toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to ChipsSelect when provided', () => {
      render(
        <YearsField {...defaultProps} dataTestId="custom" fieldKey="years" />,
      );
      expect(screen.getByTestId('custom-years')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<YearsField {...defaultProps} />);
      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<YearsField {...defaultProps} />);
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-years"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});

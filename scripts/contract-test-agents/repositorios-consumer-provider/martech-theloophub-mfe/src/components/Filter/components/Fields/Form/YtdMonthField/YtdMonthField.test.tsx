jest.mock('components/Form', () => ({
  ChipsSelect: ({
    dataTestId,
    value,
    options,
    onChange,
  }: {
    dataTestId?: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (option: any) => void;
  }) => (
    <div
      data-testid={dataTestId || 'chips-select-component'}
      data-value={value}
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
        if (!dataFilters || !dataFilters['ytd-month']) return [];
        return dataFilters['ytd-month'].values || [];
      }),
    })),
  },
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';

import { YtdMonthField } from './YtdMonthField';

describe('YtdMonthField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;

  const mockOptions = [
    { value: 'Jan', label: 'Jan' },
    { value: 'Feb', label: 'Feb' },
    { value: 'Mar', label: 'Mar' },
  ];

  const mockTimeFrame = {
    default: {
      start: '2024-01-01',
      end: '2024-12-31',
    },
  };

  const defaultProps = {
    fieldKey: 'ytd-month',
    pageName: 'test-page',
    onValueChange: jest.fn(),
    getCurrentValue: jest.fn().mockReturnValue('Jan'),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn().mockReturnValue('Jan');

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        'ytd-month': {
          values: mockOptions,
        },
        time_frame: mockTimeFrame,
      },
    });
  });

  describe('rendering', () => {
    it('should render ChipsSelect component', () => {
      render(<YtdMonthField {...defaultProps} />);

      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
    });

    it('should render all options as buttons with year prefix', () => {
      render(<YtdMonthField {...defaultProps} />);

      expect(screen.getByTestId('option-Jan')).toBeInTheDocument();
      expect(screen.getByTestId('option-Jan')).toHaveTextContent('Jan');
      expect(screen.getByTestId('option-Feb')).toBeInTheDocument();
      expect(screen.getByTestId('option-Feb')).toHaveTextContent('Feb');
      expect(screen.getByTestId('option-Mar')).toBeInTheDocument();
      expect(screen.getByTestId('option-Mar')).toHaveTextContent('Mar');
    });

    it('should display current value', () => {
      render(<YtdMonthField {...defaultProps} />);

      const control = screen.getByTestId('chips-select-component');
      expect(control).toHaveAttribute('data-value', 'Jan');
    });

    it('should use first option as default when no current value', () => {
      const getCurrentValue = jest.fn().mockReturnValue(null);

      render(
        <YtdMonthField {...defaultProps} getCurrentValue={getCurrentValue} />,
      );

      const control = screen.getByTestId('chips-select-component');
      expect(control).toHaveAttribute('data-value', 'Jan');
    });
  });

  describe('data loading', () => {
    it('should load options from dataFilters', () => {
      render(<YtdMonthField {...defaultProps} />);

      expect(usePageFilterData).toHaveBeenCalledWith('test-page');
    });

    it('should render with no options when ytd-month values is undefined', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          time_frame: mockTimeFrame,
        },
      });

      render(<YtdMonthField {...defaultProps} />);

      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
      expect(
        screen.getByTestId('chips-select-component').querySelectorAll('button'),
      ).toHaveLength(0);
    });

    it('should filter out options with null values', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          'ytd-month': {
            values: [
              { value: 'Jan', label: 'Jan' },
              { value: null, label: 'Invalid' },
              { value: 'Mar', label: 'Mar' },
            ],
          },
          time_frame: mockTimeFrame,
        },
      });

      render(<YtdMonthField {...defaultProps} />);

      expect(screen.getByTestId('option-Jan')).toBeInTheDocument();
      expect(screen.queryByTestId('option-null')).not.toBeInTheDocument();
      expect(screen.getByTestId('option-Mar')).toBeInTheDocument();
    });
  });

  describe('year extraction', () => {
    it('should extract year from time_frame.default.end', () => {
      render(<YtdMonthField {...defaultProps} />);

      expect(screen.getByTestId('option-Jan')).toHaveTextContent('Jan');
    });

    it('should handle different years', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          'ytd-month': {
            values: mockOptions,
          },
          time_frame: {
            default: {
              start: '2023-01-01',
              end: '2023-12-31',
            },
          },
        },
      });

      render(<YtdMonthField {...defaultProps} />);

      expect(screen.getByTestId('option-Jan')).toHaveTextContent('Jan');
    });
  });

  describe('value change', () => {
    it('should call onValueChange when value changes', () => {
      const onValueChange = jest.fn();

      render(<YtdMonthField {...defaultProps} onValueChange={onValueChange} />);

      const option2 = screen.getByTestId('option-Feb');
      fireEvent.click(option2);

      expect(onValueChange).toHaveBeenCalledWith('ytd-month', {
        value: 'Feb',
        label: 'Feb',
      });
    });

    it('should track Google Analytics event when value changes', () => {
      const trackGA = jest.fn();
      (useGoogleAnalytics as jest.Mock).mockReturnValue(trackGA);

      render(<YtdMonthField {...defaultProps} />);

      const option3 = screen.getByTestId('option-Mar');
      fireEvent.click(option3);

      expect(trackGA).toHaveBeenCalledWith({
        event_category: 'YTD Month Select',
        event_action: 'Select',
        event_label: 'Mar',
      });
    });

    it('should call onValueChange after tracking GA', () => {
      const callOrder: string[] = [];
      const trackGA = jest.fn(() => callOrder.push('trackGA'));
      const onValueChange = jest.fn(() => callOrder.push('onValueChange'));

      (useGoogleAnalytics as jest.Mock).mockReturnValue(trackGA);

      render(<YtdMonthField {...defaultProps} onValueChange={onValueChange} />);

      const option = screen.getByTestId('option-Feb');
      fireEvent.click(option);

      expect(callOrder).toEqual(['trackGA', 'onValueChange']);
    });
  });

  describe('value conversion', () => {
    it('should convert numeric values to strings', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          'ytd-month': {
            values: [
              { value: 1, label: 'Jan' },
              { value: 2, label: 'Feb' },
            ],
          },
          time_frame: mockTimeFrame,
        },
      });

      render(<YtdMonthField {...defaultProps} />);

      expect(screen.getByTestId('option-1')).toBeInTheDocument();
      expect(screen.getByTestId('option-2')).toBeInTheDocument();
    });

    it('should convert current value to string', () => {
      const getCurrentValue = jest.fn().mockReturnValue(2);

      render(
        <YtdMonthField {...defaultProps} getCurrentValue={getCurrentValue} />,
      );

      const control = screen.getByTestId('chips-select-component');
      expect(control).toHaveAttribute('data-value', '2');
    });
  });

  describe('conditional rendering', () => {
    it('should render with empty value and no options when no valid options', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          'ytd-month': {
            values: [],
          },
          time_frame: mockTimeFrame,
        },
      });

      const getCurrentValue = jest.fn().mockReturnValue(null);
      render(
        <YtdMonthField {...defaultProps} getCurrentValue={getCurrentValue} />,
      );

      const control = screen.getByTestId('chips-select-component');
      expect(control).toBeInTheDocument();
      expect(control).toHaveAttribute('data-value', '');
      expect(control.querySelectorAll('[data-testid^="option-"]')).toHaveLength(
        0,
      );
    });

    it('should render with empty value and no options when all options have null values', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {
          'ytd-month': {
            values: [
              { value: null, label: 'Invalid' },
              { value: null, label: 'Invalid2' },
            ],
          },
          time_frame: mockTimeFrame,
        },
      });

      const getCurrentValue = jest.fn().mockReturnValue(null);
      render(
        <YtdMonthField {...defaultProps} getCurrentValue={getCurrentValue} />,
      );

      const control = screen.getByTestId('chips-select-component');
      expect(control).toBeInTheDocument();
      expect(control).toHaveAttribute('data-value', '');
      expect(control.querySelectorAll('[data-testid^="option-"]')).toHaveLength(
        0,
      );
    });
  });

  describe('FilterDataAccessor integration', () => {
    it('should use FilterDataAccessor to get options', () => {
      render(<YtdMonthField {...defaultProps} />);
      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
      expect(screen.getByTestId('option-Jan')).toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to ChipsSelect when provided', () => {
      render(
        <YtdMonthField
          {...defaultProps}
          dataTestId="custom"
          fieldKey="ytd_month"
        />,
      );
      expect(screen.getByTestId('custom-ytd_month')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<YtdMonthField {...defaultProps} />);
      expect(screen.getByTestId('chips-select-component')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<YtdMonthField {...defaultProps} />);
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-ytd-month"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});

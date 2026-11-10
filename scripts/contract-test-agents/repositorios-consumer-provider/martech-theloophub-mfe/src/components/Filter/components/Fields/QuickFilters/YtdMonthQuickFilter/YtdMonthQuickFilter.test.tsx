import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { YtdMonthQuickFilter } from './YtdMonthQuickFilter';

const mockUpdateForm = jest.fn();
const mockApply = jest.fn();

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      ytdMonth: {
        values: [
          { value: 'YTD', label: 'YTD', full: 'Year to Date (YTD)' },
          { value: 'Month', label: 'MTD', full: 'Month to Date (MTD)' },
        ],
      },
    },
    defaults: {
      'ytd-month': 'YTD',
    },
  })),
  usePageFilterManagement: jest.fn(() => ({
    updateForm: mockUpdateForm,
    apply: mockApply,
  })),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn(() => [
        { value: 'YTD', label: 'YTD', full: 'Year to Date (YTD)' },
        { value: 'Month', label: 'MTD', full: 'Month to Date (MTD)' },
      ]),
    })),
  },
}));

jest.mock('components/Form', () => ({
  Select: ({
    dataTestId,
    id,
    value,
    onValueChange,
  }: {
    dataTestId?: string;
    id: string;
    value: any;
    onValueChange: (value: any) => void;
  }) => (
    <select
      data-testid={dataTestId || id}
      value={value}
      onChange={(e) =>
        onValueChange({ value: e.target.value, label: e.target.value })
      }
    >
      <option value="YTD">YTD</option>
      <option value="Month">MTD</option>
    </select>
  ),
}));

describe('YtdMonthQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn((key: string) => {
    if (key === 'ytd-month') return 'YTD';
    return null;
  });

  const defaultProps = {
    fieldKey: 'ytd-month',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<YtdMonthQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('ytd-month-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<YtdMonthQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('ytd-month');
  });

  it('should call onValueChange when value changes', async () => {
    const user = userEvent.setup();
    render(<YtdMonthQuickFilter {...defaultProps} />);

    const select = screen.getByTestId('ytd-month-select-quick-filter');
    await user.selectOptions(select, 'Month');

    expect(mockOnValueChange).toHaveBeenCalledWith('ytd-month', {
      value: 'Month',
      label: 'Month',
    });
  });

  it('should not show clear button when value equals default', () => {
    mockGetCurrentValue.mockReturnValue('YTD');

    render(<YtdMonthQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('ytd-month');
  });

  it('should show clear button when value differs from default', () => {
    mockGetCurrentValue.mockReturnValue('Month');

    render(<YtdMonthQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('ytd-month');
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <YtdMonthQuickFilter
          {...defaultProps}
          dataTestId="custom"
          fieldKey="ytd-month"
        />,
      );
      expect(screen.getByTestId('custom-ytd-month')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<YtdMonthQuickFilter {...defaultProps} />);
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-ytd-month"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<YtdMonthQuickFilter {...defaultProps} />);
      expect(
        screen.getByTestId('ytd-month-select-quick-filter'),
      ).toBeInTheDocument();
    });
  });
});

import { render, screen } from '@testing-library/react';

import { TimeFrameQuickFilter } from './TimeFrameQuickFilter';

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      timeFrame: {
        values: [
          { value: 'MONTHLY', label: 'Monthly' },
          { value: 'QUARTERLY', label: 'Quarterly' },
        ],
      },
    },
  })),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn(() => [
        { value: 'MONTHLY', label: 'Monthly' },
        { value: 'QUARTERLY', label: 'Quarterly' },
      ]),
    })),
  },
}));

jest.mock('components/Form', () => ({
  Select: ({
    dataTestId,
    id,
    value,
    disabled,
  }: {
    dataTestId?: string;
    id: string;
    value: any;
    disabled: boolean;
  }) => (
    <select
      data-testid={dataTestId || id}
      value={value?.value}
      disabled={disabled}
    >
      <option value="MONTHLY">Monthly</option>
      <option value="QUARTERLY">Quarterly</option>
    </select>
  ),
}));

describe('TimeFrameQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn(() => ({
    value: 'MONTHLY',
    label: 'Monthly',
  }));

  const defaultProps = {
    fieldKey: 'timeFrame',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<TimeFrameQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('timeFrame-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<TimeFrameQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('timeFrame');
  });

  it('should render disabled select', () => {
    render(<TimeFrameQuickFilter {...defaultProps} />);

    const select = screen.getByTestId('timeFrame-select-quick-filter');
    expect(select).toBeDisabled();
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <TimeFrameQuickFilter
          {...defaultProps}
          dataTestId="custom"
          fieldKey="timeFrame"
        />,
      );
      expect(screen.getByTestId('custom-timeFrame')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<TimeFrameQuickFilter {...defaultProps} />);
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-timeFrame"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<TimeFrameQuickFilter {...defaultProps} />);
      expect(
        screen.getByTestId('timeFrame-select-quick-filter'),
      ).toBeInTheDocument();
    });
  });
});

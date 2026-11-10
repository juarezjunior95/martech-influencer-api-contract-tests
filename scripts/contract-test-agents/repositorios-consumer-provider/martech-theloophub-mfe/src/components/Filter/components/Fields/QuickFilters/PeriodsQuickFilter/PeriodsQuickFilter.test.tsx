import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PeriodsQuickFilter } from './PeriodsQuickFilter';

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      periods: {
        values: [
          { value: 'MAT', label: 'MAT' },
          { value: 'YTD', label: 'YTD' },
        ],
      },
    },
    availableFields: ['periods'],
  })),
  usePageFilterManagement: jest.fn(() => ({
    updateForm: jest.fn(),
    apply: jest.fn(),
  })),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn(() => [
        { value: 'MAT', label: 'MAT' },
        { value: 'YTD', label: 'YTD' },
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
      value={value?.value}
      onChange={(e) =>
        onValueChange({ value: e.target.value, label: e.target.value })
      }
    >
      <option value="MAT">MAT</option>
      <option value="YTD">YTD</option>
    </select>
  ),
}));

describe('PeriodsQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn(() => ({ value: 'MAT', label: 'MAT' }));

  const defaultProps = {
    fieldKey: 'periods',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<PeriodsQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('periods-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<PeriodsQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('periods');
  });

  it('should call onValueChange when value changes', async () => {
    const user = userEvent.setup();
    render(<PeriodsQuickFilter {...defaultProps} />);

    const select = screen.getByTestId('periods-select-quick-filter');
    await user.selectOptions(select, 'YTD');

    expect(mockOnValueChange).toHaveBeenCalledWith('periods', {
      value: 'YTD',
      label: 'YTD',
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <PeriodsQuickFilter
          {...defaultProps}
          dataTestId="custom"
          fieldKey="periods"
        />,
      );
      expect(screen.getByTestId('custom-periods')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<PeriodsQuickFilter {...defaultProps} />);
      expect(
        screen.getByTestId('periods-select-quick-filter'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<PeriodsQuickFilter {...defaultProps} />);
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-periods"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});

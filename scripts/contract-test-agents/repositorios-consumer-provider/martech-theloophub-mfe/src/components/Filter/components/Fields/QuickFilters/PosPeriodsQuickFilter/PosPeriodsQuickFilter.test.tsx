import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PosPeriodsQuickFilter } from './PosPeriodsQuickFilter';

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      posPeriods: {
        values: [
          { value: 'P1', label: 'Period 1' },
          { value: 'P2', label: 'Period 2' },
        ],
      },
    },
    defaults: {
      pos_periods: 'P1',
      time_frame: 2025,
      zone: 'ABI',
    },
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
        { value: 'P1', label: 'Period 1' },
        { value: 'P2', label: 'Period 2' },
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
      <option value="P1">Period 1</option>
      <option value="P2">Period 2</option>
    </select>
  ),
}));

describe('PosPeriodsQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn(() => ({
    value: 'P1',
    label: 'Period 1',
  }));

  const defaultProps = {
    fieldKey: 'posPeriods',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<PosPeriodsQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('posPeriods-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<PosPeriodsQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('posPeriods');
  });

  it('should call onValueChange when value changes', async () => {
    const user = userEvent.setup();
    render(<PosPeriodsQuickFilter {...defaultProps} />);

    const select = screen.getByTestId('posPeriods-select-quick-filter');
    await user.selectOptions(select, 'P2');

    expect(mockOnValueChange).toHaveBeenCalledWith('posPeriods', {
      value: 'P2',
      label: 'P2',
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <PosPeriodsQuickFilter
          {...defaultProps}
          dataTestId="custom"
          fieldKey="pos_periods"
        />,
      );
      expect(screen.getByTestId('custom-pos_periods')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<PosPeriodsQuickFilter {...defaultProps} />);
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-posPeriods"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<PosPeriodsQuickFilter {...defaultProps} />);
      expect(
        screen.getByTestId('posPeriods-select-quick-filter'),
      ).toBeInTheDocument();
    });
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DistributionScopesQuickFilter } from './DistributionScopesQuickFilter';

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      distribution_scopes: {
        values: [
          { value: 'on_trade', label: 'On Trade' },
          { value: 'off_trade', label: 'Off Trade' },
          { value: 'total', label: 'Total' },
        ],
      },
    },
    defaults: {
      distribution_scopes: null,
      country: 'Brazil',
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
        { value: 'on_trade', label: 'On Trade' },
        { value: 'off_trade', label: 'Off Trade' },
        { value: 'total', label: 'Total' },
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
      <option value="on_trade">On Trade</option>
      <option value="off_trade">Off Trade</option>
      <option value="total">Total</option>
    </select>
  ),
}));

describe('DistributionScopesQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn((key: string) => {
    if (key === 'distribution_scopes')
      return { value: 'on_trade', label: 'On Trade' };
    return null;
  });

  const defaultProps = {
    fieldKey: 'distribution_scopes',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<DistributionScopesQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('distribution_scopes-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<DistributionScopesQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('distribution_scopes');
  });

  it('should call onValueChange when value changes', async () => {
    const user = userEvent.setup();
    render(<DistributionScopesQuickFilter {...defaultProps} />);

    const select = screen.getByTestId(
      'distribution_scopes-select-quick-filter',
    );
    await user.selectOptions(select, 'off_trade');

    expect(mockOnValueChange).toHaveBeenCalledWith('distribution_scopes', {
      value: 'off_trade',
      label: 'off_trade',
    });
  });

  it('should handle array value from onValueChange', async () => {
    const user = userEvent.setup();

    jest.mock('components/Form', () => ({
      Select: ({
        id,
        value,
        onValueChange,
      }: {
        id: string;
        value: any;
        onValueChange: (value: any) => void;
      }) => (
        <select
          data-testid={id}
          value={value?.value}
          onChange={(e) =>
            onValueChange([{ value: e.target.value, label: e.target.value }])
          }
        >
          <option value="on_trade">On Trade</option>
          <option value="off_trade">Off Trade</option>
          <option value="total">Total</option>
        </select>
      ),
    }));

    render(<DistributionScopesQuickFilter {...defaultProps} />);

    const select = screen.getByTestId(
      'distribution_scopes-select-quick-filter',
    );
    await user.selectOptions(select, 'total');

    expect(mockOnValueChange).toHaveBeenCalled();
  });

  it('should not call onValueChange when value is empty', () => {
    render(<DistributionScopesQuickFilter {...defaultProps} />);

    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <DistributionScopesQuickFilter
          {...defaultProps}
          dataTestId="custom"
          fieldKey="distribution_scopes"
        />,
      );
      expect(
        screen.getByTestId('custom-distribution_scopes'),
      ).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<DistributionScopesQuickFilter {...defaultProps} />);
      expect(
        screen.getByTestId('distribution_scopes-select-quick-filter'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <DistributionScopesQuickFilter {...defaultProps} />,
      );
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-distribution_scopes"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});

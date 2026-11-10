import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BrandPowerBookScopesQuickFilter } from './BrandPowerBookScopesQuickFilter';

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      brandPowerBookScopes: {
        values: [
          { value: 'SCOPE1', label: 'Scope 1' },
          { value: 'SCOPE2', label: 'Scope 2' },
        ],
      },
    },
    defaults: {
      scopes: 'portfolio',
      sub_scopes: null,
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
        { value: 'SCOPE1', label: 'Scope 1' },
        { value: 'SCOPE2', label: 'Scope 2' },
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
      <option value="SCOPE1">Scope 1</option>
      <option value="SCOPE2">Scope 2</option>
    </select>
  ),
}));

describe('BrandPowerBookScopesQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn(() => ({
    value: 'SCOPE1',
    label: 'Scope 1',
  }));

  const defaultProps = {
    fieldKey: 'brandPowerBookScopes',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<BrandPowerBookScopesQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('brandPowerBookScopes-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<BrandPowerBookScopesQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('brandPowerBookScopes');
  });

  it('should call onValueChange when value changes', async () => {
    const user = userEvent.setup();
    render(<BrandPowerBookScopesQuickFilter {...defaultProps} />);

    const select = screen.getByTestId(
      'brandPowerBookScopes-select-quick-filter',
    );
    await user.selectOptions(select, 'SCOPE2');

    expect(mockOnValueChange).toHaveBeenCalledWith('brandPowerBookScopes', {
      value: 'SCOPE2',
      label: 'SCOPE2',
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <BrandPowerBookScopesQuickFilter
          {...defaultProps}
          dataTestId="custom"
        />,
      );
      expect(
        screen.getByTestId('custom-brandPowerBookScopes'),
      ).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<BrandPowerBookScopesQuickFilter {...defaultProps} />);
      expect(
        screen.getByTestId('brandPowerBookScopes-select-quick-filter'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <BrandPowerBookScopesQuickFilter {...defaultProps} />,
      );
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-brandPowerBookScopes"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});

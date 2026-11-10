import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BrandPowerBookSubScopesQuickFilter } from './BrandPowerBookSubScopesQuickFilter';

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      sub_scopes: {
        values: [
          { value: 'Core', label: 'Core' },
          { value: 'Core+', label: 'Core+' },
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
        { value: 'Core', label: 'Core' },
        { value: 'Core+', label: 'Core+' },
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
      <option value="Core">Core</option>
      <option value="Core+">Core+</option>
    </select>
  ),
}));

describe('BrandPowerBookSubScopesQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn((key: string): any => {
    if (key === 'sub_scopes') return 'Core';
    if (key === 'scopes') return 'portfolio';
    return null;
  });

  const defaultProps = {
    fieldKey: 'sub_scopes',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<BrandPowerBookSubScopesQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('sub_scopes-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<BrandPowerBookSubScopesQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('sub_scopes');
  });

  it('should call onValueChange when value changes', async () => {
    const user = userEvent.setup();
    render(<BrandPowerBookSubScopesQuickFilter {...defaultProps} />);

    const select = screen.getByTestId('sub_scopes-select-quick-filter');
    await user.selectOptions(select, 'Core+');

    expect(mockOnValueChange).toHaveBeenCalledWith('sub_scopes', {
      value: 'Core+',
      label: 'Core+',
    });
  });

  it('should not show clear button when value equals first option', () => {
    mockGetCurrentValue.mockImplementation((key: string): any => {
      if (key === 'sub_scopes') return 'Core'; // first option
      if (key === 'scopes') return 'portfolio';
      return null;
    });

    render(<BrandPowerBookSubScopesQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('sub_scopes');
  });

  it('should show clear button when value differs from first option', () => {
    mockGetCurrentValue.mockImplementation((key: string): any => {
      if (key === 'sub_scopes') return 'Core+'; // not first option
      if (key === 'scopes') return 'portfolio';
      return null;
    });

    render(<BrandPowerBookSubScopesQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('sub_scopes');
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <BrandPowerBookSubScopesQuickFilter
          {...defaultProps}
          dataTestId="custom"
          fieldKey="sub_scopes"
        />,
      );
      expect(screen.getByTestId('custom-sub_scopes')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<BrandPowerBookSubScopesQuickFilter {...defaultProps} />);
      expect(
        screen.getByTestId('sub_scopes-select-quick-filter'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <BrandPowerBookSubScopesQuickFilter {...defaultProps} />,
      );
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-brandPowerBookSubScopes"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});

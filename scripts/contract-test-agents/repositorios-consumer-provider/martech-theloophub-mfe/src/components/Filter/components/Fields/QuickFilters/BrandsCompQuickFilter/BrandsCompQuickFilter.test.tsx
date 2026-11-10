import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BrandsCompQuickFilter } from './BrandsCompQuickFilter';

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      brandsComp: {
        values: [
          { value: 'HEINEKEN', label: 'Heineken' },
          { value: 'CORONA', label: 'Corona' },
        ],
      },
    },
    defaults: {
      brands_comp: null,
      country: 'Brazil',
    },
  })),
  usePageFilterManagement: jest.fn(() => ({
    updateForm: jest.fn(),
    apply: jest.fn(),
  })),
}));

jest.mock('components/BrandImg/BrandImg', () => ({
  BrandImg: () => <div data-testid="brand-img">Brand Image</div>,
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn(() => [
        { value: 'HEINEKEN', label: 'Heineken' },
        { value: 'CORONA', label: 'Corona' },
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
      <option value="HEINEKEN">Heineken</option>
      <option value="CORONA">Corona</option>
    </select>
  ),
}));

describe('BrandsCompQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn(() => ({
    value: 'HEINEKEN',
    label: 'Heineken',
  }));

  const defaultProps = {
    fieldKey: 'brandsComp',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<BrandsCompQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('brandsComp-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<BrandsCompQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('brandsComp');
  });

  it('should call onValueChange when value changes', async () => {
    const user = userEvent.setup();
    render(<BrandsCompQuickFilter {...defaultProps} />);

    const select = screen.getByTestId('brandsComp-select-quick-filter');
    await user.selectOptions(select, 'CORONA');

    expect(mockOnValueChange).toHaveBeenCalledWith('brandsComp', {
      value: 'CORONA',
      label: 'CORONA',
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <BrandsCompQuickFilter
          {...defaultProps}
          dataTestId="custom"
          fieldKey="brands_Comp"
        />,
      );
      expect(screen.getByTestId('custom-brands_Comp')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<BrandsCompQuickFilter {...defaultProps} />);
      expect(
        screen.getByTestId('brandsComp-select-quick-filter'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<BrandsCompQuickFilter {...defaultProps} />);
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-brandsComp"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});

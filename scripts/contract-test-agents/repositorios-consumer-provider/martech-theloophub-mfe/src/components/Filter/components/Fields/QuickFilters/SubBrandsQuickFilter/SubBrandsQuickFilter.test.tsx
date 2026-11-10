import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SubBrandsQuickFilter } from './SubBrandsQuickFilter';

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      subBrands: {
        values: [
          { value: 'SKOL_BEATS', label: 'Skol Beats' },
          { value: 'BRAHMA_EXTRA', label: 'Brahma Extra' },
        ],
      },
    },
    defaults: {
      brands: 'SKOL',
      sub_brands: null,
      country: 'BR',
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
        { value: 'SKOL_BEATS', label: 'Skol Beats' },
        { value: 'BRAHMA_EXTRA', label: 'Brahma Extra' },
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
      <option value="SKOL_BEATS">Skol Beats</option>
      <option value="BRAHMA_EXTRA">Brahma Extra</option>
    </select>
  ),
}));

describe('SubBrandsQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn(() => ({
    value: 'SKOL_BEATS',
    label: 'Skol Beats',
  }));

  const defaultProps = {
    fieldKey: 'subBrands',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<SubBrandsQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('subBrands-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<SubBrandsQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('subBrands');
  });

  it('should call onValueChange when value changes', async () => {
    const user = userEvent.setup();
    render(<SubBrandsQuickFilter {...defaultProps} />);

    const select = screen.getByTestId('subBrands-select-quick-filter');
    await user.selectOptions(select, 'BRAHMA_EXTRA');

    expect(mockOnValueChange).toHaveBeenCalledWith('subBrands', {
      value: 'BRAHMA_EXTRA',
      label: 'BRAHMA_EXTRA',
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <SubBrandsQuickFilter
          {...defaultProps}
          dataTestId="custom"
          fieldKey="subBrands"
        />,
      );
      expect(screen.getByTestId('custom-subBrands')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<SubBrandsQuickFilter {...defaultProps} />);
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-subBrands"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<SubBrandsQuickFilter {...defaultProps} />);
      expect(
        screen.getByTestId('subBrands-select-quick-filter'),
      ).toBeInTheDocument();
    });
  });
});

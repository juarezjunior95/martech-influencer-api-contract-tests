import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BrandsQuickFilter } from './BrandsQuickFilter';

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      brands: {
        values: [
          { value: 'SKOL', label: 'Skol' },
          { value: 'BRAHMA', label: 'Brahma' },
        ],
      },
    },
    defaults: {
      country: 'BR',
      brands: null,
      sub_brands: null,
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
        { value: 'SKOL', label: 'Skol' },
        { value: 'BRAHMA', label: 'Brahma' },
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
      <option value="SKOL">Skol</option>
      <option value="BRAHMA">Brahma</option>
    </select>
  ),
}));

describe('BrandsQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn((key: string) => {
    if (key === 'brands') return { value: 'SKOL', label: 'Skol' };
    if (key === 'country') return { value: 'BR', label: 'Brazil' };
    return null;
  });

  const defaultProps = {
    fieldKey: 'brands',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<BrandsQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('brands-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<BrandsQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('brands');
    expect(mockGetCurrentValue).toHaveBeenCalledWith('country');
  });

  it('should call onValueChange when value changes', async () => {
    const user = userEvent.setup();
    render(<BrandsQuickFilter {...defaultProps} />);

    const select = screen.getByTestId('brands-select-quick-filter');
    await user.selectOptions(select, 'BRAHMA');

    expect(mockOnValueChange).toHaveBeenCalledWith('brands', {
      value: 'BRAHMA',
      label: 'BRAHMA',
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <BrandsQuickFilter
          {...defaultProps}
          dataTestId="custom"
          fieldKey="brands_quick_filter"
        />,
      );
      expect(
        screen.getByTestId('custom-brands_quick_filter'),
      ).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<BrandsQuickFilter {...defaultProps} />);
      expect(
        screen.getByTestId('brands-select-quick-filter'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<BrandsQuickFilter {...defaultProps} />);
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-brands"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});

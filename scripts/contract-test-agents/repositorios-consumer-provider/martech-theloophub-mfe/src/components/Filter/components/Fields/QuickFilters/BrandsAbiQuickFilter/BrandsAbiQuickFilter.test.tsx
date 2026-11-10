import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BrandsAbiQuickFilter } from './BrandsAbiQuickFilter';

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      brandsAbi: {
        values: [
          { value: 'SKOL', label: 'Skol' },
          { value: 'BRAHMA', label: 'Brahma' },
        ],
      },
    },
    defaults: {
      brands_abi: null,
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

describe('BrandsAbiQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn(() => ({ value: 'SKOL', label: 'Skol' }));

  const defaultProps = {
    fieldKey: 'brandsAbi',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<BrandsAbiQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('brandsAbi-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<BrandsAbiQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('brandsAbi');
  });

  it('should call onValueChange when value changes', async () => {
    const user = userEvent.setup();
    render(<BrandsAbiQuickFilter {...defaultProps} />);

    const select = screen.getByTestId('brandsAbi-select-quick-filter');
    await user.selectOptions(select, 'BRAHMA');

    expect(mockOnValueChange).toHaveBeenCalledWith('brandsAbi', {
      value: 'BRAHMA',
      label: 'BRAHMA',
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <BrandsAbiQuickFilter
          {...defaultProps}
          dataTestId="custom"
          fieldKey="brands_Abi"
        />,
      );
      expect(screen.getByTestId('custom-brands_Abi')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<BrandsAbiQuickFilter {...defaultProps} />);
      expect(
        screen.getByTestId('brandsAbi-select-quick-filter'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<BrandsAbiQuickFilter {...defaultProps} />);
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-brandsAbi"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});

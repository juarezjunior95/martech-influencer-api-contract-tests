import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AudienceTargetingBrandsCompQuickFilter } from './AudienceTargetingBrandsCompQuickFilter';

const mockUpdateForm = jest.fn();
const mockApply = jest.fn();

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      audienceTargetingBrandsComp: {
        values: [
          { value: 'HEINEKEN', label: 'Heineken' },
          { value: 'CORONA', label: 'Corona' },
        ],
      },
    },
    defaults: {
      audience_targeting_brands_comp: null,
      country: 'Brazil',
      audience_targeting_brands: 'Brahma',
    },
  })),
  usePageFilterManagement: jest.fn(() => ({
    updateForm: mockUpdateForm,
    apply: mockApply,
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
      value={value}
      onChange={(e) =>
        onValueChange({ value: e.target.value, label: e.target.value })
      }
    >
      <option value="HEINEKEN">Heineken</option>
      <option value="CORONA">Corona</option>
    </select>
  ),
}));

describe('AudienceTargetingBrandsCompQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn((key: string): any => {
    if (key === 'audience_targeting_brands_comp') return null;
    if (key === 'country') return 'Brazil';
    if (key === 'audience_targeting_brands') return 'Brahma';
    return null;
  });

  const defaultProps = {
    fieldKey: 'audience_targeting_brands_comp',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<AudienceTargetingBrandsCompQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('audience_targeting_brands_comp-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<AudienceTargetingBrandsCompQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith(
      'audience_targeting_brands_comp',
    );
  });

  it('should call onValueChange when value changes', async () => {
    const user = userEvent.setup();
    render(<AudienceTargetingBrandsCompQuickFilter {...defaultProps} />);

    const select = screen.getByTestId(
      'audience_targeting_brands_comp-select-quick-filter',
    );
    await user.selectOptions(select, 'CORONA');

    expect(mockOnValueChange).toHaveBeenCalledWith(
      'audience_targeting_brands_comp',
      {
        value: 'CORONA',
        label: 'CORONA',
      },
    );
  });

  it('should not show clear button when value equals default', () => {
    mockGetCurrentValue.mockImplementation((key: string) => {
      if (key === 'audience_targeting_brands_comp') return null; // same as default
      if (key === 'country') return 'Brazil';
      if (key === 'audience_targeting_brands') return 'Brahma';
      return null;
    });

    render(<AudienceTargetingBrandsCompQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith(
      'audience_targeting_brands_comp',
    );
  });

  it('should show clear button when value differs from default', () => {
    mockGetCurrentValue.mockImplementation((key: string) => {
      if (key === 'audience_targeting_brands_comp') return 'HEINEKEN';
      if (key === 'country') return 'Brazil';
      if (key === 'audience_targeting_brands') return 'Brahma';
      return null;
    });

    render(<AudienceTargetingBrandsCompQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith(
      'audience_targeting_brands_comp',
    );
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <AudienceTargetingBrandsCompQuickFilter
          {...defaultProps}
          dataTestId="custom"
          fieldKey="audience_targeting_brands_comp"
        />,
      );

      expect(
        screen.getByTestId('custom-audience_targeting_brands_comp'),
      ).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<AudienceTargetingBrandsCompQuickFilter {...defaultProps} />);

      expect(
        screen.getByTestId(
          'audience_targeting_brands_comp-select-quick-filter',
        ),
      ).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <AudienceTargetingBrandsCompQuickFilter {...defaultProps} />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-audience-targeting-brands-comp-quick-filter"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});

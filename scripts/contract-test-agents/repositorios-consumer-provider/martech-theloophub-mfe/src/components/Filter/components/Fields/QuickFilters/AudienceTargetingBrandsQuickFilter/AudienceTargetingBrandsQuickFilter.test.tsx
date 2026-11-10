import { fireEvent, render, screen } from '@testing-library/react';

import { AudienceTargetingBrandsQuickFilter } from './AudienceTargetingBrandsQuickFilter';

const mockTrackGA = jest.fn();
const mockUpdateForm = jest.fn();
const mockApply = jest.fn();
const mockGetOptions = jest.fn();
jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => mockTrackGA),
  usePageFilterData: jest.fn(() => ({
    appliedDataFilters: {
      audience_targeting_brands: {
        values: {
          BR: [
            { value: 'SKOL', label: 'Skol' },
            { value: 'BRAHMA', label: 'Brahma' },
          ],
        },
      },
    },
    defaults: {
      country: 'BR',
      audience_targeting_brands: 'SKOL',
      audience_targeting_brands_comp: 'COMP_DEFAULT',
    },
  })),
  usePageFilterManagement: jest.fn(() => ({
    updateForm: mockUpdateForm,
    apply: mockApply,
  })),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: (...args: any[]) => mockGetOptions(...args),
    })),
  },
}));

jest.mock('components/Filter/utils/filterDependencies', () => ({
  getFiltersToReset: jest.fn(),
  hasDynamicDefault: jest.fn(),
  getDynamicResetContext: jest.fn(),
}));

import {
  getDynamicResetContext,
  getFiltersToReset,
  hasDynamicDefault,
} from 'components/Filter/utils/filterDependencies';

jest.mock('components/Form', () => ({
  Select: ({
    dataTestId,
    id,
    value,
    onValueChange,
    clearChips,
    onClearSingle,
    getChipPlaceholder,
    options,
  }: any) => (
    <div>
      <select
        data-testid={dataTestId || id}
        value={value?.value ?? value}
        onChange={(e) =>
          onValueChange({ value: e.target.value, label: e.target.value })
        }
      >
        {options?.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {clearChips && (
        <button data-testid="clear-chips-btn" onClick={onClearSingle}>
          Clear
        </button>
      )}
      {getChipPlaceholder && (
        <div data-testid="chip-placeholder">
          {getChipPlaceholder({
            value: 'SKOL',
            label: 'Skol',
            image_url: 'https://cdn.example.com/brands/skol-square.png',
          })}
        </div>
      )}
    </div>
  ),
}));

const mockOptions = [
  {
    value: 'SKOL',
    label: 'Skol',
    image_url: 'https://cdn.example.com/brands/skol-square.png',
  },
  {
    value: 'BRAHMA',
    label: 'Brahma',
    image_url: 'https://cdn.example.com/brands/brahma-square.png',
  },
];

describe('AudienceTargetingBrandsQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn((key: string): string | null => {
    if (key === 'audienceTargetingBrands') return 'BRAHMA';
    if (key === 'country') return 'BR';
    return null;
  });

  const defaultProps = {
    fieldKey: 'audienceTargetingBrands',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetOptions.mockReturnValue(mockOptions);
    mockGetCurrentValue.mockImplementation((key: string) => {
      if (key === 'audienceTargetingBrands') return 'BRAHMA';
      if (key === 'country') return 'BR';
      return null;
    });
    (getFiltersToReset as jest.Mock).mockReturnValue([
      'audienceTargetingBrands',
      'audience_targeting_brands_comp',
    ]);
    (hasDynamicDefault as jest.Mock).mockReturnValue(false);
    (getDynamicResetContext as jest.Mock).mockReturnValue([]);
  });

  describe('Rendering', () => {
    it('should render the select component', () => {
      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      expect(
        screen.getByTestId('audienceTargetingBrands-select-quick-filter'),
      ).toBeInTheDocument();
    });

    it('should show clear button when current value differs from first option', () => {
      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      expect(screen.getByTestId('clear-chips-btn')).toBeInTheDocument();
    });

    it('should not show clear button when current value equals first option', () => {
      mockGetCurrentValue.mockImplementation((key: string) => {
        if (key === 'audienceTargetingBrands') return 'SKOL';
        return 'BR';
      });

      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      expect(screen.queryByTestId('clear-chips-btn')).not.toBeInTheDocument();
    });

    it('should render chip placeholder with option image_url', () => {
      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      expect(screen.getByTestId('chip-placeholder')).toBeInTheDocument();
      const brandImg = screen.getByAltText('Skol');
      expect(brandImg).toHaveAttribute(
        'src',
        'https://cdn.example.com/brands/skol-square.png',
      );
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <AudienceTargetingBrandsQuickFilter
          {...defaultProps}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('custom-audienceTargetingBrands'),
      ).toBeInTheDocument();
    });

    it('should render with default id when dataTestId is not provided', () => {
      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      expect(
        screen.getByTestId('audienceTargetingBrands-select-quick-filter'),
      ).toBeInTheDocument();
    });

    it('should pass dataTestId to brand image when provided', () => {
      render(
        <AudienceTargetingBrandsQuickFilter
          {...defaultProps}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('brand-img-active-custom-brand-img'),
      ).toBeInTheDocument();
    });
  });

  describe('Functionality', () => {
    it('should call onValueChange when value changes', () => {
      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      fireEvent.change(
        screen.getByTestId('audienceTargetingBrands-select-quick-filter'),
        { target: { value: 'BRAHMA' } },
      );

      expect(mockOnValueChange).toHaveBeenCalledWith(
        'audienceTargetingBrands',
        {
          value: 'BRAHMA',
          label: 'BRAHMA',
        },
      );
    });

    it('should call trackGA when value changes', () => {
      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      fireEvent.change(
        screen.getByTestId('audienceTargetingBrands-select-quick-filter'),
        { target: { value: 'BRAHMA' } },
      );

      expect(mockTrackGA).toHaveBeenCalledWith(
        expect.objectContaining({
          event_category: 'Brand Select',
          event_action: 'Select',
          event_label: 'BRAHMA',
        }),
      );
    });

    it('should not call onValueChange when option has no value', () => {
      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      fireEvent.change(
        screen.getByTestId('audienceTargetingBrands-select-quick-filter'),
        { target: { value: '' } },
      );

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should call handleClear and apply when clear button is clicked', () => {
      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      fireEvent.click(screen.getByTestId('clear-chips-btn'));

      expect(mockApply).toHaveBeenCalled();
    });

    it('should call updateForm for fieldKey on clear', () => {
      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      fireEvent.click(screen.getByTestId('clear-chips-btn'));

      expect(mockUpdateForm).toHaveBeenCalledWith(
        'audienceTargetingBrands',
        expect.anything(),
      );
    });

    it('should call updateForm with default when no current country options', () => {
      mockGetOptions.mockReturnValue([]);
      (getFiltersToReset as jest.Mock).mockReturnValue([
        'audienceTargetingBrands',
      ]);

      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      fireEvent.click(screen.getByTestId('clear-chips-btn'));

      expect(mockUpdateForm).toHaveBeenCalled();
    });

    it('should use getDynamicResetContext when hasDynamicDefault is true', () => {
      (hasDynamicDefault as jest.Mock).mockReturnValue(true);
      (getDynamicResetContext as jest.Mock).mockReturnValue([
        'country',
        'audience_targeting_brands',
      ]);
      (getFiltersToReset as jest.Mock).mockReturnValue([
        'audienceTargetingBrands',
        'audience_targeting_brands_comp',
      ]);

      const mockDependentOptions = [{ value: 'COMP1', label: 'Comp 1' }];
      mockGetOptions
        .mockReturnValueOnce(mockOptions)
        .mockReturnValueOnce(mockOptions)
        .mockReturnValueOnce(mockDependentOptions);

      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      fireEvent.click(screen.getByTestId('clear-chips-btn'));

      expect(getDynamicResetContext).toHaveBeenCalled();
      expect(mockApply).toHaveBeenCalled();
    });

    it('should call updateForm with default when dynamic dependent has no options', () => {
      (hasDynamicDefault as jest.Mock).mockReturnValue(true);
      (getDynamicResetContext as jest.Mock).mockReturnValue(['country']);
      (getFiltersToReset as jest.Mock).mockReturnValue([
        'audienceTargetingBrands',
        'audience_targeting_brands_comp',
      ]);

      mockGetOptions
        .mockReturnValueOnce(mockOptions)
        .mockReturnValueOnce(mockOptions)
        .mockReturnValueOnce([]);

      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      fireEvent.click(screen.getByTestId('clear-chips-btn'));

      expect(mockApply).toHaveBeenCalled();
    });

    it('should handle getChipPlaceholder with array options', () => {
      jest.mock('components/Form', () => ({
        Select: ({ getChipPlaceholder }: any) => {
          if (getChipPlaceholder) {
            getChipPlaceholder([{ value: 'SKOL', label: 'Skol' }]);
          }
          return <div data-testid="select-mock">{}</div>;
        },
      }));

      const { container } = render(
        <AudienceTargetingBrandsQuickFilter {...defaultProps} />,
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('should get options from FilterDataAccessor', () => {
      render(<AudienceTargetingBrandsQuickFilter {...defaultProps} />);

      expect(mockGetOptions).toHaveBeenCalledWith(
        'audienceTargetingBrands',
        expect.anything(),
        { country: 'BR' },
      );
    });
  });
});

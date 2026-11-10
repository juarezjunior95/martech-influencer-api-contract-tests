import React from 'react';

import { render, screen } from '@testing-library/react';
import { FILTER_MODAL_NAME } from 'components/Filter';
import { useScopedModal } from 'contexts';
import { FilterDataAccessor } from 'domain/Filter';
import { useCurrentPage, usePageFilterApplied, usePageFilterData } from 'hooks';
import {
  ALL_BRAND,
  FilterDataStructure,
  FilterForm,
  Option,
} from 'models/Filters';

import { SubFilterBrandCompetitor } from './SubFilterBrandCompetitor';

jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(),
  usePageFilterApplied: jest.fn(),
  usePageFilterData: jest.fn(),
  useBrandImage: jest.fn(() => undefined),
}));

jest.mock('contexts', () => ({
  useScopedModal: jest.fn(),
}));

jest.mock('domain/Filter', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(),
  },
}));

jest.mock(
  '../SubFilterBrandCompetitorView/SubFilterBrandCompetitorView',
  () => ({
    SubFilterBrandCompetitorView: ({
      competitorIsActive,
      hasBrandAbi,
      brand,
      brandCompetitor,
      onOpenModal,
      selectButtonLabel,
      brandAbiFieldValue,
    }: any) => (
      <div data-testid="subfilter-brand-competitor-view">
        <div data-testid="competitor-is-active">
          {String(Boolean(competitorIsActive))}
        </div>
        <div data-testid="has-brand-abi">{String(Boolean(hasBrandAbi))}</div>
        <div data-testid="brand">{brand || 'no-brand'}</div>
        <div data-testid="brand-competitor">
          {brandCompetitor?.label || 'no-competitor'}
        </div>
        <div data-testid="select-button-label">{selectButtonLabel}</div>
        <div data-testid="brand-abi-field-value">
          {brandAbiFieldValue || 'no-value'}
        </div>
        <button onClick={onOpenModal} data-testid="open-modal-button">
          Open Modal
        </button>
      </div>
    ),
  }),
);

describe('SubFilterBrandCompetitor', () => {
  const mockUseCurrentPage = useCurrentPage as jest.MockedFunction<
    typeof useCurrentPage
  >;
  const mockUsePageFilterApplied = usePageFilterApplied as jest.MockedFunction<
    typeof usePageFilterApplied
  >;
  const mockUsePageFilterData = usePageFilterData as jest.MockedFunction<
    typeof usePageFilterData
  >;
  const mockUseScopedModal = useScopedModal as jest.MockedFunction<
    typeof useScopedModal
  >;
  const mockGetInstance = FilterDataAccessor.getInstance as jest.MockedFunction<
    typeof FilterDataAccessor.getInstance
  >;

  const mockOpenModal = jest.fn();
  const mockGetBrandComp = jest.fn();
  const mockGetBrandFamilyAbi = jest.fn();

  const mockDataFilters: FilterDataStructure = {
    brands_abi: {
      enabled: true,
      default: { value: 'all', label: 'All' },
      values: {
        BR: [
          {
            group: 'Core Brands',
            values: [
              { value: 'brahma', label: 'Brahma' },
              { value: 'skol', label: 'Skol' },
            ],
          },
        ],
      },
    },
    brands_comp: {
      enabled: true,
      default: { value: 'all', label: 'All' },
      values: {
        BR: [
          {
            group: 'Competitors',
            values: [
              { value: 'heineken', label: 'Heineken' },
              { value: 'budweiser', label: 'Budweiser' },
            ],
          },
        ],
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCurrentPage.mockReturnValue({
      currentPage: 'test-page',
    } as any);

    mockUseScopedModal.mockReturnValue({
      open: mockOpenModal,
      close: jest.fn(),
      toggle: jest.fn(),
      isOpen: false,
    } as any);

    mockGetInstance.mockReturnValue({
      getBrandComp: mockGetBrandComp,
      getBrandFamilyAbi: mockGetBrandFamilyAbi,
    } as any);
  });

  describe('Basic Rendering', () => {
    it('should render SubFilterBrandCompetitorView component', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      mockGetBrandComp.mockReturnValue(undefined);
      mockGetBrandFamilyAbi.mockReturnValue(undefined);

      render(<SubFilterBrandCompetitor />);

      expect(
        screen.getByTestId('subfilter-brand-competitor-view'),
      ).toBeInTheDocument();
    });

    it('should use correct modal name from FILTER_MODAL_NAME', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(mockUseScopedModal).toHaveBeenCalledWith(FILTER_MODAL_NAME);
    });
  });

  describe('Hook Integration', () => {
    it('should call useCurrentPage to get current page', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(mockUseCurrentPage).toHaveBeenCalled();
    });

    it('should call usePageFilterApplied with current page', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(mockUsePageFilterApplied).toHaveBeenCalledWith('test-page');
    });

    it('should call usePageFilterData with current page', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(mockUsePageFilterData).toHaveBeenCalledWith('test-page');
    });
  });

  describe('brandComp useMemo', () => {
    it('should return undefined when dataFilters is null', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { brands_comp: 'heineken' },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: null,
      } as any);

      mockGetBrandComp.mockReturnValue(undefined);

      render(<SubFilterBrandCompetitor />);

      expect(mockGetBrandComp).not.toHaveBeenCalled();
      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'no-competitor',
      );
    });

    it('should return undefined when applied is null', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: null,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      mockGetBrandComp.mockReturnValue(undefined);

      render(<SubFilterBrandCompetitor />);

      expect(mockGetBrandComp).not.toHaveBeenCalled();
      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'no-competitor',
      );
    });

    it('should call accessor.getBrandComp with dataFilters and applied', () => {
      const mockApplied: FilterForm = {
        country: 'BR',
        brands_comp: 'heineken',
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: mockApplied,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      const mockBrandCompOption: Option = {
        value: 'heineken',
        label: 'Heineken',
      };

      mockGetBrandComp.mockReturnValue(mockBrandCompOption);

      render(<SubFilterBrandCompetitor />);

      expect(mockGetBrandComp).toHaveBeenCalledWith(
        mockDataFilters,
        mockApplied,
      );
      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'Heineken',
      );
    });
  });

  describe('brandFamilyAbi useMemo', () => {
    it('should return undefined when dataFilters is null', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { brands_abi: 'brahma' },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: null,
      } as any);

      mockGetBrandFamilyAbi.mockReturnValue(undefined);

      render(<SubFilterBrandCompetitor />);

      expect(mockGetBrandFamilyAbi).not.toHaveBeenCalled();
      expect(screen.getByTestId('brand')).toHaveTextContent('no-brand');
    });

    it('should return undefined when applied is null', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: null,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      mockGetBrandFamilyAbi.mockReturnValue(undefined);

      render(<SubFilterBrandCompetitor />);

      expect(mockGetBrandFamilyAbi).not.toHaveBeenCalled();
      expect(screen.getByTestId('brand')).toHaveTextContent('no-brand');
    });

    it('should call accessor.getBrandFamilyAbi with dataFilters and applied', () => {
      const mockApplied: FilterForm = {
        country: 'BR',
        brands_abi: 'brahma',
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: mockApplied,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      const mockBrandFamily = {
        group: 'Core Brands',
        values: [
          { value: 'brahma', label: 'Brahma' },
          { value: 'skol', label: 'Skol' },
        ],
      };

      mockGetBrandFamilyAbi.mockReturnValue(mockBrandFamily);

      render(<SubFilterBrandCompetitor />);

      expect(mockGetBrandFamilyAbi).toHaveBeenCalledWith(
        mockDataFilters,
        mockApplied,
      );
      expect(screen.getByTestId('brand')).toHaveTextContent('Core Brands');
    });
  });

  describe('competitorIsActive calculation', () => {
    it('should be false when brands_comp is not set', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'false',
      );
    });

    it('should be false when brands_comp is ALL_BRAND', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { brands_comp: ALL_BRAND },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'false',
      );
    });

    it('should be true when brands_comp is set and not ALL_BRAND', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { brands_comp: 'heineken' },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'true',
      );
    });

    it('should be false when applied is null', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: null,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'false',
      );
    });
  });

  describe('hasBrandAbi calculation', () => {
    it('should be false when brands_abi is not set', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('false');
    });

    it('should be false when brands_abi is ALL_BRAND', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { brands_abi: ALL_BRAND },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('false');
    });

    it('should be true when brands_abi is set and not ALL_BRAND', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { brands_abi: 'brahma' },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('true');
    });

    it('should be false when applied is null', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: null,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('false');
    });
  });

  describe('Props passed to SubFilterBrandCompetitorView', () => {
    it('should pass correct props with both brands_abi and brands_comp active', () => {
      const mockApplied: FilterForm = {
        country: 'BR',
        brands_abi: 'brahma',
        brands_comp: 'heineken',
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: mockApplied,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      const mockBrandFamily = {
        group: 'Core Brands',
        values: [{ value: 'brahma', label: 'Brahma' }],
      };

      const mockBrandComp: Option = {
        value: 'heineken',
        label: 'Heineken',
      };

      mockGetBrandFamilyAbi.mockReturnValue(mockBrandFamily);
      mockGetBrandComp.mockReturnValue(mockBrandComp);

      render(<SubFilterBrandCompetitor />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'true',
      );
      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('true');
      expect(screen.getByTestId('brand')).toHaveTextContent('Core Brands');
      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'Heineken',
      );
      expect(screen.getByTestId('select-button-label')).toHaveTextContent(
        'Select a Competitor',
      );
      expect(screen.getByTestId('brand-abi-field-value')).toHaveTextContent(
        'brahma',
      );
    });

    it('should pass correct props with only brands_abi active', () => {
      const mockApplied: FilterForm = {
        country: 'BR',
        brands_abi: 'skol',
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: mockApplied,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      const mockBrandFamily = {
        group: 'Core Brands',
        values: [{ value: 'skol', label: 'Skol' }],
      };

      mockGetBrandFamilyAbi.mockReturnValue(mockBrandFamily);
      mockGetBrandComp.mockReturnValue(undefined);

      render(<SubFilterBrandCompetitor />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'false',
      );
      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('true');
      expect(screen.getByTestId('brand')).toHaveTextContent('Core Brands');
      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'no-competitor',
      );
      expect(screen.getByTestId('brand-abi-field-value')).toHaveTextContent(
        'skol',
      );
    });

    it('should pass correct props with only brands_comp active', () => {
      const mockApplied: FilterForm = {
        country: 'BR',
        brands_comp: 'budweiser',
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: mockApplied,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      const mockBrandComp: Option = {
        value: 'budweiser',
        label: 'Budweiser',
      };

      mockGetBrandFamilyAbi.mockReturnValue(undefined);
      mockGetBrandComp.mockReturnValue(mockBrandComp);

      render(<SubFilterBrandCompetitor />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'true',
      );
      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('false');
      expect(screen.getByTestId('brand')).toHaveTextContent('no-brand');
      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'Budweiser',
      );
    });

    it('should pass correct props when neither is active', () => {
      const mockApplied: FilterForm = {
        country: 'BR',
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: mockApplied,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      mockGetBrandFamilyAbi.mockReturnValue(undefined);
      mockGetBrandComp.mockReturnValue(undefined);

      render(<SubFilterBrandCompetitor />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'false',
      );
      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('false');
      expect(screen.getByTestId('brand')).toHaveTextContent('no-brand');
      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'no-competitor',
      );
    });
  });

  describe('Modal Integration', () => {
    it('should pass openModal callback to view', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      const button = screen.getByTestId('open-modal-button');
      button.click();

      expect(mockOpenModal).toHaveBeenCalledTimes(1);
    });

    it('should get modal functions from useScopedModal', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(mockUseScopedModal).toHaveBeenCalledWith(FILTER_MODAL_NAME);
    });
  });

  describe('FilterDataAccessor singleton', () => {
    it('should get singleton instance of FilterDataAccessor', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(mockGetInstance).toHaveBeenCalled();
    });

    it('should use same accessor instance for both memos', () => {
      const mockApplied: FilterForm = {
        country: 'BR',
        brands_abi: 'brahma',
        brands_comp: 'heineken',
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: mockApplied,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(mockGetInstance).toHaveBeenCalledTimes(1);

      expect(mockGetBrandComp).toHaveBeenCalledWith(
        mockDataFilters,
        mockApplied,
      );
      expect(mockGetBrandFamilyAbi).toHaveBeenCalledWith(
        mockDataFilters,
        mockApplied,
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined applied gracefully', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: undefined,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(
        screen.getByTestId('subfilter-brand-competitor-view'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'false',
      );
      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('false');
    });

    it('should handle undefined dataFilters gracefully', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { brands_abi: 'brahma' },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: undefined,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(
        screen.getByTestId('subfilter-brand-competitor-view'),
      ).toBeInTheDocument();
    });

    it('should handle empty applied object', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'false',
      );
      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('false');
    });

    it('should handle brandFamilyAbi without group property', () => {
      const mockApplied: FilterForm = {
        country: 'BR',
        brands_abi: 'brahma',
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: mockApplied,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      mockGetBrandFamilyAbi.mockReturnValue({
        values: [{ value: 'brahma', label: 'Brahma' }],
      } as any);

      render(<SubFilterBrandCompetitor />);

      expect(
        screen.getByTestId('subfilter-brand-competitor-view'),
      ).toBeInTheDocument();
    });
  });

  describe('Re-render and Memoization', () => {
    it('should recalculate brandComp when applied changes', () => {
      const { rerender } = render(<SubFilterBrandCompetitor />);

      mockUsePageFilterApplied.mockReturnValue({
        applied: { brands_comp: 'heineken' },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      mockGetBrandComp.mockReturnValue({
        value: 'heineken',
        label: 'Heineken',
      });

      rerender(<SubFilterBrandCompetitor />);

      expect(mockGetBrandComp).toHaveBeenCalled();
    });

    it('should recalculate brandFamilyAbi when dataFilters changes', () => {
      const { rerender } = render(<SubFilterBrandCompetitor />);

      mockUsePageFilterApplied.mockReturnValue({
        applied: { brands_abi: 'brahma' },
      } as any);

      const newDataFilters = { ...mockDataFilters };
      mockUsePageFilterData.mockReturnValue({
        dataFilters: newDataFilters,
      } as any);

      mockGetBrandFamilyAbi.mockReturnValue({
        group: 'Core Brands',
        values: [{ value: 'brahma', label: 'Brahma' }],
      });

      rerender(<SubFilterBrandCompetitor />);

      expect(mockGetBrandFamilyAbi).toHaveBeenCalled();
    });
  });
});

import React from 'react';

import { render, screen } from '@testing-library/react';
import { FILTER_MODAL_NAME } from 'components/Filter';
import { useScopedModal } from 'contexts';
import { useCurrentPage, usePageFilterApplied, usePageFilterData } from 'hooks';
import { ALL_BRAND, FilterDataStructure } from 'models/Filters';

import { SubFilterBrandCompetitorAudienceTargeting } from './SubFilterBrandCompetitorAudienceTargeting';

jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(),
  usePageFilterApplied: jest.fn(),
  usePageFilterData: jest.fn(),
}));

jest.mock('contexts', () => ({
  useScopedModal: jest.fn(),
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

describe('SubFilterBrandCompetitorAudienceTargeting', () => {
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

  const mockOpen = jest.fn();

  const mockDataFilters: FilterDataStructure = {
    audience_targeting_brands: {
      enabled: true,
      default: { value: 'all', label: 'All' },
      values: {
        BR: [
          {
            value: 'brahma',
            label: 'Brahma',
            competitor: [
              { value: 'heineken', label: 'Heineken' },
              { value: 'corona', label: 'Corona' },
            ],
          },
          {
            value: 'skol',
            label: 'Skol',
            competitor: [{ value: 'budweiser', label: 'Budweiser' }],
          },
        ],
        AR: [
          {
            value: 'quilmes',
            label: 'Quilmes',
            competitor: [{ value: 'stella', label: 'Stella Artois' }],
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
      open: mockOpen,
      close: jest.fn(),
      toggle: jest.fn(),
      isOpen: false,
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

      render(<SubFilterBrandCompetitorAudienceTargeting />);

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

      render(<SubFilterBrandCompetitorAudienceTargeting />);

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

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(mockUseCurrentPage).toHaveBeenCalled();
    });

    it('should call usePageFilterApplied with current page', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(mockUsePageFilterApplied).toHaveBeenCalledWith('test-page');
    });

    it('should call usePageFilterData with current page', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(mockUsePageFilterData).toHaveBeenCalledWith('test-page');
    });
  });

  describe('brandFamilyAbi useMemo', () => {
    it('should return audience_targeting_brands from applied', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand')).toHaveTextContent('brahma');
    });

    it('should return undefined when applied is null', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: null,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand')).toHaveTextContent('no-brand');
    });

    it('should return undefined when audience_targeting_brands is not set', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand')).toHaveTextContent('no-brand');
    });

    it('should recalculate when audience_targeting_brands changes', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      const { rerender } = render(
        <SubFilterBrandCompetitorAudienceTargeting />,
      );

      expect(screen.getByTestId('brand')).toHaveTextContent('brahma');

      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          audience_targeting_brands: 'skol',
        },
      } as any);

      rerender(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand')).toHaveTextContent('skol');
    });
  });

  describe('competitorIsActive calculation', () => {
    it('should be false when audience_targeting_brands is not set', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'false',
      );
    });

    it('should be false when audience_targeting_brands is ALL_BRAND', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          audience_targeting_brands: ALL_BRAND,
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'false',
      );
    });

    it('should be true when audience_targeting_brands is set and not ALL_BRAND', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

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

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'false',
      );
    });
  });

  describe('hasBrandAbi calculation', () => {
    it('should be false when audience_targeting_brands is not set', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('false');
    });

    it('should be false when audience_targeting_brands is ALL_BRAND', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          audience_targeting_brands: ALL_BRAND,
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('false');
    });

    it('should be true when audience_targeting_brands is set and not ALL_BRAND', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          audience_targeting_brands: 'skol',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('true');
    });

    it('should be false when applied is null', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: null,
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('false');
    });

    it('should match competitorIsActive value', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      const competitorIsActive = screen.getByTestId(
        'competitor-is-active',
      ).textContent;
      const hasBrandAbi = screen.getByTestId('has-brand-abi').textContent;

      expect(competitorIsActive).toBe(hasBrandAbi);
    });
  });

  describe('brandCompetitor useMemo', () => {
    it('should find competitor from dataFilters based on country and brand', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'Heineken',
      );
    });

    it('should return first competitor from competitor array', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
          audience_targeting_brands: 'skol',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'Budweiser',
      );
    });

    it('should return undefined when country is not set', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'no-competitor',
      );
    });

    it('should return undefined when dataFilters is null', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: null,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'no-competitor',
      );
    });

    it('should return undefined when brand is not found', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
          audience_targeting_brands: 'invalid-brand',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'no-competitor',
      );
    });

    it('should return undefined when competitor array is empty', () => {
      const dataFiltersNoCompetitors: FilterDataStructure = {
        audience_targeting_brands: {
          enabled: true,
          default: { value: 'all', label: 'All' },
          values: {
            BR: [
              {
                value: 'brahma',
                label: 'Brahma',
                competitor: [],
              },
            ],
          },
        },
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: dataFiltersNoCompetitors,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'no-competitor',
      );
    });

    it('should return undefined when competitor property is missing', () => {
      const dataFiltersNoCompProp: FilterDataStructure = {
        audience_targeting_brands: {
          enabled: true,
          default: { value: 'all', label: 'All' },
          values: {
            BR: [
              {
                value: 'brahma',
                label: 'Brahma',
              },
            ],
          },
        },
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: dataFiltersNoCompProp,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'no-competitor',
      );
    });

    it('should handle different countries', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'AR',
          audience_targeting_brands: 'quilmes',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'Stella Artois',
      );
    });
  });

  describe('Props passed to SubFilterBrandCompetitorView', () => {
    it('should pass correct props when brand is active', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'true',
      );
      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('true');
      expect(screen.getByTestId('brand')).toHaveTextContent('brahma');
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

    it('should pass correct props when no brand is active', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'false',
      );
      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('false');
      expect(screen.getByTestId('brand')).toHaveTextContent('no-brand');
      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'no-competitor',
      );
    });

    it('should pass correct props when brand is ALL_BRAND', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
          audience_targeting_brands: ALL_BRAND,
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'false',
      );
      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('false');
      expect(screen.getByTestId('brand')).toHaveTextContent(ALL_BRAND);
    });
  });

  describe('Modal Integration', () => {
    it('should pass open callback to view', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      const button = screen.getByTestId('open-modal-button');
      button.click();

      expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it('should get open function from useScopedModal', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {},
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(mockUseScopedModal).toHaveBeenCalledWith(FILTER_MODAL_NAME);
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

      render(<SubFilterBrandCompetitorAudienceTargeting />);

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
        applied: {
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: undefined,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

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

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('competitor-is-active')).toHaveTextContent(
        'false',
      );
      expect(screen.getByTestId('has-brand-abi')).toHaveTextContent('false');
    });

    it('should handle empty dataFilters values', () => {
      const emptyDataFilters: FilterDataStructure = {
        audience_targeting_brands: {
          enabled: true,
          default: { value: 'all', label: 'All' },
          values: {},
        },
      };

      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: emptyDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'no-competitor',
      );
    });

    it('should handle country not in dataFilters', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'US',
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      render(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'no-competitor',
      );
    });
  });

  describe('Re-render and Memoization', () => {
    it('should recalculate brandCompetitor when applied changes', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      const { rerender } = render(
        <SubFilterBrandCompetitorAudienceTargeting />,
      );

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'Heineken',
      );

      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
          audience_targeting_brands: 'skol',
        },
      } as any);

      rerender(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'Budweiser',
      );
    });

    it('should recalculate brandCompetitor when dataFilters changes', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      const { rerender } = render(
        <SubFilterBrandCompetitorAudienceTargeting />,
      );

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'Heineken',
      );

      const newDataFilters: FilterDataStructure = {
        audience_targeting_brands: {
          enabled: true,
          default: { value: 'all', label: 'All' },
          values: {
            BR: [
              {
                value: 'brahma',
                label: 'Brahma',
                competitor: [{ value: 'corona', label: 'Corona' }],
              },
            ],
          },
        },
      };

      mockUsePageFilterData.mockReturnValue({
        dataFilters: newDataFilters,
      } as any);

      rerender(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'Corona',
      );
    });

    it('should recalculate when country changes', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'BR',
          audience_targeting_brands: 'brahma',
        },
      } as any);

      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
      } as any);

      const { rerender } = render(
        <SubFilterBrandCompetitorAudienceTargeting />,
      );

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'Heineken',
      );

      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          country: 'AR',
          audience_targeting_brands: 'quilmes',
        },
      } as any);

      rerender(<SubFilterBrandCompetitorAudienceTargeting />);

      expect(screen.getByTestId('brand-competitor')).toHaveTextContent(
        'Stella Artois',
      );
    });
  });
});

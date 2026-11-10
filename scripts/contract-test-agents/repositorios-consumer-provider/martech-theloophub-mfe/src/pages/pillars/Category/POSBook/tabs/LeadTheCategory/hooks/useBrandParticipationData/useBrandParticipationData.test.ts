import { renderHook } from '@testing-library/react-hooks';
import { useBffData, usePageFilterApplied, useSubFilters } from 'hooks';
import { RankedContainerData } from 'pages/components/BrandRanking/types';

import { KPIS_BFF } from '../../../../enums';
import { VIEW_TYPES } from '../../constants';
import { useBrandParticipationData } from './useBrandParticipationData';

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
  useSubFilters: jest.fn(),
  useBffData: jest.fn(),
}));

const mockTableData = [{ id: '1', value: 100 }];
const mockRanking: RankedContainerData = {
  labels: [['ABI', '']] as [string, string][],
  datasets: [
    {
      data: [100],
      source: ['abi'],
      unitMeasure: ['%'],
    },
  ],
};

beforeEach(() => {
  jest.clearAllMocks();
  (usePageFilterApplied as jest.Mock).mockReturnValue({ isGlobalZone: true });
  (useSubFilters as jest.Mock).mockReturnValue({
    activeSubFilters: {
      cohorts: 'All',
      'price-segments-brand': '',
    },
  });
  (useBffData as jest.Mock).mockReturnValue({
    data: { comp1: { jsonataData: mockTableData } },
    loading: false,
    error: null,
    refetch: jest.fn(),
  });
});

describe('useBrandParticipationData', () => {
  describe('BFF configuration - portfolio view', () => {
    it('should use global portfolio BFF id when global zone', () => {
      renderHook(() => useBrandParticipationData(VIEW_TYPES.PORTFOLIO));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.id).toBe(
        KPIS_BFF.LEAD_THE_CATEGORY.brandParticipationPortfolioGlobal.id,
      );
    });

    it('should use country portfolio BFF id when country zone', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: false,
      });

      renderHook(() => useBrandParticipationData(VIEW_TYPES.PORTFOLIO));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.id).toBe(
        KPIS_BFF.LEAD_THE_CATEGORY.brandParticipationPortfolioCountry.id,
      );
    });
  });

  describe('BFF configuration - global-brands view', () => {
    it('should use global brands BFF id', () => {
      renderHook(() => useBrandParticipationData(VIEW_TYPES.GLOBAL_BRANDS));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.id).toBe(
        KPIS_BFF.LEAD_THE_CATEGORY.brandParticipationGlobalBrands.id,
      );
    });
  });

  describe('BFF configuration - rankings view', () => {
    it('should use global ranking BFF id when global zone', () => {
      renderHook(() => useBrandParticipationData(VIEW_TYPES.RANKINGS));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.id).toBe(KPIS_BFF.LEAD_THE_CATEGORY.brandRankingGlobal.id);
    });

    it('should use country ranking BFF id when country zone', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: false,
      });

      renderHook(() => useBrandParticipationData(VIEW_TYPES.RANKINGS));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.id).toBe(KPIS_BFF.LEAD_THE_CATEGORY.brandRankingCountry.id);
    });

    it('should pass cohort and price_segment in subFilters for country rankings', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: false,
      });
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: {
          cohorts: 'Premium',
          'price-segments-brand': 'Mainstream',
        },
      });

      renderHook(() => useBrandParticipationData(VIEW_TYPES.RANKINGS));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.subFilters).toEqual({
        cohort: 'Premium',
        price_segment: 'Mainstream',
      });
    });

    it('should not include price_segment for global rankings', () => {
      renderHook(() => useBrandParticipationData(VIEW_TYPES.RANKINGS));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.subFilters.price_segment).toBeNull();
    });

    it('should not include price_segment for country portfolio even when filter is selected', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: false,
      });
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: {
          cohorts: 'Premium',
          'price-segments-brand': 'Mainstream',
        },
      });

      renderHook(() => useBrandParticipationData(VIEW_TYPES.PORTFOLIO));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.subFilters).toEqual({
        cohort: 'Premium',
        price_segment: null,
      });
    });

    it('should pass kpiGroup as pos', () => {
      renderHook(() => useBrandParticipationData(VIEW_TYPES.PORTFOLIO));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.kpiGroup).toBe('pos');
    });
  });

  describe('return values', () => {
    it('should return ranking data when available', () => {
      (useBffData as jest.Mock).mockReturnValue({
        data: { comp1: mockRanking },
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() =>
        useBrandParticipationData(VIEW_TYPES.RANKINGS),
      );

      expect(result.current.data?.ranking).toEqual(mockRanking);
    });

    it('should return null tableData and ranking when first component is null', () => {
      (useBffData as jest.Mock).mockReturnValue({
        data: { comp1: null },
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() =>
        useBrandParticipationData(VIEW_TYPES.PORTFOLIO),
      );

      expect(result.current.data).toEqual({
        tableData: null,
        ranking: null,
      });
    });

    it('should return tableData and null ranking when first component is a plain table', () => {
      (useBffData as jest.Mock).mockReturnValue({
        data: { comp1: mockTableData },
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() =>
        useBrandParticipationData(VIEW_TYPES.PORTFOLIO),
      );

      expect(result.current.data).toEqual({
        tableData: mockTableData,
        ranking: null,
      });
    });

    it('should return null data when loading', () => {
      (useBffData as jest.Mock).mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() =>
        useBrandParticipationData(VIEW_TYPES.PORTFOLIO),
      );

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(true);
    });

    it('should return error when request fails', () => {
      const mockError = new Error('Request failed');
      (useBffData as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() =>
        useBrandParticipationData(VIEW_TYPES.PORTFOLIO),
      );

      expect(result.current.error).toBe(mockError);
    });
  });
});

import { renderHook } from '@testing-library/react-hooks';

import { KPIS_BFF } from '../../../../enums';
import { VIEW_TYPES } from '../../constants';
import { useGrowTheCategoryData } from './useGrowTheCategoryData';

jest.mock('hooks', () => ({
  useSubFilters: jest.fn(),
  useBffData: jest.fn(),
}));

import { useBffData, useSubFilters } from 'hooks';

const mockParticipationData = [{ id: '1', value: 100 }];

const defaultSubFilters = {
  activeSubFilters: {
    pos_kpi: 'participation',
    'cohorts-grow': 'All',
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  (useSubFilters as jest.Mock).mockReturnValue(defaultSubFilters);
  (useBffData as jest.Mock).mockReturnValue({
    data: { country: mockParticipationData },
    loading: false,
    error: null,
    refetch: jest.fn(),
  });
});

describe('useGrowTheCategoryData', () => {
  describe('BFF configuration', () => {
    it('should call useBffData with correct BFF id for country view', () => {
      renderHook(() => useGrowTheCategoryData(VIEW_TYPES.COUNTRY));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.id).toBe(
        KPIS_BFF.GROW_THE_CATEGORY.participationByCountry.id,
      );
    });

    it('should call useBffData with correct BFF id for maturity-zone view', () => {
      renderHook(() => useGrowTheCategoryData(VIEW_TYPES.MATURITY_ZONE));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.id).toBe(
        KPIS_BFF.GROW_THE_CATEGORY.participationByZoneAndMaturity.id,
      );
    });

    it('should call useBffData with correct BFF id for cohort view', () => {
      renderHook(() => useGrowTheCategoryData(VIEW_TYPES.COHORT));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.id).toBe(KPIS_BFF.GROW_THE_CATEGORY.participationByCohort.id);
    });

    it('should pass kpiGroup as pos', () => {
      renderHook(() => useGrowTheCategoryData(VIEW_TYPES.COUNTRY));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.kpiGroup).toBe('pos');
    });

    it('should pass cohort and pos_kpi in subFilters', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: {
          pos_kpi: 'weighted_distribution',
          'cohorts-grow': 'Premium',
        },
      });

      renderHook(() => useGrowTheCategoryData(VIEW_TYPES.COUNTRY));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.subFilters).toEqual({
        cohort: 'Premium',
        pos_kpi: 'weighted_distribution',
      });
    });

    it('should set cohort to null in subFilters when not set', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: { pos_kpi: 'participation' },
      });

      renderHook(() => useGrowTheCategoryData(VIEW_TYPES.COUNTRY));

      const call = (useBffData as jest.Mock).mock.calls[0][0];
      expect(call.subFilters.cohort).toBeNull();
    });
  });

  describe('return values', () => {
    it('should return participationData when data is available', () => {
      const { result } = renderHook(() =>
        useGrowTheCategoryData(VIEW_TYPES.COUNTRY),
      );

      expect(result.current.participationData).toEqual(mockParticipationData);
    });

    it('should return null participationData when loading', () => {
      (useBffData as jest.Mock).mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() =>
        useGrowTheCategoryData(VIEW_TYPES.COUNTRY),
      );

      expect(result.current.participationData).toBeNull();
      expect(result.current.loading).toBe(true);
    });

    it('should return null participationData when data is null', () => {
      (useBffData as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() =>
        useGrowTheCategoryData(VIEW_TYPES.COUNTRY),
      );

      expect(result.current.participationData).toBeNull();
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
        useGrowTheCategoryData(VIEW_TYPES.COUNTRY),
      );

      expect(result.current.error).toBe(mockError);
    });
  });
});

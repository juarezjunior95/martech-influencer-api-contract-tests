import { renderHook } from '@testing-library/react-hooks';
import { useBffData, usePageFilterApplied, useSubFilters } from 'hooks';

import { useManufactureData } from '.';
import { KPIS_BFF } from '../../../../enums';

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
  useSubFilters: jest.fn(),
  useBffData: jest.fn(),
}));

const mockTableData = [{ id: '1', value: 100 }];

const getUseBffDataParams = () => (useBffData as jest.Mock).mock.calls[0][0];

beforeEach(() => {
  jest.clearAllMocks();
  (usePageFilterApplied as jest.Mock).mockReturnValue({ isGlobalZone: false });
  (useSubFilters as jest.Mock).mockReturnValue({
    activeSubFilters: { 'price-segments-manufacture': 'Premium' },
  });
  (useBffData as jest.Mock).mockReturnValue({
    data: { 'manufacture-participation': mockTableData },
    loading: false,
    error: null,
    refetch: jest.fn(),
  });
});

describe('useManufactureData', () => {
  describe('BFF configuration', () => {
    it('should call useBffData with country BFF id when not global zone', () => {
      renderHook(() => useManufactureData());

      const call = getUseBffDataParams();
      expect(call.id).toBe(
        KPIS_BFF.LEAD_THE_CATEGORY.manufactureParticipationCountry.id,
      );
    });

    it('should call useBffData with global BFF id when global zone', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        isGlobalZone: true,
      });

      renderHook(() => useManufactureData());

      const call = getUseBffDataParams();
      expect(call.id).toBe(
        KPIS_BFF.LEAD_THE_CATEGORY.manufactureParticipationGlobal.id,
      );
    });

    it('should pass price_segment in subFilters', () => {
      renderHook(() => useManufactureData());

      const call = getUseBffDataParams();
      expect(call.subFilters).toEqual({ price_segment: 'Premium' });
    });

    it('should pass all price segment when manufacture subfilter is missing', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: {},
      });

      renderHook(() => useManufactureData());

      const call = getUseBffDataParams();
      expect(call.subFilters).toEqual({ price_segment: 'all' });
    });

    it('should pass kpiGroup as pos', () => {
      renderHook(() => useManufactureData());

      const call = getUseBffDataParams();
      expect(call.kpiGroup).toBe('pos');
    });
  });

  describe('return values', () => {
    it('should return tableData when data is available', () => {
      const { result } = renderHook(() => useManufactureData());

      expect(result.current.tableData).toEqual(mockTableData);
    });

    it('should return null tableData when loading', () => {
      (useBffData as jest.Mock).mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useManufactureData());

      expect(result.current.tableData).toBeNull();
      expect(result.current.loading).toBe(true);
    });

    it('should return null tableData when data is null', () => {
      (useBffData as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useManufactureData());

      expect(result.current.tableData).toBeNull();
    });

    it('should return error when request fails', () => {
      const mockError = new Error('Request failed');
      (useBffData as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: mockError,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useManufactureData());

      expect(result.current.error).toBe(mockError);
    });
  });
});

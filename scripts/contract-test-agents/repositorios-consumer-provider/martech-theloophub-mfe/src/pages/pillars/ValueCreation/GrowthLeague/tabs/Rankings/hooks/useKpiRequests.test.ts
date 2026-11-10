import { renderHook } from '@testing-library/react-hooks';
import { useBffData } from 'hooks';

import { useCupKpiRequests, useKpiRequests } from './useKpiRequests';

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
}));

const BFF_LEAGUE_IDS = {
  superLeague: 'value-creation_growth-league_rankings_super-league',
  premierLeague: 'value-creation_growth-league_rankings_premier-league',
};

describe('useKpiRequests', () => {
  const mockUseBffData = useBffData as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseBffData.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });
  });

  describe('Basic Functionality', () => {
    it('should call useBffData 2 times for super league and premier league', () => {
      renderHook(() => useKpiRequests());

      expect(mockUseBffData).toHaveBeenCalledTimes(2);
    });

    it('should return leagues object with superLeague and premierLeague', () => {
      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.leagues).toBeDefined();
      expect(result.current.leagues.superLeague).toBeDefined();
      expect(result.current.leagues.premierLeague).toBeDefined();
    });

    it('should return a top-level loading flag', () => {
      const { result } = renderHook(() => useKpiRequests());

      expect(result.current).toHaveProperty('loading');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('Super League KPI', () => {
    it('should call useBffData with correct parameters', () => {
      renderHook(() => useKpiRequests());

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: BFF_LEAGUE_IDS.superLeague,
          kpiGroup: 'growth_league',
          skipMainFilters: true,
        }),
      );
    });

    it('should extract table data from bff response', () => {
      mockUseBffData.mockReturnValueOnce({
        data: {
          'super-league': {
            kpiData: {
              table: {
                header: [{ id: 'rank', title: 'Rank' }],
                rows: [[{ rank: { value: '1' } }]],
              },
            },
          },
        },
        loading: false,
        error: null,
      });

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.leagues.superLeague.kpiData).toEqual({
        table: {
          header: [{ id: 'rank', title: 'Rank' }],
          rows: [[{ rank: { value: '1' } }]],
        },
      });
    });

    it('should return empty when table data is missing', () => {
      mockUseBffData.mockReturnValueOnce({
        data: null,
        loading: false,
        error: null,
      });

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.leagues.superLeague.kpiData).toEqual({
        empty: true,
      });
    });

    it('should return empty when header is missing from table', () => {
      mockUseBffData.mockReturnValueOnce({
        data: {
          'super-league': { kpiData: { table: { rows: [] } } },
        },
        loading: false,
        error: null,
      });

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.leagues.superLeague.kpiData).toEqual({
        empty: true,
      });
    });
  });

  describe('Premier League KPI', () => {
    it('should call useBffData with correct parameters', () => {
      renderHook(() => useKpiRequests());

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: BFF_LEAGUE_IDS.premierLeague,
          kpiGroup: 'growth_league',
          skipMainFilters: true,
        }),
      );
    });

    it('should extract table data from bff response', () => {
      mockUseBffData
        .mockReturnValueOnce({ data: null, loading: false, error: null })
        .mockReturnValueOnce({
          data: {
            'premier-league': {
              kpiData: {
                table: {
                  header: [{ id: 'country', title: 'Country' }],
                  rows: [[{ country: { value: 'BRAZIL' } }]],
                },
              },
            },
          },
          loading: false,
          error: null,
        });

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.leagues.premierLeague.kpiData).toEqual({
        table: {
          header: [{ id: 'country', title: 'Country' }],
          rows: [[{ country: { value: 'BRAZIL' } }]],
        },
      });
    });

    it('should return empty when bff data is null', () => {
      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.leagues.premierLeague.kpiData).toEqual({
        empty: true,
      });
    });
  });

  describe('Data States', () => {
    it('should return loading state from both leagues', () => {
      mockUseBffData.mockReturnValue({
        data: null,
        loading: true,
        error: null,
      });

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.leagues.superLeague.loading).toBe(true);
      expect(result.current.leagues.premierLeague.loading).toBe(true);
    });

    it('should set top-level loading to true when any league is loading', () => {
      let callCount = 0;
      mockUseBffData.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return { data: null, loading: true, error: null };
        }
        return { data: null, loading: false, error: null };
      });

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.loading).toBe(true);
    });

    it('should set top-level loading to false when no league is loading', () => {
      mockUseBffData.mockReturnValue({
        data: null,
        loading: false,
        error: null,
      });

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.loading).toBe(false);
    });

    it('should return error state', () => {
      const mockError = new Error('Failed to load');
      mockUseBffData.mockReturnValue({
        data: null,
        loading: false,
        error: mockError,
      });

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.leagues.superLeague.error).toBe(mockError);
      expect(result.current.leagues.premierLeague.error).toBe(mockError);
    });

    it('should handle mixed states across leagues', () => {
      let callCount = 0;
      mockUseBffData.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            data: {
              'super-league': {
                kpiData: { table: { header: [{}], rows: [] } },
              },
            },
            loading: false,
            error: null,
          };
        }
        return { data: null, loading: true, error: null };
      });

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.leagues.superLeague.kpiData).toEqual({
        table: { header: [{}], rows: [] },
      });
      expect(result.current.leagues.premierLeague.loading).toBe(true);
      expect(result.current.loading).toBe(true);
    });
  });

  describe('KPI Groups and Config', () => {
    it('should use growth_league kpiGroup for all calls', () => {
      renderHook(() => useKpiRequests());

      mockUseBffData.mock.calls.forEach((call: any) => {
        expect(call[0].kpiGroup).toBe('growth_league');
      });
    });

    it('should set skipMainFilters to true for all BFF calls', () => {
      renderHook(() => useKpiRequests());

      mockUseBffData.mock.calls.forEach((call: any) => {
        expect(call[0].skipMainFilters).toBe(true);
      });
    });
  });

  describe('Return Structure', () => {
    it('should return object with leagues and loading properties', () => {
      const { result } = renderHook(() => useKpiRequests());

      expect(result.current).toHaveProperty('leagues');
      expect(result.current).toHaveProperty('loading');
      expect(typeof result.current.leagues).toBe('object');
      expect(typeof result.current.loading).toBe('boolean');
    });

    it('should have exactly 2 league properties', () => {
      const { result } = renderHook(() => useKpiRequests());

      const leagueKeys = Object.keys(result.current.leagues);
      expect(leagueKeys).toHaveLength(2);
      expect(leagueKeys).toContain('superLeague');
      expect(leagueKeys).toContain('premierLeague');
    });

    it('should return kpiData, loading and error for each league', () => {
      const { result } = renderHook(() => useKpiRequests());

      Object.values(result.current.leagues).forEach((league) => {
        expect(league).toHaveProperty('kpiData');
        expect(league).toHaveProperty('loading');
        expect(league).toHaveProperty('error');
      });
    });

    it('should maintain consistent structure across rerenders', () => {
      const { result, rerender } = renderHook(() => useKpiRequests());

      const firstStructure = Object.keys(result.current.leagues);
      rerender();
      const secondStructure = Object.keys(result.current.leagues);

      expect(firstStructure).toEqual(secondStructure);
    });
  });
});

describe('useCupKpiRequests', () => {
  const mockUseBffData = useBffData as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseBffData.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });
  });

  describe('Known suffix configs', () => {
    it('should call useBffData with correct BFF view ID for megabrands_cup_country', () => {
      renderHook(() => useCupKpiRequests('megabrands_cup_country'));

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'value-creation_growth-league_rankings_megabrands-dashboard-country',
          kpiGroup: 'growth_league',
          skipMainFilters: true,
        }),
      );
    });

    it('should call useBffData with correct BFF view ID for bees_cup_acceleration_index', () => {
      renderHook(() => useCupKpiRequests('bees_cup_acceleration_index'));

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'value-creation_growth-league_rankings_bees-dashboard-acceleration-index',
        }),
      );
    });

    it('should call useBffData with correct BFF view ID for dtc_cup', () => {
      renderHook(() => useCupKpiRequests('dtc_cup'));

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'value-creation_growth-league_rankings_dtc-dashboard',
        }),
      );
    });
  });

  describe('Unknown suffix handling', () => {
    it('should set skipRequest to true for unknown suffix', () => {
      renderHook(() => useCupKpiRequests('unknown_suffix'));

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '',
          skipRequest: true,
        }),
      );
    });

    it('should pass empty string as BFF id for unknown suffix', () => {
      renderHook(() => useCupKpiRequests('nonexistent'));

      const call = mockUseBffData.mock.calls[0];
      expect(call[0].id).toBe('');
    });
  });

  describe('Data Extraction', () => {
    it('should extract cup data from bff response by componentId', () => {
      const mockTableData = {
        table: {
          header: [{ id: 'rank' }],
          rows: [[{ rank: { value: '1' } }]],
        },
      };

      mockUseBffData.mockReturnValueOnce({
        data: { 'megabrands-dashboard-country': mockTableData },
        loading: false,
        error: null,
      });

      const { result } = renderHook(() =>
        useCupKpiRequests('megabrands_cup_country'),
      );

      expect(result.current.kpiData).toEqual(mockTableData);
    });

    it('should return null when componentId is not found in bff response', () => {
      mockUseBffData.mockReturnValueOnce({
        data: { 'other-component': {} },
        loading: false,
        error: null,
      });

      const { result } = renderHook(() =>
        useCupKpiRequests('megabrands_cup_country'),
      );

      expect(result.current.kpiData).toBeNull();
    });

    it('should handle null bff data gracefully', () => {
      mockUseBffData.mockReturnValueOnce({
        data: null,
        loading: false,
        error: null,
      });

      const { result } = renderHook(() =>
        useCupKpiRequests('megabrands_cup_brand'),
      );

      expect(result.current.kpiData).toBeNull();
    });

    it('should extract AgGrid format data for bees cups', () => {
      const mockAgGridData = {
        columnDefs: [{ headerName: 'Rank', field: 'rank' }],
        rowData: [{ rank: '1', country: 'UGANDA' }],
      };

      mockUseBffData.mockReturnValueOnce({
        data: { 'bees-dashboard-acceleration-index': mockAgGridData },
        loading: false,
        error: null,
      });

      const { result } = renderHook(() =>
        useCupKpiRequests('bees_cup_acceleration_index'),
      );

      expect(result.current.kpiData).toEqual(mockAgGridData);
    });
  });

  describe('Return Structure', () => {
    it('should return kpiData and loading', () => {
      const { result } = renderHook(() =>
        useCupKpiRequests('megabrands_cup_country'),
      );

      expect(result.current).toHaveProperty('kpiData');
      expect(result.current).toHaveProperty('loading');
    });

    it('should return loading state', () => {
      mockUseBffData.mockReturnValue({
        data: null,
        loading: true,
        error: null,
      });

      const { result } = renderHook(() =>
        useCupKpiRequests('megabrands_cup_country'),
      );

      expect(result.current.loading).toBe(true);
    });
  });

  describe('Suffix change reactivity', () => {
    it('should call useBffData with different config when suffix changes', () => {
      const { rerender } = renderHook(
        ({ suffix }) => useCupKpiRequests(suffix),
        { initialProps: { suffix: 'megabrands_cup_country' } },
      );

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'value-creation_growth-league_rankings_megabrands-dashboard-country',
        }),
      );

      mockUseBffData.mockClear();

      rerender({ suffix: 'channels_cup_league_a' });

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'value-creation_growth-league_rankings_ka-dashboard-league-a',
        }),
      );
    });
  });

  describe('KPI Groups and Config', () => {
    it('should use growth_league kpiGroup', () => {
      renderHook(() => useCupKpiRequests('megabrands_cup_country'));

      const call = mockUseBffData.mock.calls[0];
      expect(call[0].kpiGroup).toBe('growth_league');
    });

    it('should set skipMainFilters to true', () => {
      renderHook(() => useCupKpiRequests('megabrands_cup_country'));

      const call = mockUseBffData.mock.calls[0];
      expect(call[0].skipMainFilters).toBe(true);
    });

    it('should not set skipRequest for known suffix', () => {
      renderHook(() => useCupKpiRequests('megabrands_cup_country'));

      const call = mockUseBffData.mock.calls[0];
      expect(call[0].skipRequest).toBe(false);
    });
  });
});

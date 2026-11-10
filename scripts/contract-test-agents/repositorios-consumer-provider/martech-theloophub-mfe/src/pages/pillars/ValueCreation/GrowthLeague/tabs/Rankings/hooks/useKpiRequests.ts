import { useMemo } from 'react';

import { AgGridData, TableDataType } from 'components/Table/types';
import { useBffData } from 'hooks';
import { JsonataFormatterType } from 'pages/pillars/ValueCreation/GrowthLeague/types';

const BFF_LEAGUE_IDS = {
  superLeague: 'value-creation_growth-league_rankings_super-league',
  premierLeague: 'value-creation_growth-league_rankings_premier-league',
};

const BFF_CUP_CONFIG: Record<string, { viewId: string; componentId: string }> =
  {
    megabrands_cup_country: {
      viewId:
        'value-creation_growth-league_rankings_megabrands-dashboard-country',
      componentId: 'megabrands-dashboard-country',
    },
    megabrands_cup_brand: {
      viewId:
        'value-creation_growth-league_rankings_megabrands-dashboard-brand',
      componentId: 'megabrands-dashboard-brand',
    },
    channels_cup_league_a: {
      viewId: 'value-creation_growth-league_rankings_ka-dashboard-league-a',
      componentId: 'ka-dashboard-league-a',
    },
    channels_cup_league_b: {
      viewId: 'value-creation_growth-league_rankings_ka-dashboard-league-b',
      componentId: 'ka-dashboard-league-b',
    },
    bees_cup_acceleration_index: {
      viewId:
        'value-creation_growth-league_rankings_bees-dashboard-acceleration-index',
      componentId: 'bees-dashboard-acceleration-index',
    },
    bees_cup_maturity_index: {
      viewId:
        'value-creation_growth-league_rankings_bees-dashboard-maturity-index',
      componentId: 'bees-dashboard-maturity-index',
    },
    dtc_cup: {
      viewId: 'value-creation_growth-league_rankings_dtc-dashboard',
      componentId: 'dtc-dashboard',
    },
  };

type LeagueData = { table: TableDataType; empty?: false } | { empty: true };

type CupData = AgGridData | JsonataFormatterType;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value != null && typeof value === 'object';

const isTableData = (value: unknown): value is TableDataType =>
  isRecord(value) && Array.isArray(value.header) && Array.isArray(value.rows);

const getRecordProperty = (
  data: unknown,
  key: string,
): Record<string, unknown> | null => {
  if (!isRecord(data)) return null;

  const value = data[key];
  return isRecord(value) ? value : null;
};

const isCupData = (value: unknown): value is CupData =>
  isRecord(value) &&
  (isTableData(value.table) ||
    (Array.isArray(value.rowData) && Array.isArray(value.columnDefs)));

function extractLeagueData(data: unknown, componentId: string): LeagueData {
  const componentData = getRecordProperty(data, componentId);
  const kpiData = getRecordProperty(componentData, 'kpiData');
  const tableData = kpiData?.table;

  if (!isTableData(tableData)) {
    return { empty: true };
  }

  return { table: tableData };
}

function extractCupData(data: unknown, componentId: string): CupData | null {
  const componentData = getRecordProperty(data, componentId);

  return isCupData(componentData) ? componentData : null;
}

export function useKpiRequests() {
  const superLeague = useBffData({
    id: BFF_LEAGUE_IDS.superLeague,
    kpiGroup: 'growth_league',
    skipMainFilters: true,
  });

  const premierLeague = useBffData({
    id: BFF_LEAGUE_IDS.premierLeague,
    kpiGroup: 'growth_league',
    skipMainFilters: true,
  });

  const leagues = useMemo(
    () => ({
      superLeague: {
        kpiData: extractLeagueData(superLeague.data, 'super-league'),
        loading: superLeague.loading,
        error: superLeague.error,
      },
      premierLeague: {
        kpiData: extractLeagueData(premierLeague.data, 'premier-league'),
        loading: premierLeague.loading,
        error: premierLeague.error,
      },
    }),
    [
      superLeague.data,
      superLeague.loading,
      superLeague.error,
      premierLeague.data,
      premierLeague.loading,
      premierLeague.error,
    ],
  );

  const loading = Object.values(leagues).some((league) => league.loading);

  return { leagues, loading };
}

export function useCupKpiRequests(suffix: string) {
  const cupConfig = BFF_CUP_CONFIG[suffix];

  const cupRaw = useBffData({
    id: cupConfig?.viewId ?? '',
    kpiGroup: 'growth_league',
    skipMainFilters: true,
    skipRequest: !cupConfig,
  });

  const cupData = useMemo(
    () => extractCupData(cupRaw.data, cupConfig?.componentId ?? ''),
    [cupRaw.data, cupConfig?.componentId],
  );

  return { kpiData: cupData, loading: cupRaw.loading };
}

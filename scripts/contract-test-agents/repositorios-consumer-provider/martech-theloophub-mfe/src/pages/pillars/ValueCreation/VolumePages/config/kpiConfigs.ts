import { featureToggles } from 'config/featureToggle';

import { Kpi } from '../contexts';
import {
  CORES_GLOBAL_MOVES,
  GlobalMoves,
  MARKET_SHARE_GLOBAL_MOVES,
  NR_GLOBAL_MOVES,
  POWER_GLOBAL_MOVES,
  VOLUME_GLOBAL_MOVES,
} from '../tabs/Global/constants';
import {
  CORES_GROWTH_LEVERS,
  GrowthLevers,
  MARKET_SHARE_GROWTH_LEVERS,
  NR_GROWTH_LEVERS,
  POWER_GROWTH_LEVERS,
  VOLUME_GROWTH_LEVERS,
} from '../tabs/Global/constants/growthLevers';
import {
  DEFAULT_BEER_ADJ_ENDPOINTS,
  DEFAULT_ENDPOINTS,
  KpiEndpoints,
  MARKET_SHARE_ENDPOINTS,
} from './api';
import {
  Legend,
  MARKET_SHARE_WATERFALL_LEGEND,
  NR_WATERFALL_LEGEND,
  VOLUME_WATERFALL_LEGEND,
} from './legend';

export type VolumePagesKpiGroup =
  'finance' | 'volume' | 'power' | 'market_share';

export interface KpiConfig {
  kpiGroup: VolumePagesKpiGroup;
  measure: string;
  legend: Legend;
  growthLevers: GrowthLevers;
  endpoints: KpiEndpoints;
  globalMoves: GlobalMoves;
  aiSummaryToggleId?: string;
  beerAdjEndpoints?: KpiEndpoints;
}

export const KPI_CONFIGS: Record<Kpi, KpiConfig> = {
  volume: {
    kpiGroup: 'volume',
    measure: '[k hl]',
    legend: VOLUME_WATERFALL_LEGEND,
    growthLevers: VOLUME_GROWTH_LEVERS,
    endpoints: DEFAULT_ENDPOINTS,
    beerAdjEndpoints: DEFAULT_BEER_ADJ_ENDPOINTS,
    globalMoves: VOLUME_GLOBAL_MOVES,
    aiSummaryToggleId:
      featureToggles.pillar.valueCreation.submenus.volumePages.tab.global
        .aiSummary,
  },
  nr: {
    kpiGroup: 'finance',
    measure: '[$Mio]',
    legend: NR_WATERFALL_LEGEND,
    growthLevers: NR_GROWTH_LEVERS,
    endpoints: DEFAULT_ENDPOINTS,
    globalMoves: NR_GLOBAL_MOVES,
  },
  cores: {
    kpiGroup: 'finance',
    measure: '[k hl]',
    legend: VOLUME_WATERFALL_LEGEND,
    growthLevers: CORES_GROWTH_LEVERS,
    endpoints: DEFAULT_ENDPOINTS,
    globalMoves: CORES_GLOBAL_MOVES,
  },
  market_share: {
    kpiGroup: 'market_share',
    measure: '[%]',
    legend: MARKET_SHARE_WATERFALL_LEGEND,
    growthLevers: MARKET_SHARE_GROWTH_LEVERS,
    endpoints: MARKET_SHARE_ENDPOINTS,
    globalMoves: MARKET_SHARE_GLOBAL_MOVES,
  },
  power: {
    kpiGroup: 'power',
    measure: '[k hl]',
    legend: VOLUME_WATERFALL_LEGEND,
    growthLevers: POWER_GROWTH_LEVERS,
    endpoints: DEFAULT_ENDPOINTS,
    globalMoves: POWER_GLOBAL_MOVES,
  },
};

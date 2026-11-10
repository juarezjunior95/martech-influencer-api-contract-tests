import { ChartData } from 'pages/components/ChartWithCaption/types';

import { BrandPowerData, KpiResponse, YearQuarter } from '../../types';

export interface KpiResponses {
  power: KpiResponse<BrandPowerData>;
  meaning: KpiResponse<BrandPowerData>;
  affinity: KpiResponse<BrandPowerData>;
  meetNeeds: KpiResponse<BrandPowerData>;
  difference: KpiResponse<BrandPowerData>;
  dynamic: KpiResponse<BrandPowerData>;
  unique: KpiResponse<BrandPowerData>;
  salience: KpiResponse<BrandPowerData>;
  unaided_awareness: KpiResponse<BrandPowerData>;
  brand_clarity: KpiResponse<BrandPowerData>;
  occasion: KpiResponse<ChartData>;
  imageries: KpiResponse<Record<string, unknown>>;
  bip: KpiResponse<Record<string, unknown>>;
}

export interface UseBrandPowerRequestsParams {
  quarterYearSelected: YearQuarter;
  powerAwarenessSelected: string;
  enabled: {
    power: boolean;
    details: boolean;
  };
}

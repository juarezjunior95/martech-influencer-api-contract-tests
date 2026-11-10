import { ChartData } from 'pages/components/ChartWithCaption/types';

export type YearQuarter = 'year' | 'quarter';

export interface BrandPowerData {
  quarterly: ChartData;
  yearly: ChartData;
  ytd: ChartData;
  empty?: boolean;
}

export interface KpiResponse<T = Record<string, unknown>> {
  kpiData: T;
  loading: boolean;
}

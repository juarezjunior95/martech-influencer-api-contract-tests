import { BigNumberData } from 'components/deprecated';
import type { KpiGroup } from 'domain/Kpi';
import { ChartData, ChartType } from 'pages/components/ChartWithCaption/types';

export interface BrandAnalysisChart {
  total_per_year_full?: ChartData;
  total_per_month_quarter?: ChartData;
  total_per_year?: ChartData & { big_number: BigNumberData };
  empty?: boolean;
}

export interface BrandAnalysisData {
  volume?: BrandAnalysisChart;
  nr?: BrandAnalysisChart;
  nr_cpi?: BrandAnalysisChart;
  cores?: BrandAnalysisChart;
  market_share?: BrandAnalysisChart;
  power?: BrandAnalysisChart;
  pl_composition?: BrandAnalysisChart;
  sm?: BrandAnalysisChart;
  plsm_of_maco?: BrandAnalysisChart;
  empty?: boolean;
}

export interface BrandPowerData {
  quarterly: ChartData;
  yearly: ChartData;
  ytd: ChartData;
}

export interface KpiTooltip {
  content: string;
  footerContent?: string;
  source?: 'sunlight' | 'anaplan' | 'kantar';
  refresh?: 'monthly' | 'quarterly' | 'yearly';
}

type KpiConfigApplyConfigs = (
  content: BrandAnalysisChart,
) => BrandAnalysisChart;

type KpiConfigApplyConfigsBrandPower = (
  content: BrandPowerData,
  currentYear: string,
) => BrandPowerData;

export interface KpiConfig {
  key: string;
  kpiName?: string;
  barsThickness?: number[];
  chartType?: Record<string, ChartType>;
  tooltip: KpiTooltip;
  title: string;
  titleAllBrands?: string;
  measure?: string;
  kpiGroup: KpiGroup;
  dateRefreshKey?: string;
  applyConfigs?: KpiConfigApplyConfigs | KpiConfigApplyConfigsBrandPower;
  jsonataFormatter?: Record<string, string>;
  shouldApplyConfigs?: boolean;
}

export type ChartKpiConfig = Omit<KpiConfig, 'applyConfigs'> & {
  applyConfigs?: KpiConfigApplyConfigs;
};

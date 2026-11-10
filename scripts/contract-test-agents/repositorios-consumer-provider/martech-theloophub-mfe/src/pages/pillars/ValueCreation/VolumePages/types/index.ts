import { ChartDataset } from 'chart.js';
import { ChartLegendShape, ComparisonLineData } from 'components';
import { BigNumberData } from 'components/BigNumber/types';
import { BrandAvatarItemProps } from 'components/BrandAvatar/Components/BrandAvatarItem/interface';
import {
  ConnectorPluginProps,
  RoudedArrowProps,
} from 'components/Chart/plugins';
import type { KpiGroup } from 'domain/Kpi';

export interface BigNumbersKpiData {
  data: BigNumberData[];
  header: {
    title: string;
    period?: string;
  };
  bottomInfo?: BigNumberData;
}

export interface LineChartKpiData {
  datasets: ChartDataset<'line'>[];
  formattedData: string[][];
  labels: string[];
  highlightLabels?: string[];
  comparisonLine?: { data: ComparisonLineData[] };
  period?: string;
  legend?: LegendItem[];
  empty?: boolean;
  suggestedMin?: number;
  suggestedMax?: number;
}

export interface LegendItem {
  label: string;
  color: string;
  shape: ChartLegendShape;
  icon?: 'TrendingUp' | 'TrendingDown';
}

export interface BarChartKpiData {
  period: string;
  datasets: ChartDataset<'bar'>[];
  formattedData: string[][];
  labels: string[];
  highlightLabels?: string[];
  comparisonLine?: { data: ComparisonLineData[] };
  brandsAvatar?: { data: BrandAvatarItemProps[] };
  legend?: LegendItem[];
  baseChartColors?: string[];
  stripedIndexes?: number[];
  connector?: ConnectorPluginProps;
  roundedArrow?: RoudedArrowProps;
  empty?: boolean;
}

export interface KpiConfig {
  id: string;
  kpiGroup: KpiGroup;
  formatters: Record<string, string>;
  subFilters?: Record<string, string | number>;
}

export interface WaterfallChartKpiData {
  period: string;
  values: number[];
  labels: string[];
  brandsAvatar: {
    data: BrandAvatarItemProps[];
  };
  comparisonLine: {
    data: ComparisonLineData[];
  };
  legend: LegendItem[];
  formattedData?: string[][];
  baseChartColors?: string[];
  empty?: boolean;
}

export interface GlobalMovesKpis {
  lineChart: KpiConfig;
  countryBarChart: KpiConfig;
  waterfallChart: KpiConfig;
}

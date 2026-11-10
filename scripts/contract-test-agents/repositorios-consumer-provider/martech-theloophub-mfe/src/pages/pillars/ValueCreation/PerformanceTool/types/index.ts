import { ChartDataset } from 'chart.js';
import { BigNumberData } from 'components/BigNumber/types';
import { BrandAvatarItemProps } from 'components/BrandAvatar/Components/BrandAvatarItem/interface';
import { SpecialIndexes } from 'components/Chart/Bar/Waterfall/types';
import { ConnectorPluginProps } from 'components/Chart/plugins/ConnectorPlugin';
import { ComparisonLineData } from 'components/ComparisonLine';

export interface BigNumberHeader {
  title: string;
  measure?: string;
}

export interface BigNumbersSectionData {
  header: BigNumberHeader;
  data: BigNumberData[];
}

export interface LegendItem {
  label: string;
  color?: string;
}

export interface LineChartData {
  suggestedMin?: number;
  suggestedMax?: number;
  datasets: ChartDataset<'line'>[];
  labels: string[];
  formattedData: string[][];
  comparisonLine?: { data: ComparisonLineData[] };
  highlightedIndexes?: number[];
}

export interface BarChartData {
  datasets: ChartDataset<'bar'>[];
  labels: string[];
  formattedData: string[][];
  stripedIndexes?: number[];
  comparisonLine?: { data: ComparisonLineData[] };
}

export interface LineBarChartsSectionData {
  empty?: boolean;
  legend?: LegendItem[];
  lineChart: LineChartData;
  barChart: BarChartData;
}

export interface WaterfallData {
  data?: number[];
  values?: number[];
  labels: string[];
  formattedData?: string[][];
  images?: { data: BrandAvatarItemProps[] };
  brandsImg?: BrandAvatarItemProps[];
  comparisonLine?: { data: ComparisonLineData[] };
  comparisonLineData?: ComparisonLineData[];
  specialIndexes?: SpecialIndexes;
  connector?: ConnectorPluginProps;
  clickableIndexes?: { index: number; value: string }[];
  empty?: boolean;
}

export interface WaterfallSectionData {
  large: WaterfallData;
  small: WaterfallData;
  empty?: boolean;
}

export interface NestedOption {
  label: string;
  value: string;
  options?: NestedOption[];
}

export interface WaterfallSubFilters {
  values: {
    global: NestedOption[];
    country: NestedOption[];
  };
  default: NestedOption[];
  enabled: boolean;
}

import { VariationCaptionData } from 'components/VariationCaption/types';
import { ChartData } from 'pages/components/ChartWithCaption/types';

export interface VariationGroup {
  variation: string;
  direction?: 'up' | 'down' | '';
  unitMeasure?: string;
}

export interface VariationData {
  variationsGroup: VariationGroup[];
}

export interface VariationRow {
  title?: string;
  data: VariationData[];
}

export interface VariationCaptionRanking {
  title: string;
  subtitle?: string;
  variationsRows: Record<string, VariationRow>;
}

export interface HorizontalDashedLine {
  value: number;
  unitMeasure?: string;
  xEnd?: number;
}

export interface ChartDataset {
  type: string;
  label?: string;
  data?: number[];
  backgroundColor?: string[];
  baseChartColor?: string[];
  formattedData?: string[];
}

export interface ResourceAllocationRankingChartView {
  datasets?: ChartDataset[];
  labels?: string[];
  icons?: string[];
  formattedData?: string[][];
  hasPercentage?: boolean;
  suggestedMin?: number;
  suggestedMax?: number;
  variation_caption?: VariationCaptionRanking[];
  variationCaptionData?: VariationCaptionData[];
  horizontalDashedLine?: HorizontalDashedLine[];
}

export interface ResourceAllocationChart {
  total_per_year_full?: ChartData;
}

export interface ResourceAllocationRanking {
  overview_graph?: ResourceAllocationChart;
}

export interface ResourceAllocationData
  extends
    ResourceAllocationChart,
    ResourceAllocationRanking,
    ResourceAllocationRankingChartView {
  empty?: boolean;
}

export interface ResourceAllocationOverview {
  [key: string]: ResourceAllocationData;
}

import { RoudedArrowProps } from 'components/Chart/plugins';
import { DatasetPattern, PointStyle } from 'models/ChartData';

export type ChartType = 'bar' | 'line' | 'stacked';

export interface ChartData {
  type: ChartType;
  direction?: 'vertical' | 'horizontal';
  labels: string[];
  y_axis?: {
    scale_y_unit?: string;
    align_zero_y_axis?: boolean;
  };
  refreshDate?: {
    month: string;
    quarter: string;
  };
  hasTooltip?: boolean;
  suggestedMax?: number;
  suggestedMin?: number;
  comparison_data?: RoudedArrowProps;
  datasets: ChartDataset[];
  backgroundColor?: string[];
  chartLegend?: {
    label: string;
    color: string;
    captionType?: 'line' | 'bar';
    pointStyle?: PointStyle;
    paddingRight?: '0' | '12' | '20';
  }[];
  chart_legends?: string[];
  variation_caption?: any;
  horizontalDashedLine?: {
    value: number;
    unitMeasure: '%';
    xEnd?: number;
  }[];
  paddingTop?: number;
}

export interface ChartDataset {
  formattedData?: string[];
  type: ChartType;
  label: string;
  data: number[];
  variationData?: VariationDataProps[];
  borderColor?: string;
  backgroundColor?: string | string[];
  minBarLength?: number;
  legend?: string[];
  pattern?: DatasetPattern;
}

export interface VariationDataProps {
  variation?: string;
  direction?: VariationDirection;
}

export type VariationDirection = 'up' | 'down';

export interface VariationGroup {
  variation: number;
  direction: VariationDirection;
  unit_of_measure: string;
}

export interface VariationRowData {
  variationsGroup?: VariationGroup[];
}

export interface VariationRow {
  title?: string;
  data?: VariationRowData | VariationRowData[];
}

export interface VariationCaptionConfig {
  title?: string;
  subtitle?: string;
  information_order?: boolean;
  variationsRows?: Record<string, VariationRow>;
}

import {
  ChartDataset,
  ChartOptions,
  ChartType,
  ChartTypeRegistry,
  Plugin,
} from 'chart.js';
import { VariationDataProps } from 'pages/components/ChartWithCaption/types';

export type AxisType = 'none' | 'one' | 'two';
export type BarSize =
  'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'responsive';

export interface BaseChartComponentProps<
  TType extends ChartType = keyof ChartTypeRegistry,
> {
  datasets: BaseChartDatasets<TType>;
  plugins?: Plugin<TType>[];
  labels?: string[];
  highlightLabels?: string[];
  options?: ChartOptions;
  showDivider?: boolean;
  showGrid?: boolean;
  showCustomGrid?: boolean;
  showLabels?: boolean;
  axisType?: AxisType;
  indexAxis?: 'x' | 'y';
  formattedData?: string[][];
  drawZeroLine?: boolean;
  baseChartColors?: string[];
  spacing?: number;
  borderColor?: string;
}

export type BaseChartDataset<TType extends ChartType = ChartType> =
  ChartDataset<TType> & {
    variationData?: VariationDataProps[];
  };

export type BaseChartDatasets<TType extends ChartType = ChartType> =
  BaseChartDataset<TType>[];

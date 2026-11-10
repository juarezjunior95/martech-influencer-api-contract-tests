import type { ChartDataset } from 'chart.js';
import { ConnectorPluginProps } from 'components/Chart/plugins/ConnectorPlugin/types';
import { RoudedArrowProps } from 'components/Chart/plugins/RoundedArrow/types';
import { BarSize, BaseChartComponentProps } from 'components/Chart/types';

export interface BarProps extends BaseChartComponentProps {
  size?: BarSize;
  maxSize?: BarSize | 'none';
  stripedIndexes?: number[];
  datalabelsPosition?: 'external' | 'internal';
  alwaysShowDataLabels?: boolean;
  connector?: ConnectorPluginProps;
  roundedArrow?: RoudedArrowProps;
  labelColors?: LabelColors;
  labelBackgroundColor?:
    string | null | ((context: DataLabelContext) => string | null);
  fractionDigits?: { xAxis?: number; yAxis?: number; y1Axis?: number };
  dataTestId?: string;
  highlightLabels?: string[];
}

export interface DataLabelContext {
  chart: any;
  dataIndex: number;
  datasetIndex: number;
  dataset: ChartDataset;
}

export interface LabelColors {
  internal: string;
  external: string;
}

export type LabelBackgroundColor =
  string | null | ((context: DataLabelContext) => string | null);

export interface ChartLayout {
  padding?: {
    [key: string]: number;
  };
}

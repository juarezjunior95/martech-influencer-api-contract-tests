import { ChartDataset } from 'chart.js';

export interface ChartData {
  labels: string[];
  min?: number;
  max?: number;
  datasets: (ChartDataset<'bar', (number | [number, number])[]> & {
    variation?: number | number[];
    variationColor?: string[];
    variationDirection?: string[];
    unitOfMeasure?: string;
  })[];
  dataTestId?: string;
}

export type PointStyle =
  | 'square'
  | 'circle'
  | 'triangle'
  | 'smallLine'
  | 'line'
  | 'lineThicker'
  | 'roundedThicker'
  | 'roundedRectangle'
  | 'rectRot';

export interface StripedPatternParams {
  color?: string;
  angle?: number;
  thickness?: number;
  spacing?: number;
}

export interface DatasetPattern {
  type: string;
  flags: number[];
  params: any;
}

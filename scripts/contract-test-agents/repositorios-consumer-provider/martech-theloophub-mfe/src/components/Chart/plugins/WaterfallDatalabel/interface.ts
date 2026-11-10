import type { BarElement, Chart } from 'chart.js';
import type { SpecialIndexes } from 'components/Chart/Bar/Waterfall/types';

export interface CustomBarElement extends BarElement {
  base: number;
  width: number;
}

export interface WaterfallDataLabelProps {
  display: boolean;
  datalabels: string[];
  indexes?: SpecialIndexes;
  font?: string;
  fontHover?: string;
  hoveredIndex?: number | null;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  decimalPlaces?: number;
  color: {
    outside: string;
    inside: string;
    retained: string;
  };
}

export interface WaterfallBarLabelDrawContext {
  chart: Chart<'bar'>;
  ctx: CanvasRenderingContext2D;
  datasets: Chart<'bar'>['data']['datasets'];
  x: Chart<'bar'>['scales']['x'];
  options: WaterfallDataLabelProps;
  indexAxis: string;
  hoveredIndex: number | null | undefined;
}

export interface WaterfallVerticalBarLabelInput {
  bar: CustomBarElement;
  index: number;
  label: string;
  textWidth: number;
  cutDiscount: number;
}

export interface WaterfallVerticalWideLabelInput {
  ctx: CanvasRenderingContext2D;
  label: string;
  yAxis: number;
  finalTextWidth: number;
  textWidth: number;
  margin: number;
  widthToRight: number;
  xToLeft: number;
  xToRight: number;
  options: WaterfallDataLabelProps;
}

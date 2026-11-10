import { Chart, Scale } from 'chart.js';

export interface ChartContext {
  chart: Chart;
  dataIndex: number;
  datasetIndex: number;
}

export interface TooltipContext {
  chart: Chart;
  tooltip: {
    opacity: number;
    dataPoints?: Array<{
      dataIndex: number;
    }>;
    caretX: number;
  };
}

export interface LabelPosition {
  anchor: 'start' | 'end' | 'center';
  align: 'top' | 'bottom' | 'center' | 'left' | 'right';
}

export interface ChartScales {
  y?: Scale;
  y1?: Scale;
}

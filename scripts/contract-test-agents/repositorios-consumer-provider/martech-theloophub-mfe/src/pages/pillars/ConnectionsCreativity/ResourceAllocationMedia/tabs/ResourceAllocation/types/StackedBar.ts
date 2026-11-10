import { DatasetPattern } from 'models/ChartData';

export interface StackedChart {
  labels: string[];
  datasets: StackedBarData[];
  total_allocation: {
    value: (string | number)[];
    unit?: string;
  };
  emptyIndices?: Set<number>;
}

export interface StackedBarData {
  data: number[];
  label: string;
  formattedData?: string[];
  directions?: ('' | 'up' | 'down')[];
  pattern?: DatasetPattern;
}

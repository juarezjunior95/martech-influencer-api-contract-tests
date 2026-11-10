import type { BigNumberData } from 'components/BigNumber/types';

export interface BigNumberSparkLineChartData {
  labels: string[];
  datasets: Array<{ label: string; data: number[] }>;
}

export interface BigNumberSparkLineCardData {
  chartTitle: string;
  chartPeriod: string;
  measure?: string;
  bigNumberData: BigNumberData[];
  chartLineData: number[];
}

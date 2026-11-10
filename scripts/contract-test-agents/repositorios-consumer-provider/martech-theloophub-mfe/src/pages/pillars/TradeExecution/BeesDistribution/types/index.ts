import { ChartDataset } from 'chart.js';
import { CaptionItem } from 'components';
import { BigNumberData } from 'components/BigNumber/types';
import { IChartHeaderProps } from 'components/ChartHeader/types/interface';
import {
  ComparisonLineData,
  ComparisonValue,
} from 'components/ComparisonLine/ComparisonLine';

export type { BigNumberData, ComparisonValue, ComparisonLineData };

export interface ComparisonLineConfig {
  data: ComparisonLineData[];
}

export interface BeesDistributionKpiData {
  legend: CaptionItem[];
  header: Pick<IChartHeaderProps, 'title' | 'measure'>;
  bigNumberData: BigNumberData[];
  barChart: {
    datasets: ChartDataset<'bar'>[];
    labels: string[];
    formattedData?: string[][];
    comparisonLine: ComparisonLineConfig;
  };
  lineChart: {
    datasets: ChartDataset<'line'>[];
    labels: string[];
    formattedData?: string[][];
    comparisonLine: ComparisonLineConfig;
    suggestedMin?: number;
    suggestedMax?: number;
  };
}

import { ChartData } from 'pages/components/ChartWithCaption/types';
import {
  BrandPowerData,
  YearQuarter,
} from 'pages/pillars/PortfolioBrand/BrandAnalysis/types';

type ChartDataLike = Omit<ChartData, 'type' | 'labels'> & {
  type?: ChartData['type'];
  labels?: ChartData['labels'] | string | number;
};

const isValidChartData = (
  chartData: ChartDataLike | undefined,
): chartData is ChartDataLike => {
  if (!chartData || typeof chartData !== 'object') return false;

  return Array.isArray(chartData.datasets);
};

const normalizeChartData = (chartData: ChartDataLike): ChartData => {
  const formattedToArray =
    chartData.labels !== undefined && chartData.labels !== null
      ? [String(chartData.labels)]
      : [];

  const labels = Array.isArray(chartData.labels)
    ? chartData.labels.map(String)
    : formattedToArray;

  return {
    ...chartData,
    type: chartData.type || 'bar',
    labels,
    datasets: (chartData.datasets || []).map((dataset) => ({
      ...dataset,
      type: dataset.type || 'bar',
    })),
  };
};

export const getChartList = (
  data: BrandPowerData,
  quarterYearSelected: YearQuarter,
): ChartData[] => {
  if (!data) return [];
  if (data.empty) return [];

  if (quarterYearSelected === 'quarter') {
    if (!isValidChartData(data.quarterly) || !isValidChartData(data.ytd)) {
      return [];
    }

    return [normalizeChartData(data.quarterly), normalizeChartData(data.ytd)];
  }

  if (!isValidChartData(data.yearly)) return [];

  return [normalizeChartData(data.yearly)];
};

import { StackedChart } from '../../../types';

interface DatalabelContext {
  dataIndex: number;
  datasetIndex: number;
}

export const formatDatalabelValue = (
  datasets: StackedChart['datasets'],
  value: number,
  context: DatalabelContext,
): string | number => {
  const { dataIndex, datasetIndex } = context;
  const dataset = datasets[datasetIndex];
  return dataset?.formattedData?.[dataIndex] ?? value;
};

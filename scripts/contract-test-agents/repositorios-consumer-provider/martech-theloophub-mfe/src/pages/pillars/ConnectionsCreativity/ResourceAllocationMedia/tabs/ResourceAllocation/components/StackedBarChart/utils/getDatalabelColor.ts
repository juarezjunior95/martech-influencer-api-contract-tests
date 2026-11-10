import { StackedChart } from '../../../types';
import { COLOR_MAP } from '../constants';

interface DatalabelContext {
  dataIndex: number;
  datasetIndex: number;
}

export const getDatalabelColor = (
  datasets: StackedChart['datasets'],
  context: DatalabelContext,
): string => {
  const { dataIndex, datasetIndex } = context;
  const dataset = datasets[datasetIndex];
  const direction = dataset?.directions?.[dataIndex] || '';
  return COLOR_MAP[direction];
};

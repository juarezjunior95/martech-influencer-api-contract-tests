import { StackedChart } from '../../../types';

interface DatalabelContext {
  dataIndex: number;
  datasetIndex: number;
}

export const getDatalabelBorderColor = (
  datasets: StackedChart['datasets'],
  context: DatalabelContext,
): string | null => {
  const { datasetIndex, dataIndex } = context;
  const dataset = datasets[datasetIndex];
  const pattern = dataset?.pattern;
  const value = dataset.data[dataIndex];

  if (
    pattern?.flags?.includes(dataIndex) &&
    Number.isFinite(value) &&
    value !== 0
  ) {
    return '#1414141F';
  }
  return null;
};

import { StackedChart } from '../../../types';

interface DatalabelContext {
  dataIndex: number;
  datasetIndex: number;
}

export const getDatalabelFont = (
  datasets: StackedChart['datasets'],
  context: DatalabelContext,
) => {
  const { dataIndex, datasetIndex } = context;
  const dataset = datasets[datasetIndex];
  const direction = dataset?.directions?.[dataIndex] || '';
  const isDirectional = ['up', 'down'].includes(direction);
  const isNwmAcRow = datasetIndex === 0 && dataIndex === 1;

  return {
    weight: isDirectional || isNwmAcRow ? 600 : 400,
    family: 'Work Sans',
  };
};

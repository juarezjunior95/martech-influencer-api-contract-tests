import { StackedChart } from '../../../types';

const STRIPED_LABEL_BG_FALLBACK = '#D5DADD';

interface DatalabelContext {
  dataIndex: number;
  datasetIndex: number;
}

export const getDatalabelBackground = (
  datasets: StackedChart['datasets'],
  context: DatalabelContext,
  rowColors?: string[],
): string | undefined => {
  const { datasetIndex, dataIndex } = context;
  const dataset = datasets[datasetIndex];
  const pattern = dataset?.pattern;
  const value = dataset.data[dataIndex];

  if (
    pattern?.flags?.includes(dataIndex) &&
    Number.isFinite(value) &&
    value !== 0
  ) {
    if (datasetIndex === 0) return STRIPED_LABEL_BG_FALLBACK;
    return rowColors?.[datasetIndex] ?? STRIPED_LABEL_BG_FALLBACK;
  }
};

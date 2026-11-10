import { Chart, ChartDataset, ScriptableContext } from 'chart.js';

function getFirstNonZeroDatasetIndex(datasets: ChartDataset<'bar'>[]): number {
  for (let i = datasets.length - 1; i >= 0; i--) {
    if (datasets[i].data[0] !== 0) {
      return i;
    }
  }
  return -1;
}

function getLastNonZeroDatasetIndex(datasets: ChartDataset<'bar'>[]): number {
  for (let i = datasets.length - 1; i >= 0; i--) {
    const lastIndex = datasets[i].data.length - 1;
    if (datasets[i].data[lastIndex] !== 0) {
      return i;
    }
  }
  return -1;
}

export function createRoundedCornersPlugin(borderRadius: number) {
  return {
    id: 'roundedCorners',

    beforeUpdate(chart: Chart<'bar'>) {
      const datasets = chart.data.datasets;

      const firstDatasetIndex = getFirstNonZeroDatasetIndex(datasets);
      const lastDatasetIndex = getLastNonZeroDatasetIndex(datasets);

      if (firstDatasetIndex === -1 && lastDatasetIndex === -1) return;

      datasets.forEach((dataset, datasetIndex) => {
        dataset.borderRadius = (ctx: ScriptableContext<'bar'>) => {
          const dataIndex = ctx.dataIndex;
          const lastBarIndex = dataset.data.length - 1;

          if (datasetIndex === firstDatasetIndex && dataIndex === 0) {
            return {
              topLeft: borderRadius,
              topRight: 0,
              bottomLeft: 0,
              bottomRight: 0,
            };
          }

          if (datasetIndex === lastDatasetIndex && dataIndex === lastBarIndex) {
            return {
              topLeft: 0,
              topRight: borderRadius,
              bottomLeft: 0,
              bottomRight: 0,
            };
          }

          return 0;
        };

        dataset.borderSkipped = false;
      });
    },
  };
}

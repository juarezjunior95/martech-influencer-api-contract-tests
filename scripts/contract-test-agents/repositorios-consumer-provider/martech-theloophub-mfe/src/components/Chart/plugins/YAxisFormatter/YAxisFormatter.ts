import { Chart as ChartJS } from 'chart.js';

type DatasetWithYAxisFormat = {
  yAxisFormat?: 'number' | 'percentage';
};

export const YAxisFormatter = {
  id: 'yAxisFormatter',
  beforeUpdate: (chart: ChartJS) => {
    const { data, options } = chart;
    const datasets = data.datasets as DatasetWithYAxisFormat[];
    const yAxisFormat = datasets[0]?.yAxisFormat;

    if (yAxisFormat !== 'percentage') {
      return;
    }

    if (!options.scales) options.scales = {};
    if (!options.scales.y) options.scales.y = {};
    if (!options.scales.y.ticks) options.scales.y.ticks = {};

    const originalCallback = options.scales.y.ticks.callback;

    options.scales.y.ticks.callback = function (value, index, ticks) {
      let result;
      if (originalCallback && typeof originalCallback === 'function') {
        result = originalCallback.call(this, value, index, ticks);
      } else {
        result = value;
      }

      const stringResult = String(result);
      if (stringResult === '' || stringResult.includes('%')) {
        return stringResult;
      }
      return `${stringResult}%`;
    };
  },
};

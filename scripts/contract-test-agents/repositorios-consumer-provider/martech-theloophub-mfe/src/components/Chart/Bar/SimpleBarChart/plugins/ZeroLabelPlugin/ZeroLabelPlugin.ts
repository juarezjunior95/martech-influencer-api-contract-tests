import { COLORS } from '../../constants/constants';

export interface ZeroLabelProps {
  display: boolean;
  suggestedMin: number;
}

export const ZeroLabelPlugin = {
  id: 'zeroLabelPlugin',
  afterDatasetsDraw(chart) {
    const { ctx, data, scales } = chart;
    const yScale = scales.y;
    const xScale = scales.x;

    if (!yScale || !xScale) return;

    ctx.save();

    data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      if (meta.type !== 'bar') return;
      const zeroLabelPluginData = chart.config?.options?.plugins?.zeroLabel;
      if (!zeroLabelPluginData?.display) return;

      meta.data.forEach((bar, index) => {
        const value = dataset.data[index];

        if (value !== 0) return;

        const x = bar.x;
        const y = yScale.getPixelForValue(zeroLabelPluginData?.suggestedMin);

        ctx.font = "normal 12px 'Work Sans', sans-serif";
        ctx.fillStyle = `${COLORS.BLACK}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        ctx.fillText('0', x, y - 2);
      });
    });

    ctx.restore();
  },
};

//Plugin for horizontal bars
export const minBarSizePlugin = {
  id: 'customMinBarSize',
  beforeDraw(chart) {
    const {
      config: { options },
    } = chart;
    const customMinBarSizeminBarSize =
      options.plugins.customMinBarSize?.minBarSize || null;
    const minBarLength = customMinBarSizeminBarSize || 0.5;
    const ctx = chart.ctx;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      meta.data.forEach((bar, index) => {
        const value = dataset.data[index];

        if (value !== 0 && value !== null && value !== undefined) {
          drawBar(bar, value, ctx, dataset, index, minBarLength);
        }
      });
    });
  },
};

function drawBar(bar, value, ctx, dataset, index, minBarLength) {
  const barSize = Math.abs(bar.width);

  if (barSize < minBarLength) {
    const sign = value >= 0 ? 1 : -1;

    ctx.fillStyle = dataset.backgroundColor[index] || dataset.backgroundColor;
    ctx.fillRect(
      bar.x - (sign > 0 ? 0 : minBarLength),
      bar.y - bar.height / 2,
      minBarLength * sign,
      bar.height,
    );
  }
}

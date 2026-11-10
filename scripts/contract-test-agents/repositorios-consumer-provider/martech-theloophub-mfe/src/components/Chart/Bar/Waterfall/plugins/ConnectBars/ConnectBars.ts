/**
 * @file
 * Waterfall plugin Connect Bars implementation.
 * Based on the ConnectBars plugin from the /components/Chart/plugins/ConnectBars/ConnectBars.ts.
 * Reference: https://www.chartjs.org/docs/latest/developers/plugins.html
 */

import { Plugin } from 'chart.js';
import { ConnectBarsProps } from 'components/Chart/plugins';

export const ConnectBars: Plugin<'bar', ConnectBarsProps> = {
  id: 'connectBars',

  defaults: {
    display: false,
    color: '#000000',
    indexes: {
      first: 0,
      last: 0,
    },
  },
  afterDraw(chart, args) {
    const {
      ctx,
      config,
      data: { datasets },
      scales: { x, y },
    } = chart;
    const options =
      chart.config?.options?.plugins?.connectBars || this.defaults;

    if (!options?.display) return;

    const indexAxis = config.options.indexAxis || 'y';

    datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      if (meta.type !== 'bar') return;
      const bars = meta.data;

      bars.forEach((bar, index) => {
        if (index < options?.indexes.first) return;
        const values = dataset.data[index];

        if (!bars[index + 1]) return;
        if (typeof values !== 'object') return;

        const barElement = bar as any;
        const nextBar = bars[index + 1] as any;

        ctx.save();
        ctx.strokeStyle = options?.color;
        ctx.lineWidth = 1;

        ctx.beginPath();

        if (indexAxis === 'x') {
          const yAxis = y.getPixelForValue(values[1]);

          const startX = barElement.x + barElement.width / 2;
          const endX = nextBar.x - nextBar.width / 2;

          if (
            index == options?.indexes.last ||
            index == options?.indexes.retained
          ) {
            ctx.moveTo(startX, yAxis - barElement.height);
            ctx.lineTo(endX, yAxis - barElement.height);
          } else {
            ctx.moveTo(startX, yAxis);
            ctx.lineTo(endX, yAxis);
          }
        } else {
          const xAxis = x.getPixelForValue(values[1]);

          if (
            index == options?.indexes.last ||
            index == options?.indexes.retained
          ) {
            ctx.moveTo(
              xAxis + barElement.width,
              barElement.y - barElement.height / 2,
            );
            ctx.lineTo(
              xAxis + barElement.width,
              nextBar.y + nextBar.height / 2,
            );
          } else {
            ctx.moveTo(xAxis, barElement.y - barElement.height / 2);
            ctx.lineTo(xAxis, nextBar.y + nextBar.height / 2);
          }
        }

        ctx.stroke();
        ctx.restore();
      });
    });
  },
};

/**
 * @file
 * Waterfall plugin Waterfall Cut Bars implementation.
 * Based on the WaterfallCutBars plugin from the /components/Chart/plugins/WaterfallCutBars/WaterfallCutBars.ts.
 * Reference: https://www.chartjs.org/docs/latest/developers/plugins.html
 */

import { Plugin } from 'chart.js';
import { WaterfallCutBarsProps } from 'components/Chart/plugins/WaterfallCutBars';
import { theme } from 'theme';

export const WaterfallCutBars: Plugin<'bar', WaterfallCutBarsProps> = {
  id: 'waterfallCutBars',

  defaults: {
    display: false,
    color: '#141414',
    indexes: {
      first: 0,
      last: 0,
    },
    direction: 'diagonal',
  },

  afterDraw: function (chart) {
    const { ctx, config } = chart;
    const options =
      chart.config.options.plugins.waterfallCutBars || this.defaults;

    if (!options.display) return;
    const datasetMeta = chart.getDatasetMeta(0).data;
    const direction = options?.direction;
    const indexAxis = config.options.indexAxis || 'y';
    const standaloneBars = datasetMeta.filter(
      (bar, index) => index < options.indexes.first,
    );
    const firstBar = datasetMeta[options.indexes.first];
    const lastBar = datasetMeta[options.indexes.last];
    let retainedBar = null;

    if (options.indexes.retained) {
      retainedBar = datasetMeta[options.indexes.retained];
    }

    const RECT_WIDTH = 6;
    const OFFSET = 8;
    const LINE_WIDTH = 0.5;

    function drawHorizontalVerticalBar(bar) {
      if (!bar) return;

      const y = Math.min(bar.y, bar.base) + bar.height - 5;
      const x = bar.x - bar.width / 2;

      const rectWidth = bar.width;
      ctx.save();

      ctx.fillStyle = 'white';
      ctx.fillRect(x, y - OFFSET, rectWidth, RECT_WIDTH);

      ctx.strokeStyle = options.color;
      ctx.lineWidth = LINE_WIDTH;
      ctx.strokeRect(x, y - OFFSET, rectWidth, 0);
      ctx.strokeRect(x, y - OFFSET + RECT_WIDTH, rectWidth, 0);

      ctx.restore();
    }

    function drawHorizontalCut(bar) {
      if (!bar) return;

      const x = Math.min(bar.x, bar.base);
      const y = bar.y - bar.height / 2;
      const xPosition = x + 15;

      const rectHeight = bar.height;
      const rectWidth = 6;

      ctx.save();

      ctx.fillStyle = 'white';
      ctx.fillRect(xPosition, y, rectWidth, rectHeight);

      ctx.strokeStyle = '#828f9b';
      ctx.lineWidth = LINE_WIDTH;
      ctx.strokeRect(xPosition, y, 0, rectHeight);
      ctx.strokeRect(xPosition + rectWidth, y, 0, rectHeight);

      ctx.restore();
    }

    function drawVerticalBar(bar) {
      if (!bar) return;
      const x = Math.min(bar.x, bar.base);
      const y = bar.y - bar.height / 2;

      const rectHeight = bar.height;
      ctx.save();

      ctx.fillStyle = 'white';
      ctx.fillRect(x + OFFSET, y, RECT_WIDTH, rectHeight);

      ctx.strokeStyle = theme.colors.txt.default;
      ctx.lineWidth = LINE_WIDTH;
      ctx.strokeRect(x + OFFSET, y, 0, rectHeight);
      ctx.strokeRect(x + OFFSET + RECT_WIDTH, y, 0, rectHeight);

      ctx.restore();
    }

    let drawBar;
    if (indexAxis === 'x') {
      drawBar = drawHorizontalVerticalBar;
    } else {
      drawBar = direction === 'diagonal' ? drawHorizontalCut : drawVerticalBar;
    }

    [...standaloneBars, firstBar, lastBar, retainedBar].forEach(
      (bar) => bar && drawBar(bar),
    );
  },
};

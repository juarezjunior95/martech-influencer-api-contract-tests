import { Plugin } from 'chart.js';

import {
  GAP_COLOR,
  ZERO_BAR_COLOR,
  ZERO_BAR_GAP_PX,
  ZERO_BAR_MIN_HEIGHT_PX,
  ZERO_BAR_TOTAL_HEIGHT,
} from '../constants';
import {
  countVisualZeroBarsBelow,
  isVisualZeroBar,
} from '../utils/zeroBarHelpers';

interface BarElementRect {
  x: number;
  y: number;
  base: number;
  width: number;
}

export const ZeroStackMinHeightPlugin: Plugin<'bar'> = {
  id: 'zeroStackMinHeight',

  afterDatasetsDraw(chart) {
    const ctx = chart.ctx;
    const datasets = chart.data.datasets;

    datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      meta.data.forEach((element, index) => {
        const bar = element as unknown as BarElementRect;
        if (!isVisualZeroBar(dataset, index)) return;

        const zeroBelowCount = countVisualZeroBarsBelow(
          datasets,
          datasetIndex,
          index,
        );
        const offset = zeroBelowCount * ZERO_BAR_TOTAL_HEIGHT;

        const width = bar.width;
        const x = bar.x - width / 2;

        ctx.save();

        ctx.fillStyle = GAP_COLOR;
        ctx.fillRect(
          x,
          bar.base - offset - ZERO_BAR_TOTAL_HEIGHT,
          width,
          ZERO_BAR_TOTAL_HEIGHT,
        );

        ctx.fillStyle = ZERO_BAR_COLOR;
        ctx.fillRect(
          x,
          bar.base - offset - ZERO_BAR_GAP_PX - ZERO_BAR_MIN_HEIGHT_PX,
          width,
          ZERO_BAR_MIN_HEIGHT_PX,
        );

        ctx.restore();
      });
    });
  },
};

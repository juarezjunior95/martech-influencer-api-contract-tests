import { Chart, ChartDataset, Element } from 'chart.js';
import { DatasetPattern, StripedPatternParams } from 'models/ChartData';

type DatasetWithPattern = ChartDataset & { pattern?: DatasetPattern };

import {
  createStripedPattern,
  DEFAULT_CONFIG,
  drawPaddedRoundedRect,
  shouldApplyStripedPattern,
} from './utils/StripedBackgound.utils';

function getBarRect(
  bar: Element & Record<string, number>,
  isHorizontal: boolean,
) {
  if (isHorizontal) {
    const left = Math.min(bar.x, bar.base);
    const right = Math.max(bar.x, bar.base);
    const top = bar.y - bar.height / 2;
    return {
      x: left,
      y: top,
      width: right - left,
      height: bar.height,
    };
  }

  const top = Math.min(bar.y, bar.base);
  const bottom = Math.max(bar.y, bar.base);
  return {
    x: bar.x - bar.width / 2,
    y: top,
    width: bar.width,
    height: bottom - top,
  };
}

export const StripedBackground = {
  id: 'stripedBackground',

  afterDatasetsDraw(chart: Chart) {
    const { ctx } = chart;
    const datasets = chart.data.datasets;
    const isHorizontal = chart?.options?.indexAxis === 'y';

    datasets.forEach((rawDataset, datasetIndex) => {
      const dataset = rawDataset as DatasetWithPattern;
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.type !== 'bar') return;
      const config = {
        ...DEFAULT_CONFIG,
        ...(dataset.pattern?.params as StripedPatternParams),
      };

      meta.data.forEach(
        (bar: Element & Record<string, number>, barIndex: number) => {
          if (!dataset.pattern) return;
          if (!shouldApplyStripedPattern(dataset.pattern, barIndex)) return;
          const hasBorder =
            bar?.options?.borderWidth && bar.options.borderWidth > 0;

          const rect = getBarRect(bar, isHorizontal);
          const pattern = createStripedPattern(ctx, config);

          if (!pattern) return;

          ctx.save();

          const effectivePadding = hasBorder ? bar.options.borderWidth : 0;
          drawPaddedRoundedRect(
            ctx,
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            4,
            effectivePadding,
          );
          ctx.clip();

          ctx.fillStyle = pattern;
          ctx.fill();

          ctx.restore();
        },
      );
    });
  },
};

import { PluginOptionsByType } from 'chart.js';
import { theme } from 'theme';

export interface TotalAllocationPluginOptions {
  total_allocation: {
    value: (string | number)[];
    unit?: string;
  };
}

type ExtendedPlugins = PluginOptionsByType<'bar'> & {
  emptyBarOverlay?: { emptyIndices?: Set<number> };
  totalAllocationDatalabel?: TotalAllocationPluginOptions;
};

const HORIZONTAL_LABEL_OFFSET = 8;
const VERTICAL_LABEL_OFFSET = 50;

export const totalAllocationDatalabel = {
  id: 'totalAllocationDatalabel',
  afterDatasetsDraw(chart) {
    try {
      const {
        ctx,
        data,
        scales,
        chartArea,
        config: { options },
      } = chart;
      const totalAllocation =
        options.plugins.totalAllocationDatalabel.total_allocation;
      if (!totalAllocation) return;
      const isHorizontal = options.indexAxis === 'y';
      // Horizontal: use last dataset meta to get the right edge of the full stack.
      const meta = isHorizontal
        ? chart.getDatasetMeta(data.datasets.length - 1)
        : chart.getDatasetMeta(0);

      const emptyIndices: Set<number> =
        (options.plugins as ExtendedPlugins)?.emptyBarOverlay?.emptyIndices ??
        new Set();

      ctx.save();
      ctx.fillStyle = theme.colors.txt.default;
      ctx.font = theme.fonts.body.xsmall;

      data.labels.forEach((_, index) => {
        const value = totalAllocation.value[index] ?? '0.0';
        const allocation =
          value.includes('$') || !totalAllocation.unit
            ? value
            : totalAllocation.unit + value;

        if (isHorizontal) {
          const bar = meta.data[index];
          if (!bar) return;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          const labelX = emptyIndices.has(index)
            ? chartArea.right + HORIZONTAL_LABEL_OFFSET
            : bar.x + HORIZONTAL_LABEL_OFFSET;
          ctx.fillText(allocation, labelX, bar.y);
          return;
        }

        const total = data.datasets.reduce(
          (sum: number, dataset: { data: number[] }) =>
            sum + +dataset.data[index],
          0,
        );
        const barPosition = meta.data[index]?.x;
        const topY = scales.y.getPixelForValue(total);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(allocation, barPosition, topY - VERTICAL_LABEL_OFFSET);
      });

      ctx.restore();
    } catch (error) {
      console.error('Error in allocationDataLabel:', error);
    }
  },
};

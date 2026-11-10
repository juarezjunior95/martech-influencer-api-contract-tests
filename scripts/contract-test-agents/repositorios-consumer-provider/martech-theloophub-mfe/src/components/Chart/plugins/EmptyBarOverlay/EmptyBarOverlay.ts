import { Chart, Plugin } from 'chart.js';

const DASH_COLOR = '#C9D1D6';
const LABEL_COLOR = '#141414';
const LABEL_FONT = '400 12px "Work Sans", sans-serif';
const DASH_LINE_WIDTH = 1.5;
const BORDER_RADIUS = 8;

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

export interface EmptyBarOverlayOptions {
  emptyIndices: Set<number>;
  totalLabelX?: number;
}

export const emptyBarOverlay: Plugin<'bar'> = {
  id: 'emptyBarOverlay',

  afterDatasetsDraw(chart) {
    try {
      const options = (
        chart.options.plugins as Chart['options']['plugins'] & {
          emptyBarOverlay?: EmptyBarOverlayOptions;
        }
      )?.emptyBarOverlay;

      if (!options?.emptyIndices?.size) return;

      const { ctx, scales, chartArea } = chart;
      const yScale = scales.y;
      if (!yScale) return;

      ctx.save();

      const totalSlots = chart.data.labels?.length ?? 2;

      options.emptyIndices.forEach((dataIndex) => {
        const centerY = yScale.getPixelForValue(dataIndex);
        const halfSlot = yScale.height / (totalSlots * 2);

        const x = chartArea.left + 2;
        const w = chartArea.right - chartArea.left - 4;
        const barH = halfSlot * 2 * 0.94;
        const y = centerY - barH / 2;

        drawRoundedRect(ctx, x, y, w, barH, BORDER_RADIUS);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = DASH_COLOR;
        ctx.lineWidth = DASH_LINE_WIDTH;
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = LABEL_FONT;
        ctx.fillStyle = LABEL_COLOR;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('N/A', x + w / 2, centerY);
      });

      ctx.restore();
    } catch (error) {
      console.error('Error in emptyBarOverlay:', error);
    }
  },
};

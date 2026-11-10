import { theme } from '@hexa-ui/theme';

import {
  type BoxPosition,
  createTooltip,
  hideTooltip,
  removeTooltip,
} from './createTooltip';

type Segment = { xEnd?: number; value: number; unitMeasure?: string };

let boxPositions: BoxPosition[] = [];

const isPointInBox = (
  mouseX: number,
  mouseY: number,
  boxPos: BoxPosition,
): boolean => {
  return (
    mouseX >= boxPos.x &&
    mouseX <= boxPos.x + boxPos.width &&
    mouseY >= boxPos.y &&
    mouseY <= boxPos.y + boxPos.height
  );
};

const getXPosStart = (
  index: number,
  segments: Segment[],
  left: number,
  right: number,
  xScale: any,
  tickWidth: number,
): number => {
  if (index === 0) return left;
  const prevXEnd = segments[index - 1].xEnd;
  if (prevXEnd !== undefined) {
    return xScale.getPixelForTick(prevXEnd) - tickWidth / 2;
  }
  return right;
};

const getXPosEnd = (
  xEnd: number | undefined,
  right: number,
  xScale: any,
  tickWidth: number,
): number => {
  return xEnd ? xScale.getPixelForTick(xEnd) - tickWidth / 2 : right;
};

const formatLabelText = (segment: Segment): string => {
  return segment.unitMeasure
    ? `${segment.value}${segment.unitMeasure}`
    : String(segment.value);
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void => {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.rect(x, y, width, height);
  }
};

export function createHorizontalDashedLinePlugin(
  segments: { xEnd?: number; value: number; unitMeasure?: string }[],
  tooltipText?: string,
) {
  return {
    id: 'horizontalSteppedLine',
    beforeInit: (chart: any) => {
      const canvas = chart.canvas;

      const handleMouseMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        let isHovering = false;

        for (const boxPos of boxPositions) {
          if (isPointInBox(mouseX, mouseY, boxPos)) {
            if (boxPos.tooltipText) {
              createTooltip(boxPos, canvas, boxPos.tooltipText);
            }
            isHovering = true;
            break;
          }
        }

        if (!isHovering) {
          hideTooltip();
        }
      };

      const handleMouseLeave = () => {
        hideTooltip();
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);

      chart._horizontalDashedLineListeners = {
        mousemove: handleMouseMove,
        mouseleave: handleMouseLeave,
      };
    },
    beforeDestroy: (chart: any) => {
      const canvas = chart.canvas;
      const listeners = chart._horizontalDashedLineListeners;

      if (listeners) {
        canvas.removeEventListener('mousemove', listeners.mousemove);
        canvas.removeEventListener('mouseleave', listeners.mouseleave);
      }

      removeTooltip();
    },
    afterDatasetsDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      const { left, right } = chartArea;
      const xScale = scales['x'];
      const yScale = scales['y'];

      const tickWidth =
        xScale.ticks?.length > 1
          ? xScale.getPixelForTick(1) - xScale.getPixelForTick(0)
          : 0;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(170, 180, 190, 1)';
      ctx.lineWidth = 2;

      for (let i = 0; i < segments.length; i++) {
        const current = segments[i];
        const next = segments[i + 1];
        const yPos = yScale.getPixelForValue(current.value);
        const xPosStart = getXPosStart(
          i,
          segments,
          left,
          right,
          xScale,
          tickWidth,
        );
        const xPosEnd = getXPosEnd(current.xEnd, right, xScale, tickWidth);

        ctx.moveTo(xPosStart, yPos);
        ctx.lineTo(xPosEnd, yPos);

        if (next) {
          const nextY = yScale.getPixelForValue(next.value);
          ctx.lineTo(xPosEnd, nextY);
        }
      }

      ctx.stroke();
      ctx.setLineDash([]);

      boxPositions = [];

      const paddingX = 8;
      const boxHeight = 18;
      const marginLeft = 8;

      ctx.font = `400 12px ${theme.fonts.paragraph}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';

      for (let i = 0; i < segments.length; i++) {
        const current = segments[i];
        const yPos = yScale.getPixelForValue(current.value);
        const xPosStart = getXPosStart(
          i,
          segments,
          left,
          right,
          xScale,
          tickWidth,
        );
        const text = formatLabelText(current);

        const textWidth = ctx.measureText(text).width;
        const boxWidth = textWidth + paddingX * 2;
        const boxX = xPosStart + marginLeft;
        const boxY = yPos - boxHeight / 2;

        boxPositions.push({
          x: boxX,
          y: boxY,
          width: boxWidth,
          height: boxHeight,
          tooltipText: tooltipText,
        });

        ctx.fillStyle = '#fff';
        ctx.strokeStyle = 'rgba(170, 180, 190, 1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(20, 20, 20, 1)';
        ctx.fillText(text, boxX + paddingX, boxY + boxHeight / 2);
      }

      ctx.restore();
    },
  };
}

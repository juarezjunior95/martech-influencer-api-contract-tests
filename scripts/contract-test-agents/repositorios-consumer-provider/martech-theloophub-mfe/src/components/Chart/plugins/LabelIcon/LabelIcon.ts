import { Chart as ChartJS } from 'chart.js';

import { createLabelIcon } from './createLabelIcon';
import { createTooltip, hideTooltip, removeTooltip } from './createTooltip';

type DatasetWithIcons = {
  icons?: string[];
  labelIconTooltip?: string;
};

type IconPosition = {
  x: number;
  y: number;
  size: number;
  index: number;
  tooltipText?: string;
};

type ChartWithListeners = ChartJS & {
  _labelIconListeners?: {
    mousemove: (event: MouseEvent) => void;
    mouseleave: () => void;
  };
};

let iconPositions: IconPosition[] = [];

const isPointInIcon = (
  mouseX: number,
  mouseY: number,
  iconPos: IconPosition,
): boolean => {
  const distance = Math.sqrt(
    Math.pow(mouseX - iconPos.x, 2) + Math.pow(mouseY - iconPos.y, 2),
  );
  return distance <= iconPos.size;
};

export const LabelIcon = {
  id: 'labelIcon',
  beforeInit: (chart: ChartWithListeners) => {
    const canvas = chart.canvas;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      let isHovering = false;

      for (const iconPos of iconPositions) {
        if (isPointInIcon(mouseX, mouseY, iconPos)) {
          if (iconPos.tooltipText) {
            createTooltip(iconPos, canvas, iconPos.tooltipText);
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

    chart._labelIconListeners = {
      mousemove: handleMouseMove,
      mouseleave: handleMouseLeave,
    };
  },
  beforeDestroy: (chart: ChartWithListeners) => {
    const canvas = chart.canvas;
    const listeners = chart._labelIconListeners;

    if (listeners) {
      canvas.removeEventListener('mousemove', listeners.mousemove);
      canvas.removeEventListener('mouseleave', listeners.mouseleave);
    }

    removeTooltip();
  },
  afterDraw: (chart: ChartJS) => {
    const { ctx, scales, data, options } = chart;
    const datasets = data.datasets as DatasetWithIcons[];
    const icons = datasets[0]?.icons || [];
    const labelIconTooltip = datasets[0]?.labelIconTooltip;
    const indexAxis = options.indexAxis;

    if (!icons || icons.length === 0) return;

    const xScale = scales.x;
    const yScale = scales.y;

    if (!xScale || !yScale) return;

    iconPositions = [];

    icons.forEach((icon, index) => {
      if (icon === 'world' && chart.data.labels?.[index]) {
        const label = chart.data.labels[index];
        let iconX: number, iconY: number;
        const iconSize = 6;

        if (indexAxis === 'x') {
          const x = xScale.getPixelForValue(index);
          const y = yScale.bottom + 12;

          ctx.save();

          const labelLines = Array.isArray(label) ? label : [label as string];
          const textWidth = Math.max(
            ...labelLines.map((line) => ctx.measureText(line).width),
          );

          ctx.restore();

          iconX = x + textWidth / 2 + 10;
          iconY = y + 14;
        } else {
          iconX = xScale.left - 10;
          iconY = yScale.getPixelForValue(index);
        }

        createLabelIcon(ctx, iconX, iconY, iconSize);

        iconPositions.push({
          x: iconX,
          y: iconY,
          size: iconSize,
          index,
          tooltipText: labelIconTooltip,
        });
      }
    });
  },
};

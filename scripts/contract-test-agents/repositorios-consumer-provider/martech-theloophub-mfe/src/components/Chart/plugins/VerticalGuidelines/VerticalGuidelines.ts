import { Chart } from 'chart.js';
import { theme } from 'theme';

export interface VerticalGuidelinesProps {
  display?: boolean;
  displayLeftY?: boolean;
  displayRightY?: boolean;
  displayAxisX: boolean;
  color?: string;
}

export const VerticalGuidelines = {
  id: 'verticalGuidelines',
  afterDraw: (chart: Chart) => {
    const { ctx, scales, config } = chart;

    const verticalGuidelinesPluginConfig =
      config.options.plugins.verticalGuidelines || {};

    if (verticalGuidelinesPluginConfig?.display === false) return;

    const xAxis = scales.x;
    const yAxis = scales.y;

    if (!xAxis || !yAxis) return;

    const guidelineColor =
      verticalGuidelinesPluginConfig?.color ||
      theme.colors.charts.bg.neutrals[40];

    const drawLine = (xStart, yStart, xEnd, yEnd, color) => {
      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.lineTo(xEnd, yEnd);
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.stroke();
    };
    const plus =
      config.options.indexAxis === 'y' &&
      !verticalGuidelinesPluginConfig?.displayAxisX
        ? 30
        : 0;

    ctx.save();
    if (verticalGuidelinesPluginConfig?.displayLeftY !== false) {
      drawLine(
        xAxis.left,
        yAxis.top - 100,
        xAxis.left,
        yAxis.bottom + plus,
        guidelineColor,
      );
    }

    if (
      config.options.indexAxis === 'x' &&
      verticalGuidelinesPluginConfig?.displayRightY !== false
    ) {
      drawLine(
        xAxis.right,
        yAxis.top - 100,
        xAxis.right,
        yAxis.bottom,
        guidelineColor,
      );
    }
    if (verticalGuidelinesPluginConfig?.displayAxisX) {
      drawLine(
        xAxis.left - 100,
        yAxis.bottom,
        xAxis.right + 100,
        yAxis.bottom,
        guidelineColor,
      );
    }

    ctx.restore();
  },
};

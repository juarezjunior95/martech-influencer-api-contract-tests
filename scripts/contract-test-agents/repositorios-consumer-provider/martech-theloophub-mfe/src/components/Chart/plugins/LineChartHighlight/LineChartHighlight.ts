import { Chart, ChartArea, Scale } from 'chart.js';
import { theme } from 'theme';

import { LineChartHighlightProps } from './types';

interface Point {
  x: number;
  y: number;
}

const HIGHLIGHT_OPACITY = 0.4;
const HIGHLIGHT_WIDTH_MULTIPLIER = 0.8;
const DEFAULT_HIGHLIGHT_COLOR = '#FFF8DC';
const DEFAULT_COMPARISON_LINE_COLOR = '#AAB4BE';
const DEFAULT_COMPARISON_LINE_WIDTH = 2;
const DEFAULT_COMPARISON_LINE_DASH = [6, 6];

const shouldSkipPlugin = (
  pluginConfig: LineChartHighlightProps | undefined,
): boolean => {
  return !pluginConfig || pluginConfig.display === false;
};

const calculateHighlightDimensions = (
  xScale: Scale,
  highlightIndex: number,
  chartArea: ChartArea,
  labelsLength: number,
  canvasTop = 0,
) => {
  const totalWidth = chartArea.right - chartArea.left;
  const spacing = totalWidth / (labelsLength - 1);
  const xPos = xScale.getPixelForValue(highlightIndex);
  const highlightWidth = spacing * HIGHLIGHT_WIDTH_MULTIPLIER;

  return {
    x: xPos - highlightWidth / 2,
    y: canvasTop,
    width: highlightWidth,
    height: chartArea.bottom - canvasTop,
  };
};

const drawHighlightArea = (
  ctx: CanvasRenderingContext2D,
  dimensions: { x: number; y: number; width: number; height: number },
  color: string,
  chartArea: ChartArea,
) => {
  ctx.save();
  ctx.beginPath();
  ctx.rect(
    chartArea.left,
    0,
    chartArea.right - chartArea.left,
    chartArea.bottom,
  );
  ctx.clip();
  ctx.fillStyle = color;
  ctx.globalAlpha = HIGHLIGHT_OPACITY;
  ctx.fillRect(dimensions.x, dimensions.y, dimensions.width, dimensions.height);
  ctx.globalAlpha = 1;
  ctx.restore();
};

const drawComparisonLine = (
  ctx: CanvasRenderingContext2D,
  firstPoint: Point,
  lastPoint: Point,
  lineColor: string,
  lineWidth: number,
  lineDash: number[],
) => {
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash(lineDash);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  ctx.moveTo(firstPoint.x, firstPoint.y);
  ctx.lineTo(lastPoint.x, lastPoint.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
};

export const LineChartHighlight = {
  id: 'lineChartHighlight',
  beforeDatasetsDraw: (chart: Chart) => {
    const { ctx, chartArea, config, scales } = chart;
    const pluginConfig = config.options?.plugins
      ?.lineChartHighlight as LineChartHighlightProps;

    if (shouldSkipPlugin(pluginConfig)) return;

    const { highlightIndex, highlightColor = DEFAULT_HIGHLIGHT_COLOR } =
      pluginConfig;
    const xScale = scales.x;
    const labels = chart.data.labels || [];

    if (
      !chartArea ||
      !xScale ||
      highlightIndex === undefined ||
      highlightIndex < 0 ||
      highlightIndex >= labels.length
    )
      return;

    const dimensions = calculateHighlightDimensions(
      xScale,
      highlightIndex,
      chartArea,
      labels.length,
      0,
    );

    drawHighlightArea(ctx, dimensions, highlightColor, chartArea);
  },
  afterDatasetsDraw: (chart: Chart) => {
    const { ctx, config, data } = chart;
    const pluginConfig = config.options?.plugins
      ?.lineChartHighlight as LineChartHighlightProps;

    if (shouldSkipPlugin(pluginConfig)) return;

    const {
      showComparisonLine = false,
      comparisonLineColor = theme?.colors?.charts?.bg?.neutrals?.[40] ||
        DEFAULT_COMPARISON_LINE_COLOR,
      comparisonLineWidth = DEFAULT_COMPARISON_LINE_WIDTH,
      comparisonLineDash = DEFAULT_COMPARISON_LINE_DASH,
    } = pluginConfig;

    if (!showComparisonLine || !data.labels || data.labels.length < 2) return;

    const firstMeta = chart.getDatasetMeta(0);
    if (!firstMeta?.data || firstMeta.data.length < 2) return;

    const firstPoint = firstMeta.data[0].getProps(['x', 'y'], true) as Point;
    const lastPoint = firstMeta.data[firstMeta.data.length - 1].getProps(
      ['x', 'y'],
      true,
    ) as Point;

    drawComparisonLine(
      ctx,
      firstPoint,
      lastPoint,
      comparisonLineColor,
      comparisonLineWidth,
      comparisonLineDash,
    );
  },
};

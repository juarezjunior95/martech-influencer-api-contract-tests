/**
 * @file
 * AB the loop 2.0 KPI Custom Chart plugin Waterfall Data Label implementation.
 *
 * Reference: https://www.chartjs.org/docs/latest/developers/plugins.html
 */

import { Plugin } from 'chart.js';
import { formatNumber, parseNumber } from 'utils/format';

import type {
  CustomBarElement,
  WaterfallBarLabelDrawContext,
  WaterfallDataLabelProps,
  WaterfallVerticalBarLabelInput,
  WaterfallVerticalWideLabelInput,
} from './interface';

function readGlobalChartHoveredIndex(): number | null | undefined {
  return (
    globalThis as typeof globalThis & { __chartHoveredIndex?: number | null }
  ).__chartHoveredIndex;
}

function resolveHoveredIndex(
  options: WaterfallDataLabelProps,
): number | null | undefined {
  return readGlobalChartHoveredIndex() ?? options.hoveredIndex ?? null;
}

function drawWaterfallDatalabelHorizontal(
  ctx: CanvasRenderingContext2D,
  bar: CustomBarElement,
  label: string,
  options: WaterfallDataLabelProps,
): void {
  const xAxis = bar.x;
  const yTop = Math.min(bar.y, bar.base);
  const yAxis = yTop - 10;

  ctx.fillStyle = options.color.outside;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(label, xAxis, yAxis);
}

function resolveFillStyleForVerticalInside(
  index: number,
  options: WaterfallDataLabelProps,
): string {
  if (index === 0) {
    return options.color.outside;
  }
  if (index === options.indexes?.retained) {
    return options.color.retained;
  }
  return options.color.inside;
}

function drawWaterfallDatalabelVerticalWide(
  input: WaterfallVerticalWideLabelInput,
): void {
  const {
    ctx,
    label,
    yAxis,
    finalTextWidth,
    textWidth,
    margin,
    widthToRight,
    xToLeft,
    xToRight,
    options,
  } = input;

  ctx.fillStyle = options.color.outside;

  const finalX =
    finalTextWidth <= widthToRight
      ? xToRight + textWidth / 2 + margin
      : xToLeft - textWidth / 2 - margin;

  ctx.fillText(label, finalX, yAxis);
}

function drawWaterfallDatalabelVerticalNarrow(
  ctx: CanvasRenderingContext2D,
  label: string,
  yAxis: number,
  xAxis: number,
  cutDiscount: number,
  index: number,
  options: WaterfallDataLabelProps,
): void {
  ctx.fillStyle = resolveFillStyleForVerticalInside(index, options);
  ctx.fillText(label, xAxis + cutDiscount, yAxis);
}

function drawWaterfallDatalabelVertical(
  context: WaterfallBarLabelDrawContext,
  input: WaterfallVerticalBarLabelInput,
): void {
  const { chart, ctx, datasets, x, options } = context;
  const { bar, index, label, textWidth, cutDiscount } = input;
  const xScaleOptions = chart.config.options.scales?.x as
    { max?: number } | undefined;
  const max = xScaleOptions?.max ?? 0;
  const pair = datasets[0].data[index] as [number, number];
  const barCenter = (pair[1] + pair[0]) / 2;
  const xAxis = x.getPixelForValue(barCenter);
  const yAxis = bar.y + 6;

  const xToLeft = Math.min(bar.x, bar.base);
  const xToRight = Math.max(bar.x, bar.base);
  const xMax = x.getPixelForValue(max);
  const widthToRight = xMax - xToRight;

  const finalTextWidth = textWidth + 10 + cutDiscount;
  const margin = 5;

  if (finalTextWidth > bar.width) {
    drawWaterfallDatalabelVerticalWide({
      ctx,
      label,
      yAxis,
      finalTextWidth,
      textWidth,
      margin,
      widthToRight,
      xToLeft,
      xToRight,
      options,
    });
  } else {
    drawWaterfallDatalabelVerticalNarrow(
      ctx,
      label,
      yAxis,
      xAxis,
      cutDiscount,
      index,
      options,
    );
  }
}

function drawSingleWaterfallBarLabel(
  context: WaterfallBarLabelDrawContext,
  bar: CustomBarElement,
  index: number,
): void {
  const { ctx, options, indexAxis, hoveredIndex } = context;
  const value = parseNumber(options.datalabels[index]);
  const valueAbsolute = value >= 0 ? value : -1 * value;
  const decimals = options.decimalPlaces;
  const label = formatNumber(valueAbsolute, decimals, decimals);
  const isFirstSpecial = index === options.indexes?.first;
  const isLastSpecial = index === options.indexes?.last;
  const cutDiscount = isFirstSpecial || isLastSpecial ? 10 : 0;
  const isHovered = hoveredIndex === index;
  ctx.font = isHovered && options.fontHover ? options.fontHover : options.font;
  ctx.textAlign = options.textAlign ?? 'center';
  ctx.textBaseline =
    indexAxis === 'x' ? 'bottom' : (options.textBaseline ?? 'bottom');

  const textWidth = ctx.measureText(label).width;

  if (indexAxis === 'x') {
    drawWaterfallDatalabelHorizontal(ctx, bar, label, options);
    return;
  }

  drawWaterfallDatalabelVertical(context, {
    bar,
    index,
    label,
    textWidth,
    cutDiscount,
  });
}

export const WaterfallDatalabel: Plugin<'bar', WaterfallDataLabelProps> = {
  id: 'waterfallDatalabel',

  defaults: {
    display: false,
    datalabels: [],
    indexes: {
      first: 0,
      last: 0,
    },
    font: "normal 12px 'Work Sans', sans-serif",
    textAlign: 'center',
    textBaseline: 'bottom',
    decimalPlaces: 1,
    color: {
      inside: '#ffffff',
      outside: '#000000',
      retained: '#000000',
    },
  },
  afterDraw: function (chart) {
    const {
      ctx,
      data: { datasets },
      scales: { x },
    } = chart;
    const options =
      chart.config.options.plugins.waterfallDatalabel || this.defaults;
    const indexAxis = chart.config.options.indexAxis || 'y';

    const hoveredIndex = resolveHoveredIndex(options);

    if (!options.display) return;

    const barLabelContext: WaterfallBarLabelDrawContext = {
      chart,
      ctx,
      datasets,
      x,
      options,
      indexAxis,
      hoveredIndex,
    };

    datasets.forEach((_dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      if (meta.type !== 'bar') return;

      const bars = meta.data;

      bars.forEach((bar: CustomBarElement, index) => {
        drawSingleWaterfallBarLabel(barLabelContext, bar, index);
      });
    });

    ctx.restore();
  },
};

/**
 * @file
 * AB the loop 2.0 KPI Custom Chart plugin Waterfall Cut Bars implementation.
 *
 * Reference: https://www.chartjs.org/docs/latest/developers/plugins.html
 */

import type { ChartDataset } from 'chart.js';
import { Plugin } from 'chart.js';
import { SpecialIndexes } from 'components/Chart/Bar/Waterfall/types';
import { getTotalBarBalanceValue, VALUE_EPS } from 'components/Chart/utils';
import { theme } from 'theme';

export interface WaterfallCutBarsProps {
  display: boolean;
  color?: string;
  indexes?: SpecialIndexes;
  direction?: 'vertical' | 'diagonal';
  originalValues?: number[];
}

/** Bar pixel geometry used after Chart.js layout (floating bars). */
interface WaterfallCutBarGeometry {
  x: number;
  y: number;
  base: number;
  width: number;
  height: number;
}

/**
 * Which numeric end of the floating bar should show the cut (maps to top/right vs bottom/left in pixels).
 * Zero-anchored bars (retained, full first/last) cut at the **non-zero** end; trimmed totals keep the
 * previous balance-based rule.
 */
export const getWaterfallCutEdgeKind = (
  v0: number,
  v1: number,
): 'max-value' | 'min-value' => {
  const z0 = Math.abs(v0) < VALUE_EPS;
  const z1 = Math.abs(v1) < VALUE_EPS;

  if (z0 !== z1) {
    if (z0 && v1 > 0) return 'max-value';
    if (z0 && v1 < 0) return 'min-value';
    if (z1 && v0 < 0) return 'min-value';
    if (z1 && v0 > 0) return 'max-value';
  }

  const balance = getTotalBarBalanceValue(v0, v1);
  if (balance < 0) return 'max-value';
  return 'min-value';
};

/** indexAxis 'x': cut Y follows {@link getWaterfallCutEdgeKind}. */
export const getVerticalWaterfallCutY = (
  values: [number, number],
  topPx: number,
  bottomPx: number,
  inset = 5,
): number => {
  const edge = getWaterfallCutEdgeKind(values[0], values[1]);
  return edge === 'max-value' ? topPx + inset : bottomPx - inset;
};

function parseBarValuePair(
  dataset: ChartDataset<'bar'>,
  dataIndex: number,
): [number, number] | null {
  const raw = dataset.data[dataIndex];
  if (!Array.isArray(raw) || raw.length < 2) return null;
  const a = raw[0];
  const b = raw[1];
  if (typeof a !== 'number' || typeof b !== 'number') return null;
  return [a, b];
}

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

  afterDraw(chart) {
    const { ctx, config, data } = chart;
    const options = config.options.plugins.waterfallCutBars || this.defaults;

    if (!options.display) return;

    const dataset = data.datasets[0] as ChartDataset<'bar'>;
    if (!dataset?.data?.length) return;

    const datasetMeta = chart.getDatasetMeta(0)
      .data as unknown as WaterfallCutBarGeometry[];
    const direction = options.direction;
    const indexAxis = config.options.indexAxis ?? 'x';
    const indexes = options.indexes ?? this.defaults.indexes;

    const RECT_WIDTH = 6;
    const OFFSET = 8;
    const OFFSET_NEGATIVE = 4;
    const LINE_WIDTH = 0.5;
    const HORIZONTAL_CUT_INSET = 15;

    const drawHorizontalVerticalBar = (
      bar: WaterfallCutBarGeometry,
      dataIndex: number,
    ) => {
      const pair = parseBarValuePair(dataset, dataIndex);
      const topPx = Math.min(bar.y, bar.base);
      const bottomPx = Math.max(bar.y, bar.base);
      const yCut = pair
        ? getVerticalWaterfallCutY(pair, topPx, bottomPx)
        : bottomPx - 5;

      const cutAtMaxEnd = pair
        ? getWaterfallCutEdgeKind(pair[0], pair[1]) === 'max-value'
        : false;
      const rectTopY = cutAtMaxEnd ? yCut + OFFSET_NEGATIVE : yCut - OFFSET;

      const x = bar.x - bar.width / 2;
      const rectWidth = bar.width;

      ctx.save();
      ctx.fillStyle = 'white';
      ctx.fillRect(x, rectTopY, rectWidth, RECT_WIDTH);
      ctx.strokeStyle = options.color;
      ctx.lineWidth = LINE_WIDTH;
      ctx.strokeRect(x, rectTopY, rectWidth, 0);
      ctx.strokeRect(x, rectTopY + RECT_WIDTH, rectWidth, 0);
      ctx.restore();
    };

    const drawHorizontalCut = (
      bar: WaterfallCutBarGeometry,
      dataIndex: number,
    ) => {
      const pair = parseBarValuePair(dataset, dataIndex);
      const leftPx = Math.min(bar.x, bar.base);
      const rightPx = Math.max(bar.x, bar.base);
      const edge = pair
        ? getWaterfallCutEdgeKind(pair[0], pair[1])
        : 'min-value';
      const xPosition =
        edge === 'max-value'
          ? rightPx - HORIZONTAL_CUT_INSET
          : leftPx + HORIZONTAL_CUT_INSET;

      const y = bar.y - bar.height / 2;
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
    };

    const drawVerticalBarStrip = (
      bar: WaterfallCutBarGeometry,
      dataIndex: number,
    ) => {
      const pair = parseBarValuePair(dataset, dataIndex);
      const edge = pair
        ? getWaterfallCutEdgeKind(pair[0], pair[1])
        : 'min-value';
      const leftPx = Math.min(bar.x, bar.base);
      const rightPx = Math.max(bar.x, bar.base);
      const x = edge === 'max-value' ? rightPx - OFFSET : leftPx + OFFSET;

      const y = bar.y - bar.height / 2;
      const rectHeight = bar.height;

      ctx.save();
      ctx.fillStyle = 'white';
      ctx.fillRect(x, y, RECT_WIDTH, rectHeight);
      ctx.strokeStyle = theme.colors.txt.default;
      ctx.lineWidth = LINE_WIDTH;
      ctx.strokeRect(x, y, 0, rectHeight);
      ctx.strokeRect(x + RECT_WIDTH, y, 0, rectHeight);
      ctx.restore();
    };

    let drawBar: (bar: WaterfallCutBarGeometry, dataIndex: number) => void;
    if (indexAxis === 'x') {
      drawBar = drawHorizontalVerticalBar;
    } else if (direction === 'diagonal') {
      drawBar = drawHorizontalCut;
    } else {
      drawBar = drawVerticalBarStrip;
    }

    const schedule = (idx: number) => {
      const bar = datasetMeta[idx];
      if (bar && options.originalValues?.[idx] !== 0) drawBar(bar, idx);
    };

    for (let i = 0; i < indexes.first; i += 1) {
      schedule(i);
    }
    schedule(indexes.first);
    schedule(indexes.last);
    if (indexes.retained !== undefined) {
      schedule(indexes.retained);
    }
  },
};

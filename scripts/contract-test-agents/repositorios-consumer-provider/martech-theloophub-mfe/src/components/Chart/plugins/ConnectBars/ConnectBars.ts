/**
 * @file
 * AB the loop 2.0 KPI Custom Chart plugin Connect Bars implementation.
 *
 * Reference: https://www.chartjs.org/docs/latest/developers/plugins.html
 */

import { Plugin } from 'chart.js';
import { SpecialIndexes } from 'components/Chart/Bar/Waterfall/types';
import { getTotalBarBalanceValue } from 'components/Chart/utils';

/** Pixel geometry Chart.js sets on bar elements after layout (not on BarElement typings). */
interface ConnectBarGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ConnectBarsProps {
  display: boolean;
  color?: string;
  indexes?: SpecialIndexes;
}

/**
 * Y (indexAxis 'x') or X (indexAxis 'y') where the connector sits: floating uses `values[1]`;
 * totals use {@link getTotalBarBalanceValue} (full balance, incl. trimmed first/last ranges).
 */
export const getWaterfallConnectorEndValue = (
  values: [number, number],
  barIndex: number,
  indexes: Pick<SpecialIndexes, 'first' | 'last' | 'retained'>,
): number => {
  const [v0, v1] = values;
  const isTotalBar =
    barIndex === indexes.first ||
    barIndex === indexes.last ||
    (indexes.retained !== undefined && barIndex === indexes.retained);

  if (!isTotalBar) {
    return v1;
  }

  return getTotalBarBalanceValue(v0, v1);
};

export const ConnectBars: Plugin<'bar', ConnectBarsProps> = {
  id: 'connectBars',

  defaults: {
    display: false,
    color: '#000000',
    indexes: {
      first: 0,
      last: 0,
    },
  },
  afterDraw(chart) {
    const {
      ctx,
      config,
      data: { datasets },
      scales: { x, y },
    } = chart;
    const options =
      chart.config?.options?.plugins?.connectBars || this.defaults;

    if (!options?.display) return;

    const indexAxis = config.options.indexAxis ?? 'x';

    const idx = options?.indexes ?? this.defaults.indexes;

    datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      if (meta.type !== 'bar') return;
      const bars = meta.data;

      bars.forEach((bar, index) => {
        if (index < idx.first) return;
        const raw = dataset.data[index];

        if (!bars[index + 1]) return;
        if (!Array.isArray(raw) || raw.length < 2) return;

        const v0 = raw[0];
        const v1 = raw[1];
        if (typeof v0 !== 'number' || typeof v1 !== 'number') return;

        const values: [number, number] = [v0, v1];
        const barElement = bar as unknown as ConnectBarGeometry;
        const nextBar = bars[index + 1] as unknown as ConnectBarGeometry;

        const connectorValue = getWaterfallConnectorEndValue(
          values,
          index,
          idx,
        );

        ctx.save();
        ctx.strokeStyle = options?.color;
        ctx.lineWidth = 1;

        ctx.beginPath();

        if (indexAxis === 'x') {
          const yPixel = y.getPixelForValue(connectorValue);
          const startX = barElement.x + barElement.width / 2;
          const endX = nextBar.x - nextBar.width / 2;

          ctx.moveTo(startX, yPixel);
          ctx.lineTo(endX, yPixel);
        } else {
          const xPixel = x.getPixelForValue(connectorValue);

          ctx.moveTo(xPixel, barElement.y - barElement.height / 2);
          ctx.lineTo(xPixel, nextBar.y + nextBar.height / 2);
        }

        ctx.stroke();
        ctx.restore();
      });
    });
  },
};

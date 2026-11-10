import type { ChartDataset, ChartOptions } from 'chart.js';

const DEFAULT_BAR_CHART_OPTIONS: ChartOptions<'bar'> = {
  layout: {
    padding: { top: 40, left: 16, right: 16 },
  },
  scales: {
    y: { ticks: { maxTicksLimit: 5 } },
  },
};

function maybeConsumeNumber(
  value: unknown,
  acc: { hasAny: boolean; hasNegative: boolean; min: number; max: number },
): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) return;

  acc.hasAny = true;
  if (value < 0) acc.hasNegative = true;
  if (value < acc.min) acc.min = value;
  if (value > acc.max) acc.max = value;
}

function consumeDatasetData(
  data: unknown,
  acc: { hasAny: boolean; hasNegative: boolean; min: number; max: number },
): void {
  if (!Array.isArray(data)) return;

  for (const item of data) {
    if (Array.isArray(item)) {
      for (const nested of item) {
        maybeConsumeNumber(nested, acc);
      }
      continue;
    }

    maybeConsumeNumber(item, acc);

    if (item && typeof item === 'object' && 'y' in item) {
      maybeConsumeNumber((item as { y?: unknown }).y, acc);
    }
  }
}

export function getBarChartOptionsFromDatasets(
  datasets?: ChartDataset<'bar'>[],
): ChartOptions<'bar'> {
  if (!datasets?.length) return DEFAULT_BAR_CHART_OPTIONS;

  const acc = {
    hasAny: false,
    hasNegative: false,
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY,
  };

  for (const dataset of datasets) {
    consumeDatasetData(dataset.data, acc);
  }

  if (!acc.hasAny || !Number.isFinite(acc.min) || !Number.isFinite(acc.max)) {
    return DEFAULT_BAR_CHART_OPTIONS;
  }

  let yScaleOverrides = {};

  if (acc.hasNegative) {
    const absMax = Math.max(Math.abs(acc.min), Math.abs(acc.max));
    const hasMixed = acc.max > 0;

    if (hasMixed) {
      const buffer = absMax * 0.2;
      yScaleOverrides = {
        suggestedMin: -(absMax + buffer),
        suggestedMax: absMax + buffer,
      };
    } else {
      const negativeRange = absMax * 1.3;
      yScaleOverrides = {
        suggestedMin: -negativeRange,
        suggestedMax: negativeRange * (2 / 3),
      };
    }
  }

  if (!acc.hasNegative && acc.max > 0) {
    const buffer = acc.max * 0.15;
    yScaleOverrides = {
      suggestedMin: 0,
      suggestedMax: acc.max + buffer,
    };
  }

  return {
    ...DEFAULT_BAR_CHART_OPTIONS,
    scales: {
      ...DEFAULT_BAR_CHART_OPTIONS.scales,
      y: {
        ...DEFAULT_BAR_CHART_OPTIONS.scales?.y,
        ...yScaleOverrides,
        ticks: { maxTicksLimit: 5 },
      },
    },
  };
}

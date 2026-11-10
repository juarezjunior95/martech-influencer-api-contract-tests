import { ConnectorPluginProps, RoudedArrowProps } from '../plugins';

const upConnector = {
  backgroundColor: '#e6f9e6',
  textColor: '#007800',
};

const downConnector = {
  backgroundColor: '#fee2e2',
  textColor: '#b91c1c',
};

export const getChartSuggestedMinMax = (data, spacing = 0.2) => {
  let min = Math.min(
    ...(data?.datasets?.map((dataset) =>
      Math.min(...(dataset.data?.flat() || [])),
    ) || []),
    0,
  );
  const max = Math.max(
    ...(data?.datasets?.map((dataset) =>
      Math.max(...(dataset.data?.flat() || [])),
    ) || []),
    0,
  );

  if (min < 0) {
    min += min * spacing;
  }

  return { min, max };
};

export function calculateMin(min: number, padding: number): number {
  return min < 0 ? min - padding : min;
}

/**
 * Value epsilon used for floating point comparisons.
 */
export const VALUE_EPS = 1e-9;

/**
 * Logical balance for a total column (anchor at 0 or trimmed range without touching 0).
 * Used by ConnectBars / WaterfallCutBars.
 */
export const getTotalBarBalanceValue = (v0: number, v1: number): number => {
  const z0 = Math.abs(v0) < VALUE_EPS;
  const z1 = Math.abs(v1) < VALUE_EPS;
  if (z0 && !z1) return v1;
  if (z1 && !z0) return v0;
  if (v0 > 0 && v1 > 0) return Math.max(v0, v1);
  if (v0 < 0 && v1 < 0) return Math.min(v0, v1);
  return v1;
};

type BarChartData = {
  labels: string[];
  roundedArrow?: RoudedArrowProps;
};

export const getConnectorData = (
  barChart?: BarChartData,
): ConnectorPluginProps => {
  if (!barChart) return {};
  const labels = barChart.labels ?? [];
  const roundedArrow = barChart.roundedArrow;
  const direction = roundedArrow?.direction;

  if (typeof roundedArrow?.comparison !== 'number') return {};

  const backgroundColor =
    direction === 'up'
      ? upConnector.backgroundColor
      : downConnector.backgroundColor;

  const textColor =
    direction === 'up' ? upConnector.textColor : downConnector.textColor;

  return {
    from: labels[0],
    to: labels[labels.length - 1],
    value: roundedArrow?.comparison?.toString() ?? '',
    measure: roundedArrow?.unit_of_measure,
    prefix: roundedArrow?.prefix,
    backgroundColor,
    textColor,
  };
};

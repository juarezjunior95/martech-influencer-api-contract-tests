import {
  BarChartKpiData,
  LegendItem,
  WaterfallChartKpiData,
} from 'pages/pillars/ValueCreation/VolumePages/types';

export const volumePagePrefixedTestId = (
  prefix: string | undefined,
  suffix: string,
  fallback?: string,
): string | undefined => (prefix ? `${prefix}-${suffix}` : fallback);

export const waterfallChartWithLegend = (
  data: unknown,
  key: string,
  legend: LegendItem[],
): WaterfallChartKpiData | undefined => {
  if (!data || typeof data !== 'object') {
    return undefined;
  }
  const raw = (data as Record<string, unknown>)?.[key];
  if (!raw) {
    return undefined;
  }
  return {
    ...(raw as WaterfallChartKpiData),
    legend,
  };
};

export const barChartWithLegend = (
  data: unknown,
  key: string,
  legend: LegendItem[],
): BarChartKpiData | undefined => {
  if (!data || typeof data !== 'object') {
    return undefined;
  }
  const raw = (data as Record<string, unknown>)?.[key];
  if (!raw) {
    return undefined;
  }
  return {
    ...(raw as BarChartKpiData),
    legend,
  };
};

import type { KPIType } from '../types';

export const SELECTED_KPI_TO_BACKEND_KPI: Record<KPIType, string> = {
  volume: 'volume',
  icl: 'icl',
  participation: 'participation',
  wmtbb: 'wmtbb',
  sot: 'sot',
};

export const Y_AXIS_CONFIG: Partial<
  Record<
    KPIType,
    { suggestedMin: number; suggestedMax: number; stepSize: number }
  >
> = {
  icl: { suggestedMin: 80, suggestedMax: 100, stepSize: 5 },
  participation: { suggestedMin: 0, suggestedMax: 100, stepSize: 20 },
};

export const CHART_LINE_COLOR: Partial<Record<KPIType, string>> = {
  volume: '#DEB333',
  icl: '#F5DC03',
  participation: '#DEB333',
  wmtbb: '#DEB333',
};

export const CHART_DATA_TEST_ID: Record<KPIType, string> = {
  volume: 'drill-down-volume-performance',
  icl: 'drill-down-icl-performance',
  participation: 'drill-down-participation-performance',
  wmtbb: 'drill-down-wmtbb-performance',
  sot: 'drill-down-sot-performance',
};

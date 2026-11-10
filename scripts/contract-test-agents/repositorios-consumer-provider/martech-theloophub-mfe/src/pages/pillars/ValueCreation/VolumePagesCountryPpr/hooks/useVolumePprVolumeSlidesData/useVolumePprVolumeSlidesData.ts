import { useMemo } from 'react';

import { TableDataType } from 'components/Table/types';
import { useBffData } from 'hooks';
import { DEFAULT_ENDPOINTS } from 'pages/pillars/ValueCreation/VolumePages/config/api';

import {
  BigNumbersKpiData,
  LegendItem,
  LineChartKpiData,
  WaterfallChartKpiData,
} from '../../../VolumePages/types';

const EMPTY_TABLE: TableDataType = { header: [], rows: [] };
const EMPTY_LINE_CHART: LineChartKpiData = {
  datasets: [],
  formattedData: [],
  labels: [],
  empty: true,
};
const EMPTY_BRANDS_AVATAR: WaterfallChartKpiData['brandsAvatar'] = {
  data: [],
};
const EMPTY_COMPARISON_LINE: WaterfallChartKpiData['comparisonLine'] = {
  data: [],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value != null && typeof value === 'object';

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number');

const isStringMatrix = (value: unknown): value is string[][] =>
  Array.isArray(value) && value.every(isStringArray);

const isLegendItems = (value: unknown): value is LegendItem[] =>
  Array.isArray(value);

const isTableData = (value: unknown): value is TableDataType =>
  isRecord(value) && Array.isArray(value.header) && Array.isArray(value.rows);

const isBigNumbersKpiData = (value: unknown): value is BigNumbersKpiData[] =>
  Array.isArray(value);

const isLineChartKpiData = (value: unknown): value is LineChartKpiData =>
  isRecord(value) &&
  Array.isArray(value.datasets) &&
  isStringMatrix(value.formattedData) &&
  isStringArray(value.labels);

const getBrandsAvatar = (
  value: unknown,
): WaterfallChartKpiData['brandsAvatar'] => {
  if (!isRecord(value)) return EMPTY_BRANDS_AVATAR;

  return {
    data: Array.isArray(value.data) ? value.data : [],
  };
};

const getComparisonLine = (
  value: unknown,
): WaterfallChartKpiData['comparisonLine'] => {
  if (!isRecord(value)) return EMPTY_COMPARISON_LINE;

  return {
    data: Array.isArray(value.data) ? value.data : [],
  };
};

const getWaterfallEmptyState = (value: unknown) =>
  typeof value === 'boolean' ? value : undefined;

const getBigNumbers = (
  data: Record<string, unknown> | undefined,
  key: string,
): BigNumbersKpiData[] => {
  const value = data?.[key];

  return isBigNumbersKpiData(value) ? value : [];
};

const getLineChart = (
  data: Record<string, unknown> | undefined,
  key: string,
): LineChartKpiData => {
  const value = data?.[key];

  return isLineChartKpiData(value) ? value : EMPTY_LINE_CHART;
};

const getTable = (
  data: Record<string, unknown> | undefined,
  key: string,
): TableDataType => {
  const value = data?.[key];

  return isTableData(value) ? value : EMPTY_TABLE;
};

const normalizeWaterfallChartKpiData = (
  value: unknown,
  period: string,
): WaterfallChartKpiData => {
  if (!isRecord(value)) {
    return {
      period,
      values: [],
      labels: [],
      brandsAvatar: EMPTY_BRANDS_AVATAR,
      comparisonLine: EMPTY_COMPARISON_LINE,
      legend: [],
      empty: true,
    };
  }

  return {
    period: typeof value.period === 'string' ? value.period : period,
    values: isNumberArray(value.values) ? value.values : [],
    labels: isStringArray(value.labels) ? value.labels : [],
    brandsAvatar: getBrandsAvatar(value.brandsAvatar),
    comparisonLine: getComparisonLine(value.comparisonLine),
    legend: isLegendItems(value.legend) ? value.legend : [],
    formattedData: isStringMatrix(value.formattedData)
      ? value.formattedData
      : [],
    empty: getWaterfallEmptyState(value.empty),
  };
};

export interface VolumeSlideContentData {
  bigNumbersKpiData: BigNumbersKpiData[];
  lineChartKpiData: LineChartKpiData;
  portfolioTableKpiData: TableDataType;
  prioritiesTableKpiData: TableDataType;
  marketsTableKpiData: TableDataType;
  topWaterfallKpiData: WaterfallChartKpiData;
  bottomWaterfallKpiData: WaterfallChartKpiData;
}

export interface UseVolumePprVolumeSlidesDataResult {
  volumeSlideRequest: {
    data: unknown;
    loading: boolean;
    error: Error | null;
  };
  volumeSlideContentData: VolumeSlideContentData;
  sectionLoading: boolean;
}

export const useVolumePprVolumeSlidesData = (
  isGlobalZone: boolean,
  countryCode: string,
): UseVolumePprVolumeSlidesDataResult => {
  const countryVolumePageData = useBffData({
    id: DEFAULT_ENDPOINTS.country,
    kpiGroup: 'volume',
    subFilters: {
      country: countryCode,
      kpi: 'volume',
    },
    skipRequest: isGlobalZone,
  });

  const globalVolumePageData = useBffData({
    id: DEFAULT_ENDPOINTS.global,
    kpiGroup: 'volume',
    subFilters: {
      kpi: 'volume',
    },
    skipMainFilters: true,
    skipRequest: !isGlobalZone,
  });

  const volumeSlideRequest = useMemo(() => {
    if (isGlobalZone) {
      return {
        data: globalVolumePageData.data,
        loading: globalVolumePageData.loading,
        error: globalVolumePageData.error,
      };
    }
    return {
      data: countryVolumePageData.data,
      loading: countryVolumePageData.loading,
      error: countryVolumePageData.error,
    };
  }, [
    isGlobalZone,
    globalVolumePageData.data,
    globalVolumePageData.loading,
    globalVolumePageData.error,
    countryVolumePageData.data,
    countryVolumePageData.loading,
    countryVolumePageData.error,
  ]);

  const volumeSlideContentData = useMemo((): VolumeSlideContentData => {
    const d = isRecord(volumeSlideRequest.data)
      ? volumeSlideRequest.data
      : undefined;
    if (isGlobalZone) {
      return {
        bigNumbersKpiData: getBigNumbers(d, 'big-numbers-global'),
        lineChartKpiData: getLineChart(d, 'line-chart-global'),
        portfolioTableKpiData: getTable(d, 'portfolio'),
        prioritiesTableKpiData: getTable(d, 'growth-levers-priorities'),
        marketsTableKpiData: getTable(d, 'must-win-markets'),
        topWaterfallKpiData: normalizeWaterfallChartKpiData(undefined, 'YTD'),
        bottomWaterfallKpiData: normalizeWaterfallChartKpiData(
          undefined,
          'MTD',
        ),
      };
    }
    return {
      bigNumbersKpiData: getBigNumbers(d, 'big-numbers'),
      lineChartKpiData: getLineChart(d, 'line-chart'),
      portfolioTableKpiData: getTable(d, 'portfolio'),
      prioritiesTableKpiData: getTable(d, 'growth-levers'),
      marketsTableKpiData: EMPTY_TABLE,
      topWaterfallKpiData: normalizeWaterfallChartKpiData(
        d?.['brands-volume-YTD'],
        'YTD',
      ),
      bottomWaterfallKpiData: normalizeWaterfallChartKpiData(
        d?.['brands-volume-MTD'],
        'MTD',
      ),
    };
  }, [isGlobalZone, volumeSlideRequest.data]);

  return {
    volumeSlideRequest,
    volumeSlideContentData,
    sectionLoading: volumeSlideRequest.loading,
  };
};

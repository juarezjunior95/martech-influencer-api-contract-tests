import { useMemo } from 'react';

import { ChartLegendItem } from 'components/ChartLegend/ChartLegend';
import { LineBarChartsSectionData } from 'pages/pillars/ValueCreation/PerformanceTool/types';
import { getBarChartOptionsFromDatasets } from 'pages/pillars/ValueCreation/PerformanceTool/utils/getBarChartOptions';

const CHART_COLORS = {
  lastYear: '#eddab1',
  budget: '#f1d715',
  current: '#d1a33c',
};

const getColor = (label?: string): string => {
  if (label === 'Last Year') return CHART_COLORS.lastYear;
  if (label === 'Budget') return CHART_COLORS.budget;
  return CHART_COLORS.current;
};

const getBarColors = (labels: string[], stripedIndexes: number[]): string[] => {
  return labels.map((_, index, array) => {
    if (stripedIndexes.includes(index)) return CHART_COLORS.budget;
    if (index === array.length - 1) return CHART_COLORS.current;
    return CHART_COLORS.lastYear;
  });
};

export const useLineBarChartDatasets = (data?: LineBarChartsSectionData) => {
  const legendItems = useMemo<ChartLegendItem[]>(() => {
    if (!data?.legend) return [];
    return data.legend.map((item) => ({
      label: item.label,
      color: getColor(item.label),
      shape: 'rectangle',
      size: 'small',
      decoration: item.label === 'Budget' ? 'dash' : 'none',
    }));
  }, [data?.legend]);

  const lineDatasets = useMemo(() => {
    if (!data?.lineChart?.datasets) return [];
    return data.lineChart.datasets.map((dataset) => ({
      ...dataset,
      borderColor: dataset.borderColor || getColor(dataset.label),
      pointBackgroundColor:
        dataset.pointBackgroundColor || getColor(dataset.label),
    }));
  }, [data?.lineChart?.datasets]);

  const barDatasets = useMemo(() => {
    if (!data?.barChart?.datasets) return [];
    const labels = data.barChart.labels || [];
    const backgroundColors = getBarColors(
      labels,
      data?.barChart?.stripedIndexes || [],
    );
    return data.barChart.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: backgroundColors,
    }));
  }, [
    data?.barChart?.datasets,
    data?.barChart?.labels,
    data?.barChart?.stripedIndexes,
  ]);

  const highlightedIndexes = useMemo(() => {
    return data?.lineChart?.highlightedIndexes || [];
  }, [data?.lineChart?.highlightedIndexes]);

  const barOptions = useMemo(
    () => getBarChartOptionsFromDatasets(data?.barChart?.datasets),
    [data?.barChart?.datasets],
  );

  return {
    legendItems,
    lineDatasets,
    barDatasets,
    highlightedIndexes,
    barOptions,
  };
};

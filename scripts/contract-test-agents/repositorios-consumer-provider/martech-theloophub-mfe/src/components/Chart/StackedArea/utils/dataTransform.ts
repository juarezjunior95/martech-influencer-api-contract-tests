import { ChartDataset } from 'chart.js';

import {
  ResponsiveConfig,
  StackedAreaBarDataset,
  StackedAreaColumn,
} from '../types';
import { normalizeColumnsToPercentages } from './normalizeToPercentages';

export function transformToChartData(
  columns: StackedAreaColumn[],
  colors: string[],
  legends?: string[],
  responsiveConfig?: ResponsiveConfig,
): ChartDataset<'bar'>[] {
  const normalizedColumns = normalizeColumnsToPercentages(columns);
  const numSegments = normalizedColumns[0]?.segments.length ?? 0;
  const datasets: ChartDataset<'bar'>[] = [];

  const barThickness = responsiveConfig?.columnWidth ?? 60;
  const maxBarThickness = Math.round(barThickness * 1.33);

  const getBorderWidth = (topSegment: boolean, bottomSegment: boolean) => {
    if (topSegment) {
      return { top: 2 };
    }
    if (bottomSegment) {
      return { bottom: 2 };
    }
    return { bottom: 2, top: 2 };
  };

  for (let segmentIndex = numSegments - 1; segmentIndex >= 0; segmentIndex--) {
    const dataPoints: number[] = [];
    const originalValues: (number | string)[] = [];
    const showNumbers: boolean[] = [];

    normalizedColumns.forEach((column, colIndex) => {
      const segment = column.segments[segmentIndex];
      const numericValue = Number(segment.value);
      dataPoints.push(Number.isNaN(numericValue) ? 0 : numericValue);

      const originalSegment = columns[colIndex]?.segments[segmentIndex];
      originalValues.push(originalSegment?.value ?? segment.value);
      showNumbers.push(originalSegment?.showNumber ?? true);
    });

    const isTopSegment = segmentIndex === numSegments - 1;
    const isBottomSegment = segmentIndex === 0;

    const borderWidth = getBorderWidth(isTopSegment, isBottomSegment);

    datasets.push({
      data: dataPoints,
      backgroundColor: colors[segmentIndex] || '#000',
      label: legends?.[segmentIndex] ?? `Area ${segmentIndex + 1}`,
      barThickness,
      maxBarThickness,
      originalValues,
      showNumbers,
      borderColor: '#ffffff',
      borderWidth,
    } as StackedAreaBarDataset);
  }
  return datasets;
}

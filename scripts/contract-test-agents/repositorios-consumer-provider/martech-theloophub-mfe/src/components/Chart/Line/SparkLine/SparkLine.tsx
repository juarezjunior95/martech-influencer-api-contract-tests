import { useMemo } from 'react';

import { ChartDataset } from 'chart.js';
import { Line } from 'components/Chart/Line';
import type { SparkLineProps } from 'components/Chart/Line/SparkLine/types';
import {
  createLineGradient,
  hexToRgb,
} from 'components/Chart/Line/SparkLine/utils';

const DEFAULT_COLOR = '#DEB333';
const LAST_POINT_RADIUS = 5;
const LAST_POINT_HOVER_RADIUS = 6;

const getDatasetDataLength = (dataset: { data?: unknown }): number =>
  Array.isArray(dataset.data) ? dataset.data.length : 0;

const primaryDatasetHasSinglePoint = (
  inputDatasets: SparkLineProps['datasets'],
): boolean =>
  inputDatasets.length > 0 && getDatasetDataLength(inputDatasets[0]) === 1;

export const SparkLine = ({
  datasets,
  color = DEFAULT_COLOR,
  gradientOptions = {},
  labels,
  formattedData,
  ...rest
}: SparkLineProps) => {
  const { opacityStart = 0.25, opacityEnd = 0.05 } = gradientOptions;
  const colorRgb = useMemo(() => hexToRgb(color), [color]);

  const datasetsWithGradient = useMemo(() => {
    return datasets.map((dataset) => {
      const dataLength = Array.isArray(dataset.data) ? dataset.data.length : 0;

      return {
        ...dataset,
        borderColor: color,
        fill: true,
        backgroundColor: (context: {
          chart: {
            ctx: CanvasRenderingContext2D;
            chartArea: { top: number; bottom: number } | null;
          };
        }) => {
          const { chart } = context;
          if (!chart.chartArea) return 'transparent';
          const { ctx } = chart;
          const { top, bottom } = chart.chartArea;
          return createLineGradient(
            ctx,
            top,
            bottom,
            colorRgb,
            opacityStart,
            opacityEnd,
          );
        },
        pointRadius: (context: { dataIndex: number }) =>
          context.dataIndex === dataLength - 1 ? LAST_POINT_RADIUS : 0,
        pointHoverRadius: (context: { dataIndex: number }) =>
          context.dataIndex === dataLength - 1 ? LAST_POINT_HOVER_RADIUS : 0,
        pointBackgroundColor: color,
        pointBorderColor: '#FFFFFF',
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#FFFFFF',
      };
    }) as ChartDataset<'line'>[];
  }, [datasets, color, colorRgb, opacityStart, opacityEnd]);

  if (primaryDatasetHasSinglePoint(datasets)) {
    return null;
  }

  return (
    <Line
      {...rest}
      labels={labels}
      formattedData={formattedData}
      datasets={datasetsWithGradient}
      axisType="none"
      showLabels={false}
      showGrid={false}
      labelColors={['transparent']}
      borderColor="transparent"
      drawZeroLine={false}
      spacing={0}
      options={{
        layout: {
          padding: 0,
        },
        scales: {
          x: {
            display: false,
            grid: { display: false },
            offset: false,
            ticks: {
              display: false,
              padding: 0,
            },
            afterFit: (axis: { width?: number; height?: number }) => {
              axis.width = 0;
              axis.height = 0;
            },
          },
          y: {
            display: false,
            grid: { display: false },
            ticks: {
              display: false,
              padding: 0,
            },
            afterFit: (axis: { width?: number }) => {
              axis.width = 0;
            },
          },
        },
      }}
    />
  );
};

import { useCallback, useMemo } from 'react';

import { ChartOptions } from 'chart.js';
import { BaseChart, InteractiveChartConfig } from 'components/Chart/BaseChart';
import { ConnectBars } from 'components/Chart/plugins';
import { WaterfallCutBars } from 'components/Chart/plugins/WaterfallCutBars';
import { WaterfallDatalabel } from 'components/Chart/plugins/WaterfallDatalabel';
import { BarSize, BaseChartComponentProps } from 'components/Chart/types';
import { merge } from 'lodash';
import { parseNumber } from 'utils/format';

import { barSize } from '../constants';
import { CHART_COLOR, FIT_Y_AXIS, FONT_CONFIG } from './constants';
import { Colors, SpecialIndexes } from './types';
import {
  buildNormalizedWaterfallRanges,
  createColorsWithDefaults,
  createResolvedSpecialIndexes,
} from './utils';

interface NewWaterfallProps extends Omit<
  BaseChartComponentProps,
  'datasets' | 'showGrid'
> {
  values: number[];
  specialIndexes?: SpecialIndexes;
  colors?: Colors;
  size?: BarSize;
  interactiveConfig?: InteractiveChartConfig;
  dataTestId?: string;
}

/**
 * NewWaterfall component is a wrapper around the BaseChart component that provides a new way to render a waterfall chart.
 * It is a more flexible and customizable component that allows you to control the data, labels, and colors of the chart.
 * It is also more performant and easier to use than the Waterfall component.
 *
 * @param values - The values to display in the chart.
 * @param specialIndexes - The special indexes to display in the chart.
 * @param colors - The colors to use in the chart.
 */
export const NewWaterfall = ({
  values,
  specialIndexes,
  colors,
  size = 'medium',
  options: customOptions = {},
  formattedData,
  labels,
  indexAxis = 'x',
  axisType = 'none',
  interactiveConfig,
  showLabels = true,
  drawZeroLine = false,
  dataTestId,
  ...rest
}: NewWaterfallProps) => {
  const colorsConfig = useMemo(
    () => createColorsWithDefaults(colors),
    [colors],
  );

  const resolvedIndexes = useMemo(
    () => createResolvedSpecialIndexes(specialIndexes, labels.length),
    [specialIndexes, labels.length],
  );

  const assignBackgroundColors = useCallback(
    (processedValues: number[]): string[] => {
      return processedValues.map((value, index) => {
        if (index < resolvedIndexes.first) return colorsConfig.first;
        if (index === resolvedIndexes.first) return colorsConfig.first;
        if (index === resolvedIndexes.last) return colorsConfig.last;
        if (index === resolvedIndexes.retained) return colorsConfig.retained;

        return value > 0 ? colorsConfig.positive : colorsConfig.negative;
      });
    },
    [colorsConfig, resolvedIndexes],
  );

  const processedData = useMemo(() => {
    const numericValues = values.map((value) => parseNumber(String(value)));

    const { normalizedRanges, min, max, waterfallValues } =
      buildNormalizedWaterfallRanges(numericValues, resolvedIndexes);

    const backgroundColors = assignBackgroundColors(waterfallValues);

    return {
      datasets: [
        {
          data: normalizedRanges,
          backgroundColor: backgroundColors,
          barThickness: barSize[size],
          maxBarThickness: barSize.large * 2,
          datalabels: {
            display: !!formattedData,
            color: '#141414',
            font: { size: 12, family: "'Work Sans', sans-serif" },
            formatter: (value: any, context) => {
              return (
                formattedData[context.datasetIndex]?.[context.dataIndex] || ''
              );
            },
            anchor: 'end' as const,
            align: 'top' as const,
          },
        },
      ],
      min,
      max,
    };
  }, [values, resolvedIndexes, assignBackgroundColors, size, formattedData]);

  const scalesConfig = useMemo((): ChartOptions<'bar'>['scales'] => {
    const { min, max } = processedData;
    const minAdjusted = min < 0 ? min + min * 0.1 : min;

    const baseAxisConfig = {
      border: { display: true },
      ticks: {
        display: true,
        font: FONT_CONFIG,
        color: CHART_COLOR,
        autoSkip: false,
        maxRotation: 45,
        minRotation: 0,
      },
    };

    if (indexAxis === 'y') {
      return {
        x: {
          ...baseAxisConfig,
          min: minAdjusted,
          max,
          suggestedMin: minAdjusted,
          suggestedMax: max,
        },
        y: {
          ...baseAxisConfig,
          afterFit: (axis) => {
            axis.width = FIT_Y_AXIS;
          },
        },
      };
    }

    return {
      x: {},
      y: {
        ...baseAxisConfig,
        min: minAdjusted,
        max,
        suggestedMin: minAdjusted,
        suggestedMax: max,
      },
    };
  }, [indexAxis, processedData]);

  const chartOptions = useMemo(
    (): ChartOptions<'bar'> => ({
      animation: { duration: 300 },
      scales: scalesConfig,
      layout: {
        padding:
          indexAxis === 'y'
            ? { left: 0, top: 0, bottom: 0, right: 20 }
            : { left: 16, top: 35, bottom: 2, right: 16 },
      },

      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        datalabels: { display: false },
        connectBars: {
          display: true,
          color: '#141414',
          indexes: resolvedIndexes,
        },
        waterfallCutBars: {
          display: true,
          color: '#141414',
          indexes: resolvedIndexes,
          direction: 'diagonal',
          originalValues: values,
        },
        waterfallDatalabel: {
          display: !formattedData,
          indexes: resolvedIndexes,
          datalabels: values.map(String),
          font: "normal 12px 'Work Sans', sans-serif",
          textAlign: 'center',
          textBaseline: 'bottom',
          color: {
            inside: '#ffffff',
            outside: '#141414',
            retained: '#141414',
          },
        },
        verticalGuidelines: {
          display: false,
        },
      },
    }),
    [scalesConfig, indexAxis, resolvedIndexes, values, formattedData],
  );
  const mergedOptions = merge({}, chartOptions, customOptions);
  const mergedPlugins = [
    ConnectBars,
    WaterfallCutBars,
    WaterfallDatalabel,
    ...(rest.plugins || []),
  ];

  return (
    <BaseChart
      key={`waterfall-${labels.length}`}
      type="bar"
      datasets={processedData.datasets}
      options={mergedOptions}
      labels={labels}
      plugins={mergedPlugins}
      indexAxis={indexAxis}
      axisType={axisType}
      showGrid={false}
      showLabels={showLabels}
      interactiveConfig={interactiveConfig}
      dataTestId={dataTestId}
      drawZeroLine={
        drawZeroLine || (indexAxis === 'x' && processedData.min < 0)
      }
    />
  );
};

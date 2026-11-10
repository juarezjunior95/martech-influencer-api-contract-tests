import { useCallback, useMemo } from 'react';

import { ChartOptions } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { BaseChart, InteractiveChartConfig } from 'components/Chart/BaseChart';
import { WaterfallDatalabel } from 'components/Chart/plugins/WaterfallDatalabel';
import { BarSize, BaseChartComponentProps } from 'components/Chart/types';
import { merge } from 'lodash';
import { parseNumber } from 'utils/format';

import { barSize } from '../constants';
import {
  CHART_COLOR,
  FIT_Y_AXIS,
  FONT_CONFIG,
  SCALE_LABEL_HEADROOM_RATIO,
  SPACING_PERCENTAGE,
} from './constants';
import { ConnectBars } from './plugins/ConnectBars';
import { WaterfallCutBars } from './plugins/WaterfallCutBars';
import { Colors, SpecialIndexes } from './types';
import {
  calculateMinMaxValues,
  createColorsWithDefaults,
  createResolvedSpecialIndexes,
} from './utils';

interface WaterfallProps extends Omit<
  BaseChartComponentProps,
  'datasets' | 'showGrid'
> {
  values: number[];
  specialIndexes?: SpecialIndexes;
  colors?: Colors;
  size?: BarSize;
  interactiveConfig?: InteractiveChartConfig;
  dataTestId?: string;
  decimalPlaces?: number;
}

export const Waterfall = ({
  values,
  specialIndexes,
  colors,
  size = 'medium',
  options: customOptions = {},
  formattedData,
  labels,
  indexAxis,
  axisType = 'none',
  interactiveConfig,
  showLabels = true,
  dataTestId,
  baseChartColors = [],
  decimalPlaces = 1,
  ...rest
}: WaterfallProps) => {
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
        if (value === 0) return colorsConfig.zero;

        return value > 0 ? colorsConfig.positive : colorsConfig.negative;
      });
    },
    [colorsConfig, resolvedIndexes],
  );

  const calculateSpacing = useCallback((min: number, max: number): number => {
    const rangeAbs = Math.abs(max - min);
    const range = Math.max(1, rangeAbs);
    return range * SPACING_PERCENTAGE;
  }, []);

  const processedData = useMemo(() => {
    const numericValues = values.map((value) => parseNumber(String(value)));

    const waterfallValues = [...numericValues];

    waterfallValues[resolvedIndexes.first] = 0;
    waterfallValues[resolvedIndexes.last] = 0;
    if (resolvedIndexes.retained !== undefined) {
      waterfallValues[resolvedIndexes.retained] = 0;
    }

    if (resolvedIndexes.variation !== undefined) {
      waterfallValues[resolvedIndexes.variation] *= -1;
    }

    const backgroundColors = assignBackgroundColors(waterfallValues);

    const waterfallOnlyValues = waterfallValues.slice(resolvedIndexes.first);
    const { min, max } = calculateMinMaxValues(waterfallOnlyValues);
    const spacing = calculateSpacing(min, max);
    const baseline = min - spacing;

    const normalizedRanges: [number, number][] = [];
    let currentValue = 0;

    waterfallValues.forEach((value, index) => {
      if (index < resolvedIndexes.first) {
        normalizedRanges.push([max - spacing * 2, baseline]);
      } else {
        const nextValue = currentValue + value;
        normalizedRanges.push([currentValue, nextValue]);
        currentValue = nextValue;
      }
    });

    if (normalizedRanges[resolvedIndexes.first]) {
      normalizedRanges[resolvedIndexes.first][0] = min - spacing;
    }

    if (normalizedRanges[resolvedIndexes.last]) {
      normalizedRanges[resolvedIndexes.last][1] = min - spacing;
    }

    if (
      resolvedIndexes.retained !== undefined &&
      normalizedRanges[resolvedIndexes.retained]
    ) {
      normalizedRanges[resolvedIndexes.retained][1] = min - spacing;
    }

    return {
      datasets: [
        {
          data: normalizedRanges,
          backgroundColor: backgroundColors,
          barThickness: barSize[size],
          maxBarThickness: barSize.large * 2,
          minBarLength: 3,
          datalabels: {
            display: !!formattedData,
            color: '#141414',
            font: { size: 12, family: "'Work Sans', sans-serif" },
            formatter: (_value: unknown, context: Context) => {
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
      spacing,
    };
  }, [
    values,
    resolvedIndexes,
    assignBackgroundColors,
    calculateSpacing,
    size,
    formattedData,
  ]);

  const scalesConfig = useMemo((): ChartOptions<'bar'>['scales'] => {
    const { min, max, spacing } = processedData;
    const scaleMin = min - spacing;
    const scaleSpan = Math.max(max - scaleMin, 1e-6);
    const scaleMax = max + scaleSpan * SCALE_LABEL_HEADROOM_RATIO;

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
          min: scaleMin,
          max: scaleMax,
          suggestedMin: scaleMin,
          suggestedMax: scaleMax,
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
        min: scaleMin,
        max: scaleMax,
        suggestedMin: scaleMin,
        suggestedMax: scaleMax,
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
            : { left: 16, top: 40, bottom: 0, right: 16 },
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
        },
        waterfallDatalabel: {
          display: !formattedData,
          indexes: resolvedIndexes,
          datalabels: values.map(String),
          decimalPlaces,
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
    [
      scalesConfig,
      indexAxis,
      resolvedIndexes,
      values,
      decimalPlaces,
      formattedData,
    ],
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
      baseChartColors={baseChartColors}
    />
  );
};

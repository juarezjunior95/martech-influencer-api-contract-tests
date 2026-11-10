import { useCallback, useMemo } from 'react';

import { ChartDataset } from 'chart.js';
import { BaseChart } from 'components';
import {
  createLinePointTooltipCleanupPlugin,
  createLinePointTooltipExternal,
  type LinePointTooltipOptions,
} from 'components/Chart/components/LinePointTooltip';
import { createHighlightAnnotations } from 'components/Chart/plugins';
import { BaseChartComponentProps } from 'components/Chart/types';
import { theme } from 'theme';

interface LineProps extends BaseChartComponentProps {
  labelColors?: string[];
  labelChipColors?: string[];
  dataTestId?: string;
  highlightedIndexes?: number[];
  labelChip?: boolean;
  tooltip?: boolean | LinePointTooltipOptions;
}

export const Line = ({
  datasets,
  formattedData,
  labelColors,
  labelChipColors,
  highlightedIndexes = [],
  options,
  labels,
  dataTestId,
  tooltip,
  labelChip = false,
  plugins: pluginsFromProps,
  ...rest
}: LineProps) => {
  const tooltipEnabled = Boolean(tooltip);
  const tooltipOptions: LinePointTooltipOptions =
    typeof tooltip === 'object' ? tooltip : {};

  const lineTooltipExternal = useMemo(
    () =>
      createLinePointTooltipExternal({
        formattedData,
        useFormattedData: tooltipOptions.useFormattedData ?? true,
        tooltipLabels: tooltipOptions.tooltipLabels,
      }),
    [
      formattedData,
      tooltipOptions.useFormattedData,
      tooltipOptions.tooltipLabels,
    ],
  );

  const mergedPlugins = useMemo(() => {
    const base = pluginsFromProps ?? [];
    if (!tooltipEnabled) {
      return base;
    }
    return [...base, createLinePointTooltipCleanupPlugin()];
  }, [pluginsFromProps, tooltipEnabled]);
  const getVisibleDatasets = useCallback((allDatasets) => {
    return allDatasets.filter((ds) => {
      if (ds.hidden !== undefined) {
        return !ds.hidden;
      }

      return true;
    });
  }, []);

  const getVisibleValues = useCallback(
    (allDatasets, dataIndex) => {
      return getVisibleDatasets(allDatasets)
        .map((ds) => Number(ds.data[dataIndex]))
        .filter((value) => !Number.isNaN(value));
    },
    [getVisibleDatasets],
  );

  const getAnchorOrAlign = useCallback(
    (
      context: { datasetIndex: number; dataIndex: number },
      allDatasets: { hidden?: boolean; data: unknown[] }[],
      formattedDataRef?: string[][],
    ) => {
      const currentDataset = allDatasets[context.datasetIndex];
      if (currentDataset.hidden === true) return 'center';

      const { dataIndex } = context;

      const datasetsWithLabelAtPosition = (formattedDataRef ?? []).filter(
        (row) => row[dataIndex] != null && String(row[dataIndex]).trim() !== '',
      );

      let visibleValues: number[];

      if (datasetsWithLabelAtPosition.length <= 1) {
        const maxDataLength = Math.max(
          ...allDatasets.map((ds) => (ds.data as number[]).length),
        );
        const currentLength = (currentDataset.data as number[]).length;
        const isPartialSeries = currentLength < maxDataLength;

        if (isPartialSeries) {
          visibleValues = (currentDataset.data as number[])
            .map(Number)
            .filter((v) => !Number.isNaN(v));
        } else {
          visibleValues = getVisibleValues(allDatasets, dataIndex);
        }
      } else {
        visibleValues = getVisibleValues(allDatasets, dataIndex);
      }

      const currentValue = Number(currentDataset.data[dataIndex]);
      if (visibleValues.length === 0) return 'center';

      const max = Math.max(...visibleValues);
      const min = Math.min(...visibleValues);
      if (currentValue === max) return 'end';
      if (currentValue === min) return 'start';
      return 'center';
    },
    [getVisibleValues],
  );

  const shouldShowLabel = useCallback(
    (context, allDatasets, formattedDataRef: string[][] | undefined) => {
      const currentDataset = allDatasets[context.datasetIndex];
      if (currentDataset.hidden === true) return false;

      const { dataIndex } = context;

      const datasetsWithLabelAtPosition = (formattedDataRef ?? []).filter(
        (row) => row[dataIndex] != null && String(row[dataIndex]).trim() !== '',
      );

      if (datasetsWithLabelAtPosition.length <= 1) return true;

      const visibleValues = getVisibleValues(allDatasets, dataIndex);
      const currentValue = Number(currentDataset.data[dataIndex]);

      if (visibleValues.length === 0) return false;

      const max = Math.max(...visibleValues);
      const min = Math.min(...visibleValues);

      return currentValue === max || currentValue === min;
    },
    [getVisibleValues],
  );

  const datasetsWithDefaults = useMemo(() => {
    const datalabelsConfig = {
      display:
        formattedData?.length > 0
          ? (context: { datasetIndex: number; dataIndex: number }) => {
              const label =
                formattedData?.[context.datasetIndex]?.[context.dataIndex] ??
                '';
              if (!String(label ?? '').trim()) return false;
              return shouldShowLabel(context, datasets, formattedData);
            }
          : false,
      color: theme.colors.txt.default,
      ...(labelChip
        ? {
            backgroundColor: theme.colors.charts.border.neutrals[30],
            borderRadius: 16,
            padding: { top: 0, right: 4, bottom: 0, left: 4 },
          }
        : {}),
      font: {
        size: labelChip ? 16 : 12,
        family: "'Work Sans', sans-serif",
        weight: 400,
      },
      formatter: (_, context: { datasetIndex: number; dataIndex: number }) => {
        const label =
          formattedData?.[context.datasetIndex]?.[context.dataIndex] ?? '';
        if (!label?.trim()) return null;
        if (!shouldShowLabel(context, datasets, formattedData)) return null;
        return label;
      },
      offset: 4,
      anchor: (context: { datasetIndex: number; dataIndex: number }) => {
        if (datasets.length < 2) return 'end';
        return getAnchorOrAlign(context, datasets, formattedData);
      },
      align: (context: { datasetIndex: number; dataIndex: number }) => {
        if (datasets.length < 2) return 'end';
        return getAnchorOrAlign(context, datasets, formattedData);
      },
    };

    return datasets.map((dataset, datasetIndex) => ({
      borderColor: '#D1A33C',
      borderWidth: 2,
      pointBorderColor: '#FFFFFF',
      pointHoverBorderColor: '#FFFFFF',
      pointBackgroundColor: dataset.borderColor ?? '#D1A33C',
      pointBorderWidth: 2,
      pointHoverBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 6,
      datalabels: {
        ...datalabelsConfig,
        color: labelColors
          ? labelColors[datasetIndex]
          : theme.colors.txt.default,
        ...(labelChip
          ? {
              backgroundColor:
                labelChipColors?.[datasetIndex] ??
                (dataset as ChartDataset<'line'>).pointBackgroundColor ??
                theme.colors.charts.border.neutrals[30],
            }
          : {}),
      },
      ...dataset,
    })) as ChartDataset<'line'>[];
  }, [
    datasets,
    formattedData,
    getAnchorOrAlign,
    shouldShowLabel,
    labelColors,
    labelChipColors,
    labelChip,
  ]);

  const mergedOptions = useMemo(() => {
    const annotations = createHighlightAnnotations(highlightedIndexes);

    const xAxisConfig = {
      ...options?.scales?.x,
      ticks: {
        ...options?.scales?.x?.ticks,
        font: (context: { index: number }) => {
          const isHighlighted = highlightedIndexes.includes(context.index);
          const baseFont =
            typeof options?.scales?.x?.ticks?.font === 'object'
              ? options.scales.x.ticks.font
              : {};

          return {
            ...baseFont,
            weight: isHighlighted ? 'bold' : 'normal',
          };
        },
      },
    };

    const tooltipPluginConfig = tooltipEnabled
      ? {
          enabled: false,
          external: lineTooltipExternal,
          mode: 'index' as const,
          intersect: true,
        }
      : undefined;

    return {
      ...options,
      ...(tooltipEnabled && {
        interaction: {
          ...options?.interaction,
          mode: 'index' as const,
          intersect: true,
        },
      }),
      scales: {
        ...options?.scales,
        x: xAxisConfig,
      },
      plugins: {
        ...options?.plugins,
        ...(tooltipPluginConfig && {
          tooltip: {
            ...options?.plugins?.tooltip,
            ...tooltipPluginConfig,
          },
        }),
        annotation: {
          clip: false,
          annotations,
        },
      },
    } as any;
  }, [options, highlightedIndexes, tooltipEnabled, lineTooltipExternal]);

  return (
    <BaseChart
      type="line"
      {...rest}
      labels={labels}
      datasets={datasetsWithDefaults}
      options={mergedOptions}
      plugins={mergedPlugins}
      dataTestId={dataTestId}
    />
  );
};

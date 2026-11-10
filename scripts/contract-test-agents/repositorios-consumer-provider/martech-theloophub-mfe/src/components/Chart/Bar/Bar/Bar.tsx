import { ChartDataset, ChartOptions, ScriptableScaleContext } from 'chart.js';
import { BaseChart } from 'components';
import { ConnectorPlugin, RoundedArrow } from 'components/Chart/plugins';

import { barSize } from '../constants';
import {
  DEFAULT_FONT,
  LABEL_COLORS,
  STRIPED_PATTERN_CONFIG,
  XSMALL_FONT,
} from './constants';
import { BarProps, DataLabelContext } from './types';
import {
  getBarBackgroundColor,
  getBarBorderRadius,
  getBarPadding,
  getBorderRadius,
  getDataLabelAnchor,
  getDataLabelColor,
  getFontConfig,
} from './utils';

export const Bar = ({
  datasets,
  size = 'medium',
  maxSize = 'large',
  stripedIndexes = [],
  formattedData = [],
  datalabelsPosition = 'external',
  alwaysShowDataLabels = false,
  indexAxis = 'x',
  connector,
  roundedArrow,
  labelColors,
  labelBackgroundColor,
  options: customOptions = {},
  fractionDigits,
  dataTestId,
  highlightLabels = [],
  ...rest
}: BarProps) => {
  const chartOptions = {
    layout: {
      padding: { top: indexAxis === 'x' ? 80 : 0 },
    },
    ...customOptions,
    plugins: {
      ...customOptions?.plugins,
      ...(connector !== undefined && { connector }),
      ...(roundedArrow !== undefined && { roundedArrow }),
    },
    scales: {
      x: {
        ticks: {
          font: (context: ScriptableScaleContext) =>
            getFontConfig(context, size, highlightLabels),
        },
      },
      ...customOptions?.scales,
    },
  } as ChartOptions;

  const buildDataLabelConfig = () => ({
    display: formattedData.length > 0 && (alwaysShowDataLabels ? true : 'auto'),
    color: (context: DataLabelContext) =>
      getDataLabelColor(
        context,
        datalabelsPosition,
        labelColors || LABEL_COLORS,
      ),
    backgroundColor: getBarBackgroundColor(labelBackgroundColor),
    borderRadius: getBarBorderRadius(labelBackgroundColor),
    padding: getBarPadding(labelBackgroundColor),
    font: size === 'xsmall' ? XSMALL_FONT : DEFAULT_FONT,
    formatter: (_value: unknown, context: DataLabelContext) => {
      return formattedData[context.datasetIndex]?.[context.dataIndex] || '';
    },
    anchor: (context: DataLabelContext) =>
      getDataLabelAnchor(context, datalabelsPosition),
    align: (context: DataLabelContext) =>
      getDataLabelAnchor(context, datalabelsPosition),
  });

  const datasetsWithDefaults = datasets.map((dataset) => ({
    backgroundColor: '#EDCD20',
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: (context: DataLabelContext) => {
      const value = context.dataset.data[context.dataIndex] as number;
      return getBorderRadius(value, indexAxis);
    },
    barThickness: barSize[size],
    maxBarThickness: maxSize === 'none' ? barSize[size] : barSize[maxSize] * 2,
    pattern: {
      ...STRIPED_PATTERN_CONFIG,
      flags: stripedIndexes,
    },
    datalabels: buildDataLabelConfig(),
    ...dataset,
  })) as ChartDataset<'bar'>[];

  return (
    <BaseChart
      type="bar"
      datasets={datasetsWithDefaults}
      options={chartOptions}
      plugins={[ConnectorPlugin, RoundedArrow]}
      indexAxis={indexAxis}
      fractionDigits={fractionDigits}
      highlightLabels={highlightLabels}
      dataTestId={dataTestId}
      {...rest}
    />
  );
};

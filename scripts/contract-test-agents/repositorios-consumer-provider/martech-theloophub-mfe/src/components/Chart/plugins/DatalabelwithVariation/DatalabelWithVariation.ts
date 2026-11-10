import {
  CategoryScale,
  ChartData,
  ChartDataset,
  ChartOptions,
  LinearScale,
} from 'chart.js';
import { BarElement } from 'chart.js/dist';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { formatNumberWithSuffix } from 'utils/format';

import { AxisData, DatalabelWithVariationProps, LabelData } from './types';

type ChartContext = CanvasRenderingContext2D;

type DatasetWithVariation = ChartDataset<'bar'> & {
  variationData?: Array<{ variation: string; direction: 'up' | 'down' }>;
  formattedData?: string[];
};

interface TextMeasurement {
  width: number;
  height: number;
}

interface PositionCoordinates {
  finalX: number;
  finalXtoSeparator: number;
  finalXtoVariation: number;
  separatorWidth: number;
  isTextOverflowing: boolean;
}

interface AxisCoordinates {
  value: number;
  variation: number;
}

interface AxisCoordinatesWithSeparator extends AxisCoordinates {
  separator: number;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const SPACING = {
  Y_AXIS_OFFSET: 6,
  X_AXIS_TOP_OFFSET: 4,
  X_AXIS_BOTTOM_OFFSET: 20,
  TEXT_PADDING: 10,
  VARIATION_SPACING: 10,
  SEPARATOR_MARGIN: 3,
  SEPARATOR_HEIGHT_OFFSET: 4,
  VARIATION_HEIGHT_OFFSET: 14,
  NEGATIVE_VALUE_MARGIN: 8,
  TEXT_VERTICAL_ADJUSTMENT: 2,
  FALLBACK_X_POSITION: 100,
} as const;

const COLOR = {
  DEFAULT: '#000',
  RGB_MAX: 255,
  HEX_RADIX: 16,
} as const;

const LUMINANCE = {
  THRESHOLD: 0.4,
  WEIGHTS: { RED: 0.2126, GREEN: 0.7152, BLUE: 0.0722 },
  GAMMA_THRESHOLD: 0.03928,
  GAMMA_DIVISOR: 12.92,
  GAMMA_OFFSET: 0.055,
  GAMMA_POWER: 2.4,
  GAMMA_DENOMINATOR: 1.055,
} as const;

const NUMBER_FORMAT = {
  LOCALE: 'en',
  MIN_FRACTION_DIGITS: 1,
  MAX_FRACTION_DIGITS: 1,
} as const;

export const DatalabelWithVariation = {
  id: 'datalabelWithVariation',
  afterDraw(chart) {
    const {
      ctx,
      config: { options },
      data: { datasets, labels },
      scales: { x, y },
    }: {
      ctx: ChartContext;
      config: { options: ChartOptions<'bar'> };
      data: ChartData<'bar'>;
      scales: {
        x: CategoryScale;
        y: LinearScale;
      };
    } = chart;

    const configOptions: _DeepPartialObject<DatalabelWithVariationProps> =
      options.plugins.datalabelWithVariation;
    const indexAxis = options.indexAxis;

    datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      if (meta.type !== 'bar') {
        return;
      }

      meta.data.forEach((barElement: BarElement, index: number) => {
        const shouldDisplayLabel = configOptions?.label?.display ?? true;
        const unitOfMeasure = configOptions.label.unitOfMeasure;
        const labelData = prepareLabelData(
          dataset,
          index,
          labels[index] as string,
          shouldDisplayLabel,
          unitOfMeasure,
        );

        const axisData: AxisData = {
          x,
          y,
          bar: barElement,
          value: dataset.data[index] as number,
          labelData,
          configOptions,
          measuredText: measureText(ctx, labelData.value),
        };

        if (indexAxis === 'y') {
          drawYAxisLabels(ctx, axisData);
        } else if (indexAxis === 'x') {
          drawXAxisLabels(ctx, axisData);
        }
      });
    });
  },
};

export function prepareLabelData(
  dataset: DatasetWithVariation,
  index: number,
  label: string,
  shouldDisplayLabel: boolean,
  unitOfMeasure?: string,
): LabelData {
  const value = dataset.formattedData
    ? dataset.formattedData[index]
    : formatNumberWithSuffix(dataset.data[index] as number).value +
      (unitOfMeasure || '');

  const variationData = dataset.variationData?.[index];
  const variation = variationData?.variation || '';
  const variationDirection = variationData?.direction;

  return {
    value: shouldDisplayLabel ? value : '',
    variation,
    variationDirection,
    label: shouldDisplayLabel ? label : '',
  };
}

export function configureLabelStyle(
  ctx: ChartContext,
  configOptions: AxisData['configOptions'],
  bar: AxisData['bar'],
  isOutsideBar: boolean,
): void {
  const labelConfig = configOptions.label;
  ctx.font = labelConfig.font;
  ctx.textBaseline = labelConfig.textBaseline;

  const backgroundColor = bar?.options?.backgroundColor as string;
  const needsWhiteText =
    backgroundColor && getContrastingColor(backgroundColor) === 'white';

  const insideColor = needsWhiteText
    ? labelConfig.color.white
    : labelConfig.color.inside;

  ctx.fillStyle = isOutsideBar ? labelConfig.color.outside : insideColor;
}

export function setVariationStyle(
  ctx: ChartContext,
  configOptions: AxisData['configOptions'],
  labelData: LabelData,
): void {
  const { variation } = configOptions;
  ctx.font = variation.font;
  ctx.textBaseline = variation.textBaseline;
  ctx.fillStyle =
    variation.color[labelData.variationDirection] || COLOR.DEFAULT;
}

export function drawYAxisLabels(
  ctx: ChartContext,
  { x, bar, value, labelData, configOptions, measuredText }: AxisData,
): void {
  const yCoordinate = bar.y + SPACING.Y_AXIS_OFFSET;
  const xCoordinate = x.getPixelForValue(value / 2);
  const separator = configOptions?.separator.yAxis || '';

  const positions =
    value >= 0
      ? calculateYAxisPositions(
          bar,
          ctx,
          value,
          x,
          measuredText,
          separator,
          configOptions.label.position,
        )
      : calculateYAxisPositionsForNegativeValues(
          bar,
          ctx,
          measuredText,
          separator,
          configOptions.label.position,
        );

  if (positions.isTextOverflowing) {
    renderOverflowingLabel(
      ctx,
      { value: yCoordinate, separator: yCoordinate, variation: yCoordinate },
      separator,
      labelData,
      positions,
      configOptions,
      bar,
    );
  } else {
    renderStandardLabel(
      ctx,
      { value: yCoordinate, variation: yCoordinate },
      labelData,
      {
        finalX: xCoordinate - measuredText.width / 2,
        finalXtoVariation: positions.finalX - SPACING.VARIATION_SPACING,
      },
      configOptions,
      bar,
    );
  }
}

export function drawXAxisLabels(
  ctx: ChartContext,
  { y, bar, value, labelData, configOptions, measuredText }: AxisData,
): void {
  const yCoordinate = y.getPixelForValue(value / 2);
  const yBase =
    value >= 0
      ? bar.y - SPACING.X_AXIS_TOP_OFFSET
      : bar.y + SPACING.X_AXIS_BOTTOM_OFFSET;

  const separator = configOptions?.separator.xAxis || '';
  const positions = calculateXAxisPositions(
    bar,
    ctx,
    labelData,
    measuredText,
    separator,
    configOptions.label.position,
  );

  const isNegativeValue = +labelData.value < 0;

  if (isNegativeValue) {
    const yPositions: AxisCoordinatesWithSeparator = {
      value: yBase - SPACING.X_AXIS_TOP_OFFSET,
      separator:
        yBase -
        SPACING.X_AXIS_TOP_OFFSET -
        measuredText.height -
        SPACING.SEPARATOR_HEIGHT_OFFSET,
      variation:
        yBase -
        SPACING.X_AXIS_TOP_OFFSET -
        measuredText.height -
        SPACING.SEPARATOR_HEIGHT_OFFSET -
        SPACING.VARIATION_HEIGHT_OFFSET,
    };

    if (positions.isTextOverflowing) {
      renderNegativeOverflowingLabel(
        ctx,
        yPositions,
        separator,
        labelData,
        positions,
        configOptions,
        bar,
      );
    } else {
      renderNegativeLabel(
        ctx,
        {
          value:
            yCoordinate +
            measuredText.height / 2 +
            SPACING.TEXT_VERTICAL_ADJUSTMENT,
          variation:
            yBase +
            bar.height +
            measuredText.height +
            SPACING.NEGATIVE_VALUE_MARGIN,
        },
        labelData,
        positions,
        configOptions,
        bar,
      );
    }
    return;
  }

  if (positions.isTextOverflowing) {
    renderOverflowingLabel(
      ctx,
      {
        value: yBase - SPACING.X_AXIS_TOP_OFFSET,
        separator:
          yBase -
          SPACING.X_AXIS_TOP_OFFSET -
          measuredText.height -
          SPACING.SEPARATOR_HEIGHT_OFFSET,
        variation:
          yBase -
          SPACING.X_AXIS_TOP_OFFSET -
          measuredText.height -
          SPACING.SEPARATOR_HEIGHT_OFFSET -
          SPACING.VARIATION_HEIGHT_OFFSET,
      },
      separator,
      labelData,
      positions,
      configOptions,
      bar,
    );
    return;
  }

  renderStandardLabel(
    ctx,
    {
      value:
        yCoordinate +
        measuredText.height / 2 +
        SPACING.TEXT_VERTICAL_ADJUSTMENT,
      variation: yBase - SPACING.X_AXIS_TOP_OFFSET,
    },
    labelData,
    positions,
    configOptions,
    bar,
  );
}

function calculateFinalXPosition(
  bar: AxisData['bar'],
  x: AxisData['x'],
  value: number,
  measuredText: TextMeasurement,
): number {
  if (value > 0) {
    return bar.x + measuredText.width;
  }

  if (value === 0) {
    return SPACING.FALLBACK_X_POSITION;
  }

  return x.getPixelForValue(0) - measuredText.width;
}

export function calculateYAxisPositions(
  bar: AxisData['bar'],
  ctx: ChartContext,
  value: number,
  x: AxisData['x'],
  measuredText: TextMeasurement,
  separator: string,
  datalabelPosition: 'inside' | 'top',
): PositionCoordinates {
  const separatorWidth = measureText(ctx, separator)?.width;
  const isTextOverflowing =
    datalabelPosition === 'top' ||
    measuredText.width + SPACING.TEXT_PADDING > bar.width ||
    value === 0;

  const finalX = calculateFinalXPosition(bar, x, value, measuredText);
  const finalXtoSeparator =
    finalX + measuredText.width + measuredText.height / 2;
  const finalXtoVariation =
    finalXtoSeparator + separatorWidth + measuredText.height / 2;

  return {
    separatorWidth,
    finalX,
    isTextOverflowing,
    finalXtoSeparator,
    finalXtoVariation,
  };
}

export function calculateYAxisPositionsForNegativeValues(
  bar: AxisData['bar'],
  ctx: ChartContext,
  measuredText: TextMeasurement,
  separator: string,
  datalabelPosition: 'inside' | 'top',
): PositionCoordinates {
  const separatorWidth = measureText(ctx, separator)?.width;
  const isTextOverflowing =
    datalabelPosition === 'top' ||
    measuredText.width + SPACING.TEXT_PADDING > bar.width;

  const finalX = bar.x - measuredText.width - SPACING.TEXT_PADDING;
  const finalXtoSeparator =
    finalX - (SPACING.SEPARATOR_MARGIN + measuredText.height / 2);
  const finalXtoVariation =
    finalXtoSeparator -
    (separatorWidth +
      SPACING.SEPARATOR_MARGIN +
      measuredText.width +
      measuredText.height);

  return {
    separatorWidth,
    finalX,
    isTextOverflowing,
    finalXtoSeparator,
    finalXtoVariation,
  };
}

export function calculateXAxisPositions(
  bar: AxisData['bar'],
  ctx: ChartContext,
  labelData: LabelData,
  measuredText: TextMeasurement,
  separator: string,
  datalabelPosition: 'inside' | 'top',
): PositionCoordinates & { variationWidth: number } {
  const separatorWidth = measureText(ctx, separator)?.width;
  const variationWidth = measureText(ctx, labelData.variation)?.width;
  const isTextOverflowing =
    datalabelPosition === 'top' ||
    measuredText.height + SPACING.TEXT_PADDING > bar.height;

  const xAxis = bar.x;

  return {
    finalX: xAxis - measuredText.width / 2,
    finalXtoSeparator: xAxis - separatorWidth / 2,
    finalXtoVariation: xAxis - variationWidth / 2,
    separatorWidth,
    variationWidth,
    isTextOverflowing,
  };
}

export function renderStandardLabel(
  ctx: ChartContext,
  yAxis: AxisCoordinates,
  labelData: LabelData,
  positions: Pick<PositionCoordinates, 'finalX' | 'finalXtoVariation'>,
  configOptions: AxisData['configOptions'],
  bar: AxisData['bar'],
): void {
  configureLabelStyle(ctx, configOptions, bar, false);
  ctx.fillText(labelData.value, positions.finalX, yAxis.value);
  if (labelData.variation) {
    setVariationStyle(ctx, configOptions, labelData);
    ctx.fillText(
      labelData.variation,
      positions.finalXtoVariation,
      yAxis.variation,
    );
  }
}

export function renderOverflowingLabel(
  ctx: ChartContext,
  yAxis: AxisCoordinatesWithSeparator,
  separator: string,
  labelData: LabelData,
  positions: PositionCoordinates,
  configOptions: AxisData['configOptions'],
  bar: AxisData['bar'],
): void {
  configureLabelStyle(ctx, configOptions, bar, true);
  ctx.fillText(labelData.value, positions.finalX, yAxis.value);

  if (labelData.variation) {
    ctx.fillText(separator, positions.finalXtoSeparator, yAxis.separator);
    setVariationStyle(ctx, configOptions, labelData);
    ctx.fillText(
      labelData.variation,
      positions.finalXtoVariation,
      yAxis.variation,
    );
  }
}

export function renderNegativeLabel(
  ctx: ChartContext,
  yBase: AxisCoordinates,
  labelData: LabelData,
  positions: PositionCoordinates,
  configOptions: AxisData['configOptions'],
  bar: AxisData['bar'],
): void {
  configureLabelStyle(ctx, configOptions, bar, false);
  ctx.fillText(labelData.value, positions.finalX, yBase.value);

  if (labelData.variation) {
    setVariationStyle(ctx, configOptions, labelData);
    ctx.fillText(
      labelData.variation,
      positions.finalXtoVariation,
      yBase.variation,
    );
  }
}

export function renderNegativeOverflowingLabel(
  ctx: ChartContext,
  yBase: AxisCoordinatesWithSeparator,
  separator: string,
  labelData: LabelData,
  positions: PositionCoordinates,
  configOptions: AxisData['configOptions'],
  bar: AxisData['bar'],
): void {
  configureLabelStyle(ctx, configOptions, bar, true);
  ctx.fillText(labelData.value, positions.finalX, yBase.value);

  if (labelData.variation) {
    ctx.fillText(separator, positions.finalXtoSeparator, yBase.separator);
    setVariationStyle(ctx, configOptions, labelData);
    ctx.fillText(
      labelData.variation,
      positions.finalXtoVariation,
      yBase.variation,
    );
  }
}

export function formatNumber(
  number: number,
  minimumFractionDigits: number = NUMBER_FORMAT.MIN_FRACTION_DIGITS,
): string {
  return new Intl.NumberFormat(NUMBER_FORMAT.LOCALE, {
    minimumFractionDigits,
    maximumFractionDigits: NUMBER_FORMAT.MAX_FRACTION_DIGITS,
  }).format(number);
}

export function measureText(
  ctx: CanvasRenderingContext2D,
  text: string,
): TextMeasurement {
  const measure = ctx.measureText(text);
  return {
    width: measure.width,
    height: measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent,
  };
}

export function hexToRgb(hex: string): RgbColor {
  if (typeof hex !== 'string') {
    return { r: 0, g: 0, b: 0 };
  }

  const r = Number.parseInt(hex.substring(1, 3), COLOR.HEX_RADIX);
  const g = Number.parseInt(hex.substring(3, 5), COLOR.HEX_RADIX);
  const b = Number.parseInt(hex.substring(5, 7), COLOR.HEX_RADIX);

  return { r, g, b };
}

export function luminance(rgb: RgbColor): number {
  const normalizedChannels = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const normalized = channel / COLOR.RGB_MAX;
    return normalized <= LUMINANCE.GAMMA_THRESHOLD
      ? normalized / LUMINANCE.GAMMA_DIVISOR
      : Math.pow(
          (normalized + LUMINANCE.GAMMA_OFFSET) / LUMINANCE.GAMMA_DENOMINATOR,
          LUMINANCE.GAMMA_POWER,
        );
  });

  return (
    LUMINANCE.WEIGHTS.RED * normalizedChannels[0] +
    LUMINANCE.WEIGHTS.GREEN * normalizedChannels[1] +
    LUMINANCE.WEIGHTS.BLUE * normalizedChannels[2]
  );
}

export function getContrastingColor(hex: string): 'white' | 'black' {
  const rgb = hexToRgb(hex);
  const lum = luminance(rgb);

  return lum < LUMINANCE.THRESHOLD ? 'white' : 'black';
}

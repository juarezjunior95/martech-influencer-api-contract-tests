import { theme } from 'theme';
import { formatNumberWithSuffix } from 'utils/format';

interface ChartScale {
  getPixelForValue(value: number): number;
}

interface ChartLike {
  scales?: Record<string, ChartScale | undefined>;
}

interface ProximateValue {
  pixelDifference: number;
  datasetType: string;
  value: number;
}

interface PositionConfig {
  align: string;
  anchor: string;
  offset: number;
}

interface Dataset {
  type: string;
  data: number[];
  formattedData?: string[];
}

interface ValueProximity {
  pixelDifference: number;
  value: number;
}

const PIXEL_THRESHOLD = 100;

function getPixelDifference(
  chart: ChartLike,
  value1: number,
  value2: number,
  scaleId = 'y',
): number {
  const scale = chart?.scales?.[scaleId];
  if (!scale) return 0;

  return Math.abs(
    scale.getPixelForValue(value1) - scale.getPixelForValue(value2),
  );
}

function getValueProximity(
  chart: ChartLike,
  baseValue: number,
  targetValue: number | undefined,
  pixelThreshold = PIXEL_THRESHOLD,
  scaleId = 'y',
): ValueProximity | null {
  if (targetValue === undefined || targetValue === null) {
    return null;
  }

  const pixelDifference = getPixelDifference(
    chart,
    baseValue,
    targetValue,
    scaleId,
  );
  if (pixelDifference >= pixelThreshold) {
    return null;
  }

  return {
    pixelDifference,
    value: targetValue,
  };
}

export function findProximateValuesAtPoint(
  chart: ChartLike,
  datasets: Dataset[],
  currentDatasetIndex: number,
  dataIndex: number,
  currentValue: number,
): ProximateValue[] {
  return datasets.reduce<ProximateValue[]>((acc, dataset, index) => {
    if (index === currentDatasetIndex) {
      return acc;
    }

    const value = dataset.data[dataIndex];
    const proximity = getValueProximity(chart, currentValue, value);

    if (proximity) {
      acc.push({ ...proximity, datasetType: dataset.type });
    }

    return acc;
  }, []);
}

function getClosestProximateValue(values: ProximateValue[]): ProximateValue {
  return values.reduce(
    (closest, current) =>
      current.pixelDifference < closest.pixelDifference ? current : closest,
    values[0],
  );
}

export function getPositionByValueComparison(
  currentValue: number,
  proximateValues: ProximateValue[],
  datasetIndex: number,
): PositionConfig {
  if (proximateValues.length === 0) {
    return { align: 'top', anchor: 'end', offset: 4 };
  }
  const closestValue = getClosestProximateValue(proximateValues);
  const hasBar = proximateValues.some((pv) => pv.datasetType === 'bar');
  const isEqual = closestValue.value === currentValue;
  const isGreater = currentValue > closestValue.value;

  const isMaxCase =
    (isGreater && !isEqual) ||
    (closestValue.pixelDifference < 50 && hasBar && currentValue > 0) ||
    (closestValue.pixelDifference === 0 && datasetIndex === 0);

  return isMaxCase
    ? { align: 'end', anchor: 'end', offset: 4 }
    : { align: 'start', anchor: 'start', offset: 4 };
}

function getPositionContext(
  context: any,
  allDatasets: Dataset[],
  datasetIndex: number,
): PositionConfig {
  const chart = context.chart as ChartLike;
  const currentValue = Number(context.dataset.data[context.dataIndex] || 0);

  const proximateValues = findProximateValuesAtPoint(
    chart,
    allDatasets,
    datasetIndex,
    context.dataIndex,
    currentValue,
  );

  return getPositionByValueComparison(
    currentValue,
    proximateValues,
    datasetIndex,
  );
}

export function getDatalabelsConfig(dataset, allDatasets, datasetIndex = 0) {
  const baseFont = {
    family: "'Work Sans', sans-serif",
    size: 12,
    weight: 'normal',
    lineHeight: 0.5,
  };

  const commonConfig = {
    display: true,
    color: theme.colors.txt.default,
    font: baseFont,
    formatter: (value: number, context: any) =>
      dataset.formattedData?.[context.dataIndex] ??
      formatNumberWithSuffix(value).value,
  };

  if (dataset.type === 'bar') {
    return {
      ...commonConfig,
      align: 'center',
      anchor: 'center',
      offset: 4,
    };
  }

  const positionCache = new WeakMap<any, PositionConfig>();
  const resolvePosition = (context: any): PositionConfig => {
    if (positionCache.has(context)) {
      return positionCache.get(context);
    }

    const position = getPositionContext(context, allDatasets, datasetIndex);
    positionCache.set(context, position);
    return position;
  };

  return {
    ...commonConfig,
    align: (context: any) => resolvePosition(context).align,
    anchor: (context: any) => resolvePosition(context).anchor,
    offset: (context: any) => resolvePosition(context).offset,
  };
}

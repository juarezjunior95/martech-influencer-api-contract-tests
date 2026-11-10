import { SMALL_BAR_THRESHOLD } from '../constants';
import { DataLabelContext } from '../types';

export const getBarPixelSize = (context: DataLabelContext): number => {
  const value = context.dataset.data[context.dataIndex] as number;
  return Math.abs(
    context.chart.scales.y.getPixelForValue(0) -
      context.chart.scales.y.getPixelForValue(value),
  );
};

export const isSmallBar = (context: DataLabelContext): boolean => {
  return getBarPixelSize(context) < SMALL_BAR_THRESHOLD;
};

export const getValue = (context: DataLabelContext): number => {
  return context.dataset.data[context.dataIndex] as number;
};

export const getDataLabelAnchor = (
  context: DataLabelContext,
  datalabelsPosition: 'external' | 'internal',
): 'start' | 'center' | 'end' => {
  const value = getValue(context);
  const isExternal = datalabelsPosition === 'external';
  const isSmall = isSmallBar(context);

  if (isExternal || isSmall) {
    return value >= 0 ? 'end' : 'start';
  }

  return 'center';
};

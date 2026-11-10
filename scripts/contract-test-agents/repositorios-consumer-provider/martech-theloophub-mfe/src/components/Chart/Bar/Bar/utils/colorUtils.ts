import { DataLabelContext, LabelBackgroundColor, LabelColors } from '../types';
import { isSmallBar } from './commonUtils';

export const getBarBackgroundColor = (
  labelBackgroundColor: LabelBackgroundColor,
) => {
  if (labelBackgroundColor) {
    return typeof labelBackgroundColor === 'function'
      ? (context: DataLabelContext) =>
          labelBackgroundColor(context) ?? undefined
      : labelBackgroundColor;
  }

  return undefined;
};

export const getDataLabelColor = (
  context: DataLabelContext,
  datalabelsPosition: 'external' | 'internal',
  colors: LabelColors,
): string => {
  if (datalabelsPosition === 'external') {
    return colors.external;
  }

  return isSmallBar(context) ? colors.external : colors.internal;
};

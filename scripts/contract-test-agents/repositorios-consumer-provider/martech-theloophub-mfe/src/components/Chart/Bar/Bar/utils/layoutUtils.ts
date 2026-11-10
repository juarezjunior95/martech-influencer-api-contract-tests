import { ScriptableScaleContext } from 'chart.js';
import { BarSize } from 'components/Chart/types';

import { BORDER_RADIUS } from '../constants';
import { DataLabelContext, LabelBackgroundColor } from '../types';

export const getBorderRadius = (value: number, indexAxis: 'x' | 'y') => {
  const isPositive = value >= 0;

  if (indexAxis === 'x') {
    return isPositive
      ? {
          topLeft: BORDER_RADIUS,
          topRight: BORDER_RADIUS,
          bottomLeft: 0,
          bottomRight: 0,
        }
      : {
          topLeft: 0,
          topRight: 0,
          bottomLeft: BORDER_RADIUS,
          bottomRight: BORDER_RADIUS,
        };
  }

  return isPositive
    ? {
        topRight: BORDER_RADIUS,
        bottomRight: BORDER_RADIUS,
        topLeft: 0,
        bottomLeft: 0,
      }
    : {
        topRight: 0,
        bottomRight: 0,
        topLeft: BORDER_RADIUS,
        bottomLeft: BORDER_RADIUS,
      };
};

export const getBarBorderRadius = (
  labelBackgroundColor: LabelBackgroundColor,
) => {
  if (labelBackgroundColor) {
    if (typeof labelBackgroundColor === 'function') {
      return (context: DataLabelContext) =>
        labelBackgroundColor(context) ? 4 : undefined;
    }

    return 4;
  }

  return undefined;
};

export const getBarPadding = (labelBackgroundColor: LabelBackgroundColor) => {
  if (labelBackgroundColor) {
    const defaultPadding = { top: 2, bottom: 2, left: 4, right: 4 };

    if (typeof labelBackgroundColor === 'function') {
      return (context: DataLabelContext) =>
        labelBackgroundColor(context) ? defaultPadding : undefined;
    }

    return defaultPadding;
  }

  return undefined;
};

export const getFontConfig = (
  context: ScriptableScaleContext,
  size: BarSize,
  highlightLabels: string[],
) => {
  return {
    size: size === 'xsmall' ? 10 : 12,
    family: "'Work Sans', sans-serif",
    style: 'normal',
    weight: highlightLabels.includes(String(context.tick?.label))
      ? 'bold'
      : 'normal',
  };
};

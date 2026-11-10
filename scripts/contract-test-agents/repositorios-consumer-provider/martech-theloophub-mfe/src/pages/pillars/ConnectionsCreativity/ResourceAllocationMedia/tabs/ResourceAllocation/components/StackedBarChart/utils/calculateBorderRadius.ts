import { BorderRadius } from 'chart.js';

import { DEFAULT_BORDER_RADIUS } from '../constants';

export const calculateBorderRadius = (
  borderRadius: BorderRadius[][] | BorderRadius[] | BorderRadius,
  index: number,
): BorderRadius => {
  if (Array.isArray(borderRadius)) {
    return (borderRadius[index] || DEFAULT_BORDER_RADIUS) as BorderRadius;
  }
  return borderRadius;
};

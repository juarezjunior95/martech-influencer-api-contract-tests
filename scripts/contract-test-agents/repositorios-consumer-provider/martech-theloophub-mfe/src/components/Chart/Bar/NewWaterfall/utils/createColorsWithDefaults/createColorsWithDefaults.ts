import { DEFAULT_COLORS } from '../../constants';
import { Colors } from '../../types';

export const createColorsWithDefaults = (colors?: Partial<Colors>): Colors => ({
  ...DEFAULT_COLORS,
  ...colors,
});

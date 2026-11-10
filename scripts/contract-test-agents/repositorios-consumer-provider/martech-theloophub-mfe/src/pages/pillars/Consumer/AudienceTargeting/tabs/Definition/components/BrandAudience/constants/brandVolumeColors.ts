import { parsePercentage } from 'utils/format';

import { colors } from '../../../../../../../../../theme/colors';

export const BRAND_VOLUME_COLORS = {
  CORE_ALIGNED: colors.specificProperty.successText,
  CORE_OFF_TARGET: colors.specificProperty.errorText,
  HALO_NEUTRAL: colors.txt.default,
} as const;

export const BRAND_VOLUME_THRESHOLD = 50;

export const getBrandVolumeColor = (value: string, isCore: boolean): string => {
  if (!isCore) return BRAND_VOLUME_COLORS.HALO_NEUTRAL;

  const numericValue = parsePercentage(value);
  if (Number.isNaN(numericValue)) return BRAND_VOLUME_COLORS.HALO_NEUTRAL;

  return numericValue >= BRAND_VOLUME_THRESHOLD
    ? BRAND_VOLUME_COLORS.CORE_ALIGNED
    : BRAND_VOLUME_COLORS.CORE_OFF_TARGET;
};

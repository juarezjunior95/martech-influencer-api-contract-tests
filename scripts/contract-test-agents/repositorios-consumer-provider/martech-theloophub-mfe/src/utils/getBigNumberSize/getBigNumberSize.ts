import type { BigNumberSize } from 'components/BigNumber/types';

export const getBigNumberSize = (
  isDesktopXLarge: boolean,
  isDesktopLarge: boolean,
  isExportPage = false,
): BigNumberSize => {
  if (isExportPage) return 'small';
  if (isDesktopXLarge) return 'small';
  if (isDesktopLarge) return 'xsmall';
  return 'xxsmall';
};

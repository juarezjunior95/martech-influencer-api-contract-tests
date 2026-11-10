export { getBigNumberSize } from 'utils/getBigNumberSize';

export { getSustainableGrowthOverviewTitle } from './getSectionTitle';

export interface SkeletonProps {
  height: string;
  width: string;
  length: number;
  hasContainer: boolean;
}

interface SkeletonViewportVariants {
  forExport: SkeletonProps;
  forXLarge: SkeletonProps;
  forLarge: SkeletonProps;
  forDefault: SkeletonProps;
}

const pickSkeletonByViewport = (
  isDesktopXLarge: boolean,
  isDesktopLarge: boolean,
  isExportPage: boolean,
  variants: SkeletonViewportVariants,
): SkeletonProps => {
  if (isExportPage) return variants.forExport;
  if (isDesktopXLarge) return variants.forXLarge;
  if (isDesktopLarge) return variants.forLarge;
  return variants.forDefault;
};

export const getGrowthLeverCardSkeletonProps = (
  isDesktopXLarge: boolean,
  isDesktopLarge: boolean,
  isExportPage = false,
): SkeletonProps =>
  pickSkeletonByViewport(isDesktopXLarge, isDesktopLarge, isExportPage, {
    forExport: {
      height: '96px',
      width: '395px',
      length: 4,
      hasContainer: false,
    },
    forXLarge: {
      height: '90px',
      width: '340px',
      length: 4,
      hasContainer: false,
    },
    forLarge: {
      height: '90px',
      width: '290px',
      length: 4,
      hasContainer: false,
    },
    forDefault: {
      height: '90px',
      width: '250px',
      length: 4,
      hasContainer: false,
    },
  });

export const getStrategyDriverCardSkeletonProps = (
  isDesktopXLarge: boolean,
  isDesktopLarge: boolean,
  isExportPage = false,
): SkeletonProps =>
  pickSkeletonByViewport(isDesktopXLarge, isDesktopLarge, isExportPage, {
    forExport: {
      height: '90px',
      width: '512px',
      length: 3,
      hasContainer: false,
    },
    forXLarge: {
      height: '78px',
      width: '452px',
      length: 3,
      hasContainer: false,
    },
    forLarge: {
      height: '75px',
      width: '392px',
      length: 3,
      hasContainer: false,
    },
    forDefault: {
      height: '75px',
      width: '338px',
      length: 3,
      hasContainer: false,
    },
  });

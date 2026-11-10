import {
  KPI_OVERVIEW_CARD_SKELETON_DEFAULT_VIEWPORTS,
  KPI_OVERVIEW_CARD_SKELETON_EXPORT_LAYOUT,
  KPI_OVERVIEW_CARD_SKELETON_INNOVATION_VIEWPORTS,
} from '../constants';
import type {
  KpiOverviewCardSkeletonProps,
  KpiOverviewCardSkeletonVariation,
  KpiOverviewCardSkeletonViewportMap,
} from '../types';

function pickSkeletonByViewport(
  isDesktopXLarge: boolean,
  isDesktopLarge: boolean,
  variants: KpiOverviewCardSkeletonViewportMap,
): KpiOverviewCardSkeletonProps {
  if (isDesktopXLarge) return variants.forXLarge;
  if (isDesktopLarge) return variants.forLarge;
  return variants.forDefault;
}

export function getKpiOverviewCardSkeletonProps(
  isDesktopXLarge: boolean,
  isDesktopLarge: boolean,
  variation: KpiOverviewCardSkeletonVariation = 'default',
): KpiOverviewCardSkeletonProps {
  if (variation === 'export') {
    return KPI_OVERVIEW_CARD_SKELETON_EXPORT_LAYOUT;
  }
  if (variation === 'innovation') {
    return pickSkeletonByViewport(
      isDesktopXLarge,
      isDesktopLarge,
      KPI_OVERVIEW_CARD_SKELETON_INNOVATION_VIEWPORTS,
    );
  }
  return pickSkeletonByViewport(
    isDesktopXLarge,
    isDesktopLarge,
    KPI_OVERVIEW_CARD_SKELETON_DEFAULT_VIEWPORTS,
  );
}

import type {
  KpiOverviewCardSkeletonProps,
  KpiOverviewCardSkeletonViewportMap,
} from '../types';

export const DEFAULT_CHART_COLORS = {
  striped: '#e9c528',
  current: '#d1a33c',
  default: '#eddab1',
} as const;

export const KPI_OVERVIEW_CARD_SKELETON_DEFAULT_VIEWPORTS: KpiOverviewCardSkeletonViewportMap =
  {
    forExport: {
      height: '568px',
      width: '312px',
      length: 5,
      hasContainer: false,
    },
    forXLarge: {
      height: '484px',
      width: '264px',
      length: 5,
      hasContainer: false,
    },
    forLarge: {
      height: '474px',
      width: '228px',
      length: 5,
      hasContainer: false,
    },
    forDefault: {
      height: '468px',
      width: '198px',
      length: 5,
      hasContainer: false,
    },
  };

export const KPI_OVERVIEW_CARD_SKELETON_EXPORT_LAYOUT: KpiOverviewCardSkeletonProps =
  {
    height: '568px',
    width: '312px',
    length: 5,
    hasContainer: false,
  };

export const KPI_OVERVIEW_CARD_SKELETON_INNOVATION_VIEWPORTS: KpiOverviewCardSkeletonViewportMap =
  {
    forExport: {
      height: '568px',
      width: '312px',
      length: 4,
      hasContainer: false,
    },
    forXLarge: {
      height: '695px',
      width: '336px',
      length: 4,
      hasContainer: false,
    },
    forLarge: {
      height: '695px',
      width: '250px',
      length: 4,
      hasContainer: false,
    },
    forDefault: {
      height: '695px',
      width: '250px',
      length: 4,
      hasContainer: false,
    },
  };

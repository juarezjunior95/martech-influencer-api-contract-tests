import { ResponsiveConfig } from '../types';

export const RESPONSIVE_BREAKPOINTS = {
  medium: 200,
  large: 400,
  responsive: 700,
} as const;

export const RESPONSIVE_CONFIGS: Record<
  'small' | 'medium' | 'large' | 'responsive',
  ResponsiveConfig
> = {
  small: {
    columnWidth: 36,
    columnSpacing: 8,
    fontSize: {
      label: 12,
      value: 12,
      variation: 12,
    },
    padding: {
      top: 52,
      right: 8,
      bottom: 4,
      left: 8,
    },
    borderRadius: 4,
    minCellHeight: 8,
  },

  medium: {
    columnWidth: 54,
    columnSpacing: 12,
    fontSize: {
      label: 12,
      value: 12,
      variation: 12,
    },
    padding: {
      top: 55,
      right: 16,
      bottom: 4,
      left: 16,
    },
    borderRadius: 6,
    minCellHeight: 8,
  },

  large: {
    columnWidth: 72,
    columnSpacing: 16,
    fontSize: {
      label: 12,
      value: 12,
      variation: 12,
    },
    padding: {
      top: 64,
      right: 24,
      bottom: 4,
      left: 24,
    },
    borderRadius: 8,
    minCellHeight: 8,
  },
  responsive: {
    columnWidth: 112,
    columnSpacing: 20,
    fontSize: {
      label: 12,
      value: 12,
      variation: 12,
    },
    padding: {
      top: 60,
      right: 32,
      bottom: 4,
      left: 32,
    },
    borderRadius: 8,
    minCellHeight: 8,
  },
};

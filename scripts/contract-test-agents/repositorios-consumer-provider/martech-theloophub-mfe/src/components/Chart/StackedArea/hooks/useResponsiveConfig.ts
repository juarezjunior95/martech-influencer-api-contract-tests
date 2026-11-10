import { useMemo } from 'react';

import { RESPONSIVE_CONFIGS } from '../configs/responsiveSizes';
import {
  MAX_COLUMN_WIDTH,
  MIN_COLUMN_SPACING,
  MIN_COLUMN_WIDTH,
} from '../constants';
import { ResponsiveConfig, StackedAreaSize } from '../types';
import { calculateLegendPaddingTop } from '../utils/legendPaddingCalculator';
import { resolveFixedSize } from '../utils/responsiveResolver';

export function useResponsiveConfig(
  size: StackedAreaSize,
  containerWidth: number,
  numColumns: number,
  legendCount = 0,
): ResponsiveConfig {
  return useMemo(() => {
    let config: ResponsiveConfig;

    if (size === 'responsive') {
      const resolved = resolveFixedSize(containerWidth);
      const baseConfig = RESPONSIVE_CONFIGS[resolved];

      const availableWidth =
        containerWidth - baseConfig.padding.left - baseConfig.padding.right;
      const slotWidth = availableWidth / numColumns;
      const columnWidth = Math.max(
        MIN_COLUMN_WIDTH,
        Math.min(MAX_COLUMN_WIDTH, slotWidth - MIN_COLUMN_SPACING),
      );
      const columnSpacing = slotWidth - columnWidth;

      config = { ...baseConfig, columnWidth, columnSpacing };
    } else {
      config = RESPONSIVE_CONFIGS[size];
    }

    const adjustedTop = calculateLegendPaddingTop(
      config.padding.top,
      legendCount,
    );

    return {
      ...config,
      padding: { ...config.padding, top: adjustedTop },
    };
  }, [size, containerWidth, numColumns, legendCount]);
}

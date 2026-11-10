import type { RefObject } from 'react';
import { useMemo } from 'react';

import { useDynamicPosition } from '../../../utils/useDynamicPosition';
import type { TooltipPosition } from './Tooltip';
import {
  TOOLTIP_FONT_SIZE,
  TOOLTIP_LINE_HEIGHT_RATIO,
  TOOLTIP_PADDING,
  TOOLTIP_WIDTH,
} from './Tooltip.styles';

interface UseTooltipPositionParams {
  position: TooltipPosition;
  offset: number;
  content: string;
  wrapperRef: RefObject<HTMLDivElement>;
}

interface UseTooltipPositionReturn {
  coords: { top: number; left: number };
  effectivePosition: TooltipPosition;
  updatePosition: () => void;
}

export const useTooltipPosition = ({
  position,
  offset,
  content,
  wrapperRef,
}: UseTooltipPositionParams): UseTooltipPositionReturn => {
  const TOOLTIP_LINE_HEIGHT = Math.ceil(
    TOOLTIP_FONT_SIZE * TOOLTIP_LINE_HEIGHT_RATIO,
  );
  const TOOLTIP_CHARS_PER_LINE = Math.floor(
    (TOOLTIP_WIDTH - TOOLTIP_PADDING) / (TOOLTIP_FONT_SIZE * 0.5),
  );
  const TOOLTIP_MIN_HEIGHT = TOOLTIP_LINE_HEIGHT + TOOLTIP_PADDING;

  const dimensions = useMemo(() => {
    const contentLength = content.length;
    const estimatedLines = Math.ceil(contentLength / TOOLTIP_CHARS_PER_LINE);
    const tooltipHeight = Math.max(
      TOOLTIP_MIN_HEIGHT,
      estimatedLines * TOOLTIP_LINE_HEIGHT + TOOLTIP_PADDING,
    );

    return {
      width: TOOLTIP_WIDTH,
      height: tooltipHeight,
    };
  }, [
    content,
    TOOLTIP_CHARS_PER_LINE,
    TOOLTIP_MIN_HEIGHT,
    TOOLTIP_LINE_HEIGHT,
  ]);

  return useDynamicPosition({
    position,
    offset,
    dimensions,
    triggerRef: wrapperRef,
  });
};

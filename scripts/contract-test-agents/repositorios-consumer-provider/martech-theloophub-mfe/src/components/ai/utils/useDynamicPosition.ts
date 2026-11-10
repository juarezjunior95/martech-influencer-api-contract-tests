import type { RefObject } from 'react';
import { useCallback, useState } from 'react';

export type DynamicPosition = 'top' | 'bottom' | 'left' | 'right';

interface DynamicDimensions {
  width: number;
  height: number;
}

interface UseDynamicPositionParams {
  position: DynamicPosition;
  offset: number;
  dimensions: DynamicDimensions;
  triggerRef: RefObject<HTMLElement>;
  enabled?: boolean;
}

interface UseDynamicPositionReturn {
  coords: { top: number; left: number };
  effectivePosition: DynamicPosition;
  updatePosition: () => void;
}

const VIEWPORT_PADDING = 8;

export const useDynamicPosition = ({
  position,
  offset,
  dimensions,
  triggerRef,
  enabled = true,
}: UseDynamicPositionParams): UseDynamicPositionReturn => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [effectivePosition, setEffectivePosition] =
    useState<DynamicPosition>(position);

  const updatePosition = useCallback(() => {
    if (!enabled || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const { width: popupWidth, height: popupHeight } = dimensions;

    const positionChecks: Record<
      DynamicPosition,
      { hasSpace: boolean; fallbackPosition: DynamicPosition }
    > = {
      bottom: {
        hasSpace:
          window.innerHeight - rect.bottom >=
          popupHeight + offset + VIEWPORT_PADDING,
        fallbackPosition: 'top',
      },
      top: {
        hasSpace: rect.top >= popupHeight + offset + VIEWPORT_PADDING,
        fallbackPosition: 'bottom',
      },
      right: {
        hasSpace:
          window.innerWidth - rect.right >=
          popupWidth + offset + VIEWPORT_PADDING,
        fallbackPosition: 'left',
      },
      left: {
        hasSpace: rect.left >= popupWidth + offset + VIEWPORT_PADDING,
        fallbackPosition: 'right',
      },
    };

    const { hasSpace, fallbackPosition } = positionChecks[position];
    const finalPosition = hasSpace ? position : fallbackPosition;

    setEffectivePosition(finalPosition);
    setCoords({
      top: rect.top,
      left: rect.left,
    });
  }, [position, offset, dimensions, triggerRef, enabled]);

  return {
    coords,
    effectivePosition,
    updatePosition,
  };
};

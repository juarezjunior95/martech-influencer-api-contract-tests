import {
  type CSSProperties,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import throttle from 'lodash/throttle';

import {
  type CustomTooltipSide,
  TOOLTIP_POSITION_THROTTLE_MS,
  TOOLTIP_SIDE_OFFSET,
} from '../CustomTooltip.types';

function getContentPosition(
  triggerRect: DOMRect,
  side: CustomTooltipSide,
  offset: number,
): CSSProperties {
  const style: CSSProperties = { position: 'fixed' };
  switch (side) {
    case 'bottom':
      style.top = triggerRect.bottom + offset;
      style.left = triggerRect.left + triggerRect.width / 2;
      style.transform = 'translateX(-50%)';
      break;
    case 'top':
      style.bottom = window.innerHeight - triggerRect.top + offset;
      style.left = triggerRect.left + triggerRect.width / 2;
      style.transform = 'translateX(-50%)';
      break;
    case 'right':
      style.left = triggerRect.right + offset;
      style.top = triggerRect.top + triggerRect.height / 2;
      style.transform = 'translateY(-50%)';
      break;
    case 'left':
      style.right = window.innerWidth - triggerRect.left + offset;
      style.top = triggerRect.top + triggerRect.height / 2;
      style.transform = 'translateY(-50%)';
      break;
  }
  return style;
}

export const useTooltipPosition = (
  isOpen: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  side: CustomTooltipSide,
) => {
  const [contentStyle, setContentStyle] = useState<CSSProperties>({});

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setContentStyle(getContentPosition(rect, side, TOOLTIP_SIDE_OFFSET));
  }, [side, triggerRef]);

  const throttledUpdatePosition = useMemo(
    () => throttle(updatePosition, TOOLTIP_POSITION_THROTTLE_MS),
    [updatePosition],
  );

  useEffect(() => {
    if (!isOpen) {
      throttledUpdatePosition.cancel();
      return;
    }
    updatePosition();
    window.addEventListener('scroll', throttledUpdatePosition, true);
    window.addEventListener('resize', throttledUpdatePosition);
    return () => {
      throttledUpdatePosition.cancel();
      window.removeEventListener('scroll', throttledUpdatePosition, true);
      window.removeEventListener('resize', throttledUpdatePosition);
    };
  }, [isOpen, updatePosition, throttledUpdatePosition]);

  return contentStyle;
};

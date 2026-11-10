import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useId } from 'hooks/useId';

import {
  TooltipArrow,
  TooltipContent,
  TooltipWrapper,
  TriggerWrapper,
} from './Tooltip.styles';
import { useTooltipPosition } from './useTooltipPosition';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: TooltipPosition;
  delay?: number;
  hidden?: boolean;
  className?: string;
  offset?: number;
  fullWidth?: boolean;
  forceVisible?: boolean;
}

export const Tooltip = ({
  content,
  children,
  position = 'top',
  delay = 200,
  hidden = false,
  className,
  offset = 8,
  fullWidth = false,
  forceVisible = false,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId('tooltip');

  const { coords, effectivePosition, updatePosition } = useTooltipPosition({
    position,
    offset,
    content,
    wrapperRef,
  });

  const showTooltip = useCallback(() => {
    if (hidden) return;

    updatePosition();
    const id = setTimeout(() => {
      setVisible(true);
    }, delay);

    setTimeoutId(id);
  }, [delay, hidden, updatePosition]);

  const hideTooltip = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setVisible(false);
  }, [timeoutId]);

  useEffect(() => {
    if (forceVisible) {
      updatePosition();
      setVisible(true);
    }
  }, [forceVisible, updatePosition]);

  useEffect(() => {
    if (visible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [visible, updatePosition]);

  if (hidden) {
    return <>{children}</>;
  }

  const isVisible = visible || forceVisible;
  const tooltipElement = isVisible
    ? createPortal(
        <TooltipContent
          id={tooltipId}
          role="tooltip"
          $position={effectivePosition}
          $visible={isVisible}
          $offset={offset}
          $coords={coords}
          $wrapperRect={wrapperRef.current?.getBoundingClientRect()}
        >
          {content}
          <TooltipArrow $position={effectivePosition} />
        </TooltipContent>,
        document.body,
      )
    : null;

  return (
    <>
      <TooltipWrapper
        ref={wrapperRef}
        className={className}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        $fullWidth={fullWidth}
      >
        <TriggerWrapper
          aria-describedby={isVisible ? tooltipId : undefined}
          $fullWidth={fullWidth}
        >
          {children}
        </TriggerWrapper>
      </TooltipWrapper>
      {tooltipElement}
    </>
  );
};

Tooltip.displayName = 'Tooltip';

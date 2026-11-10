import { css } from '@emotion/react';
import styled from '@emotion/styled';

import type { TooltipPosition } from './Tooltip';

interface TooltipContentProps {
  $position: TooltipPosition;
  $visible: boolean;
  $offset: number;
  $coords: { top: number; left: number };
  $wrapperRect: DOMRect | undefined;
}

interface TooltipArrowProps {
  $position: TooltipPosition;
}

interface TooltipWrapperProps {
  $fullWidth?: boolean;
}

interface TriggerWrapperProps {
  $fullWidth?: boolean;
}

export const TOOLTIP_WIDTH = 256;
export const TOOLTIP_PADDING = 16;
export const TOOLTIP_FONT_SIZE = 14;
export const TOOLTIP_LINE_HEIGHT_RATIO = 1.4;

export const TooltipWrapper = styled.div<TooltipWrapperProps>`
  position: relative;
  display: ${({ $fullWidth }) => ($fullWidth ? 'flex' : 'inline-flex')};
  align-items: center;
  flex: ${({ $fullWidth }) => ($fullWidth ? '1' : 'none')};
  min-width: ${({ $fullWidth }) => ($fullWidth ? '0' : 'auto')};
`;

const getPositionStyles = (
  position: TooltipPosition,
  offset: number,
  coords: { top: number; left: number },
  wrapperRect: DOMRect | undefined,
) => {
  if (!wrapperRect) return css``;

  const { width, height } = wrapperRect;

  const styles = {
    top: css`
      top: ${coords.top - offset}px;
      left: ${coords.left + width / 2}px;
      transform: translate(-50%, -100%);
    `,
    bottom: css`
      top: ${coords.top + height + offset}px;
      left: ${coords.left + width / 2}px;
      transform: translateX(-50%);
    `,
    left: css`
      top: ${coords.top + height / 2}px;
      left: ${coords.left - offset}px;
      transform: translate(-100%, -50%);
    `,
    right: css`
      top: ${coords.top + height / 2}px;
      left: ${coords.left + width + offset}px;
      transform: translateY(-50%);
    `,
  };

  return styles[position];
};

export const TooltipContent = styled.div<TooltipContentProps>`
  position: fixed;
  z-index: 10001;
  background-color: var(--ai-chat-color-bg-tooltip, #141414);
  color: var(--ai-chat-color-text-inverse, #ffffff);
  padding: var(--ai-chat-space-2, ${TOOLTIP_PADDING / 2}px);
  border-radius: var(--ai-chat-radius-md, 8px);
  font-family: var(--ai-chat-font-family-body, 'Work Sans', sans-serif);
  font-size: var(--ai-chat-font-size-body-sm, ${TOOLTIP_FONT_SIZE}px);
  font-weight: var(--ai-chat-font-weight-regular, 400);
  line-height: ${TOOLTIP_LINE_HEIGHT_RATIO * 100}%;
  pointer-events: none;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);

  max-width: min(${TOOLTIP_WIDTH}px, calc(100vw - ${TOOLTIP_PADDING}px));
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  text-align: center;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition:
    opacity 0.15s ease,
    visibility 0.15s ease;

  ${({ $position, $offset, $coords, $wrapperRect }) =>
    getPositionStyles($position, $offset, $coords, $wrapperRect)}
`;

const getArrowStyles = (position: TooltipPosition) => {
  const arrowSize = '4px';

  const styles = {
    top: css`
      bottom: -${arrowSize};
      left: 50%;
      transform: translateX(-50%);
      border-left: ${arrowSize} solid transparent;
      border-right: ${arrowSize} solid transparent;
      border-top: ${arrowSize} solid var(--ai-chat-color-bg-tooltip, #141414);
    `,
    bottom: css`
      top: -${arrowSize};
      left: 50%;
      transform: translateX(-50%);
      border-left: ${arrowSize} solid transparent;
      border-right: ${arrowSize} solid transparent;
      border-bottom: ${arrowSize} solid var(--ai-chat-color-bg-tooltip, #141414);
    `,
    left: css`
      right: -${arrowSize};
      top: 50%;
      transform: translateY(-50%);
      border-top: ${arrowSize} solid transparent;
      border-bottom: ${arrowSize} solid transparent;
      border-left: ${arrowSize} solid var(--ai-chat-color-bg-tooltip, #141414);
    `,
    right: css`
      left: -${arrowSize};
      top: 50%;
      transform: translateY(-50%);
      border-top: ${arrowSize} solid transparent;
      border-bottom: ${arrowSize} solid transparent;
      border-right: ${arrowSize} solid var(--ai-chat-color-bg-tooltip, #141414);
    `,
  };

  return styles[position];
};

export const TooltipArrow = styled.div<TooltipArrowProps>`
  position: absolute;
  width: 0;
  height: 0;

  ${({ $position }) => getArrowStyles($position)}
`;

export const TriggerWrapper = styled.div<TriggerWrapperProps>`
  display: ${({ $fullWidth }) => ($fullWidth ? 'flex' : 'inline-flex')};
  align-items: center;
  flex: ${({ $fullWidth }) => ($fullWidth ? '1' : 'none')};
  min-width: ${({ $fullWidth }) => ($fullWidth ? '0' : 'auto')};
  overflow: ${({ $fullWidth }) => ($fullWidth ? 'hidden' : 'visible')};
`;

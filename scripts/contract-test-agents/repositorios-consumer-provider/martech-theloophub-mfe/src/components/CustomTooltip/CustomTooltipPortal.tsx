import { type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { StyledCustomTooltipContent } from './CustomTooltip.styles';
import {
  type CustomTooltipBackgroundStyle,
  type CustomTooltipColor,
  type CustomTooltipSide,
  type CustomTooltipSize,
  TOOLTIP_SIDE_OFFSET,
} from './CustomTooltip.types';

export interface CustomTooltipPortalProps {
  contentId: string;
  isOpen: boolean;
  interactive: boolean;
  size: CustomTooltipSize;
  side: CustomTooltipSide;
  colorType?: CustomTooltipColor;
  backgroundStyle: CustomTooltipBackgroundStyle;
  dataTestId?: string;
  contentStyle: CSSProperties;
  children: ReactNode;
}

export const CustomTooltipPortal = ({
  contentId,
  isOpen,
  interactive,
  size,
  side,
  colorType,
  backgroundStyle,
  dataTestId,
  contentStyle,
  children,
}: CustomTooltipPortalProps) => {
  const target = globalThis.window === undefined ? null : document.body;
  if (target) {
    return createPortal(
      <StyledCustomTooltipContent
        id={contentId}
        size={size}
        colorType={colorType}
        backgroundStyle={backgroundStyle}
        data-testid={dataTestId ? `${dataTestId}-content` : undefined}
        side={side}
        sideOffset={TOOLTIP_SIDE_OFFSET}
        data-side={side}
        data-size={size}
        data-background-style={backgroundStyle}
        data-color-type={colorType}
        style={{
          ...contentStyle,
          visibility: isOpen ? 'visible' : 'hidden',
          pointerEvents: isOpen && interactive ? 'auto' : 'none',
        }}
        role="tooltip"
      >
        {children}
      </StyledCustomTooltipContent>,
      target,
    );
  }
  return null;
};

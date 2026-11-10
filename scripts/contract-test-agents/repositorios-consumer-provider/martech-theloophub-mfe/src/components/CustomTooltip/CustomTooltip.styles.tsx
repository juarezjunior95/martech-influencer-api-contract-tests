import React from 'react';

import styled from '@emotion/styled';
import { theme } from 'theme';

interface RootDivProps extends React.HTMLAttributes<HTMLDivElement> {
  onOpenChange?: (open: boolean) => void;
  $fillTrigger?: boolean;
}

function RootDiv({
  onOpenChange: _onOpenChange,
  $fillTrigger: _fillTrigger,
  ...props
}: RootDivProps) {
  return <div {...props} />;
}

export const StyledCustomTooltipRoot = styled(RootDiv)<RootDivProps>(
  ({ $fillTrigger }) =>
    $fillTrigger
      ? {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: '100%',
          height: '100%',
          minWidth: 0,
          minHeight: 0,
        }
      : {
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: 'auto',
          maxWidth: '100%',
          minWidth: 0,
          verticalAlign: 'middle',
        },
);

/** Renders a native button with type="button" so nested use in forms never submits. */
const TooltipTriggerButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { $fillTrigger?: boolean }
>(({ $fillTrigger: _fillTrigger, ...props }, ref) => (
  <button ref={ref} {...props} type="button" />
));
TooltipTriggerButton.displayName = 'TooltipTriggerButton';

export const StyledCustomTooltipTrigger = styled(TooltipTriggerButton)<{
  $fillTrigger?: boolean;
}>(({ $fillTrigger }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  font: 'inherit',
  ...($fillTrigger
    ? {
        flex: 1,
        minHeight: 0,
        width: '100%',
        height: '100%',
      }
    : {
        flex: 'none',
        width: 'auto',
        height: 'auto',
        minWidth: 0,
      }),
}));

const TOOLTIP_TRIGGER_ICON_PX = {
  small: 18,
  medium: 22,
  large: 28,
} as const;

export type CustomTooltipTriggerIconSize = keyof typeof TOOLTIP_TRIGGER_ICON_PX;

export const StyledCustomTooltipIconWrap = styled.span<{
  $iconSize: CustomTooltipTriggerIconSize;
}>(({ $iconSize }) => {
  const px = TOOLTIP_TRIGGER_ICON_PX[$iconSize];
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 0,
    flexShrink: 0,
    color: '#5C5C5C',
    '& svg': {
      width: px,
      height: px,
      display: 'block',
    },
  };
});

export type CustomTooltipSize = 'auto' | 'small' | 'medium' | 'large';
export type CustomTooltipColorType = 'informative' | 'dark';
export type CustomTooltipBackgroundStyle = 'default' | 'transparent';

interface StyledCustomTooltipContentProps {
  size?: CustomTooltipSize;
  colorType?: CustomTooltipColorType;
  backgroundStyle?: CustomTooltipBackgroundStyle;
  side?: string;
  sideOffset?: number;
}

function ContentDiv({
  side: _side,
  sideOffset: _sideOffset,
  colorType: _colorType,
  backgroundStyle: _backgroundStyle,
  size: _size,
  ...props
}: StyledCustomTooltipContentProps & React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

const boxShadowElevation2 = '0 4px 12px rgba(0, 0, 0, 0.15)';

export const StyledCustomTooltipContent = styled(
  ContentDiv,
)<StyledCustomTooltipContentProps>((props) => {
  const size = props.size ?? 'auto';
  const sizeLayout =
    size === 'small'
      ? {
          padding: '12px',
          maxWidth: '260px',
          fontSize: '12px',
          lineHeight: '18px',
        }
      : size === 'medium'
        ? {
            padding: '16px',
            maxWidth: '400px',
            fontSize: '14px',
            lineHeight: '20px',
          }
        : size === 'large'
          ? {
              padding: '20px',
              maxWidth: '500px',
              fontSize: '16px',
              lineHeight: '24px',
            }
          : {
              padding: '16px',
              maxWidth: '364px',
              fontSize: '14px',
              lineHeight: '20px',
            };

  return {
    position: 'fixed',
    pointerEvents: 'none',
    borderRadius: '1rem',
    zIndex: 99999,
    opacity: 1,
    color: '#141414',
    boxShadow: boxShadowElevation2,
    background: 'white',
    width: 'max-content',
    ...sizeLayout,

    ...(props.colorType === 'informative' && {
      color: theme.colors.txt.on.informative.default,
      background: theme.colors.tooltip.bg.default,
    }),
    ...(props.colorType === 'dark' && {
      color: 'rgba(255, 255, 255, 1)',
      background: 'rgba(20, 20, 20, 1)',
    }),

    ...(props.backgroundStyle === 'transparent' && {
      background: 'transparent',
      boxShadow: 'none',
      padding: 0,
      borderRadius: 0,
    }),
  };
});

export const TooltipTitle = styled.div({
  fontFamily: 'Barlow, sans-serif',
  fontWeight: 600,
  fontSize: '24px',
  lineHeight: '32px',
  letterSpacing: 0,
  color: '#141414',
  marginBottom: '8px',
  whiteSpace: 'pre-line',
});

export const TooltipSubtitle = styled.div({
  fontFamily: '"Work Sans", sans-serif',
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: 0,
  color: '#141414',
  marginBottom: '20px',
  whiteSpace: 'pre-line',
});

export const TooltipText = styled.div({
  fontFamily: '"Work Sans", sans-serif',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: 0,
  color: '#141414',
  whiteSpace: 'pre-line',
});

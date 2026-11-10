import {
  type ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '@hexa-ui/components2';
import { useGoogleAnalytics } from 'hooks';
import { useId } from 'hooks/useId';

import {
  StyledCustomTooltipIconWrap,
  StyledCustomTooltipRoot,
  StyledCustomTooltipTrigger,
  TooltipSubtitle,
  TooltipText,
  TooltipTitle,
} from './CustomTooltip.styles';
import type {
  CustomTooltipBackgroundStyle,
  CustomTooltipColor,
  CustomTooltipSide,
  CustomTooltipSize,
} from './CustomTooltip.types';
import { CustomTooltipPortal } from './CustomTooltipPortal';
import { useTooltipPosition } from './hooks/useTooltipPosition';

export type {
  CustomTooltipBackgroundStyle,
  CustomTooltipColor,
  CustomTooltipSide,
  CustomTooltipSize,
} from './CustomTooltip.types';

export type CustomTooltipIconComponent = NonNullable<
  ComponentProps<typeof Icon>['icon']
>;

export interface CustomTooltipIconProp {
  size?: 'small' | 'medium' | 'large';
  /** Icon component (e.g. Info from @hexa-ui/icons2) */
  icon: CustomTooltipIconComponent;
  'data-testid'?: string;
}

interface CustomTooltipProps {
  label?: string;
  children?: React.ReactNode;
  content?: React.ReactNode;
  /** When provided, renders this icon as the tooltip trigger (instead of children). */
  icon?: CustomTooltipIconProp;
  /** Optional structured title (bold, large). When used with subtitle/text, renders structured layout. */
  title?: string;
  /** Optional structured subtitle (bold, medium). */
  subtitle?: string;
  /** Optional structured text (regular, smaller). */
  text?: string;
  side?: CustomTooltipSide;
  size?: CustomTooltipSize;
  colorType?: CustomTooltipColor;
  backgroundStyle?: CustomTooltipBackgroundStyle;
  dataTestId?: string;
  interactive?: boolean;
  fillTrigger?: boolean;
  forceOpen?: boolean;
  openOnHover?: boolean;
}

const DELAY_MS = 300;

export const CustomTooltip = ({
  label,
  children,
  content,
  icon: iconProp,
  title,
  subtitle,
  text,
  colorType,
  side = 'bottom',
  size = 'auto',
  backgroundStyle = 'default',
  dataTestId,
  interactive = false,
  fillTrigger = false,
  forceOpen = false,
  openOnHover = true,
}: CustomTooltipProps): JSX.Element => {
  const hasStructured = title != null || subtitle != null || text != null;
  const bodyContent = hasStructured ? (
    <>
      {title != null && title !== '' && <TooltipTitle>{title}</TooltipTitle>}
      {subtitle != null && subtitle !== '' && (
        <TooltipSubtitle>{subtitle}</TooltipSubtitle>
      )}
      {text != null && text !== '' && <TooltipText>{text}</TooltipText>}
    </>
  ) : (
    (content ?? null)
  );
  const [isOpen, setIsOpen] = useState(false);
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentStyle = useTooltipPosition(isOpen, triggerRef, side);
  const trackGA = useGoogleAnalytics();
  const tooltipDomId = useId('tooltip');
  const contentId = dataTestId ? `${dataTestId}-content` : tooltipDomId;

  const handleGAEvent = useCallback(
    (open: boolean, gaLabel?: string) => {
      if (!open) return;
      try {
        trackGA({
          event_category: 'Tooltip',
          event_action: 'Opened',
          event_label: gaLabel ?? '',
        });
      } catch (error) {
        console.error('Failed to track Google Analytics event:', error);
      }
    },
    [trackGA],
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        handleGAEvent(true, label);
      }
    },
    [handleGAEvent, label],
  );

  const showTooltip = useCallback(() => {
    delayRef.current = setTimeout(() => {
      delayRef.current = null;
      setIsOpen(true);
      handleOpenChange(true);
    }, DELAY_MS);
  }, [handleOpenChange]);

  const hideTooltip = useCallback(() => {
    if (delayRef.current) {
      clearTimeout(delayRef.current);
      delayRef.current = null;
    }
    setIsOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      if (delayRef.current !== null) {
        clearTimeout(delayRef.current);
        delayRef.current = null;
      }
    };
  }, []);

  const tooltipOpen = forceOpen || isOpen;

  return (
    <StyledCustomTooltipRoot
      $fillTrigger={fillTrigger}
      onMouseEnter={openOnHover ? showTooltip : undefined}
      onMouseLeave={openOnHover ? hideTooltip : undefined}
      onFocus={openOnHover ? showTooltip : undefined}
      onBlur={openOnHover ? hideTooltip : undefined}
      onOpenChange={handleOpenChange}
    >
      <StyledCustomTooltipTrigger
        $fillTrigger={fillTrigger}
        ref={triggerRef}
        className="tooltip-trigger"
        aria-haspopup="dialog"
        aria-expanded={tooltipOpen}
        aria-describedby={tooltipOpen ? contentId : undefined}
        data-testid={
          iconProp?.['data-testid'] ?? dataTestId ?? 'custom-tooltip'
        }
      >
        {iconProp ? (
          <StyledCustomTooltipIconWrap $iconSize={iconProp.size ?? 'small'}>
            <Icon
              icon={iconProp.icon}
              size={iconProp.size ?? 'small'}
              data-testid={iconProp['data-testid']}
            />
          </StyledCustomTooltipIconWrap>
        ) : (
          children
        )}
      </StyledCustomTooltipTrigger>
      <CustomTooltipPortal
        contentId={contentId}
        isOpen={tooltipOpen}
        interactive={interactive}
        size={size}
        side={side}
        colorType={colorType}
        backgroundStyle={backgroundStyle}
        dataTestId={dataTestId}
        contentStyle={contentStyle}
      >
        {bodyContent}
      </CustomTooltipPortal>
    </StyledCustomTooltipRoot>
  );
};

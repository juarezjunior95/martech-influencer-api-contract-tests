import styled from '@emotion/styled';
import { Icon } from '@hexa-ui/components2';

type TooltipSize = 'small' | 'default';

const TOOLTIP_TEXT_CONFIG: Record<
  TooltipSize,
  { fontSize: string; color: string }
> = {
  small: { fontSize: '10px', color: '#5c5c5c' },
  default: { fontSize: '12px', color: '#141414' },
};

const ICON_SIZE_CONFIG: Record<TooltipSize, string> = {
  small: '11px',
  default: '25.75px',
};

export const StyledTooltipText = styled.p<{ size?: TooltipSize }>`
  margin: 0;
  font-family: 'Work Sans', sans-serif;
  font-size: ${({ size = 'small' }) => TOOLTIP_TEXT_CONFIG[size].fontSize};
  font-weight: 400;
  line-height: 16px;
  color: ${({ size = 'small' }) => TOOLTIP_TEXT_CONFIG[size].color};
`;

export const StyledInfoIcon = styled(Icon)<{ tooltipSize?: TooltipSize }>`
  display: inline-flex;
  margin-left: ${({ tooltipSize = 'small' }) =>
    tooltipSize === 'small' ? '2px' : '0'};
  cursor: pointer;

  svg {
    width: ${({ tooltipSize = 'small' }) => ICON_SIZE_CONFIG[tooltipSize]};
    height: ${({ tooltipSize = 'small' }) => ICON_SIZE_CONFIG[tooltipSize]};

    path {
      fill: #5c5c5c;
    }
  }
`;

import styled from '@emotion/styled';
import { theme } from 'theme';

interface StyledTooltipInfoIconProps {
  iconSize?: number;
}

export const StyledTooltipInfoIcon = styled.div<StyledTooltipInfoIconProps>`
  display: inline-flex;
  align-items: center;
  width: ${({ iconSize = 16 }) => iconSize}px;
  height: ${({ iconSize = 16 }) => iconSize}px;

  svg {
    width: ${({ iconSize = 16 }) => iconSize}px;
    height: ${({ iconSize = 16 }) => iconSize}px;

    path {
      fill: ${theme.colors.charts.bg.neutrals['60']};
    }
  }
`;

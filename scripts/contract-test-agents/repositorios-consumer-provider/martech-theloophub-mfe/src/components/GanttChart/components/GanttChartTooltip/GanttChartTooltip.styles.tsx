import { styled } from '@hexa-ui/theme';
import { StyledTooltipContainer } from 'components/TooltipImage/TooltipImage.styles';

export const StyledGanttChartTooltip = styled(StyledTooltipContainer, {
  display: 'flex',
  flexDirection: 'column',
  fontSize: '14px',
});

export const StyledGanttChartTooltipItem = styled('p', {
  margin: 0,

  variants: {
    firstIndex: {
      true: {
        maxHeight: '16px',
      },
    },
  },
});

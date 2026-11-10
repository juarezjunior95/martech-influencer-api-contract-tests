import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';
import { theme } from 'theme';

export const StyledGanttChartWithMilestones = styled('div', {
  flex: 1,
  minHeight: '36px',
  display: 'flex',
  alignItems: 'center',
  borderRight: `1px solid ${tokens.color.foundation.border.tertiary}`,
  variants: {
    weekDelimiter: {
      true: {
        borderRight: `1px solid ${theme.colors.charts.border.neutrals[40]}`,
      },
    },
  },
  '.tooltip-trigger': {
    width: '100%',
  },
});

export const StyledGanttChartWithMilestonesCell = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  minHeight: '15px',
  variants: {
    activeWeek: {
      true: {
        borderTop: `1px solid ${tokens.color.foundation.border.tertiary}`,
        borderBottom: `1px solid ${tokens.color.foundation.border.tertiary}`,
      },
    },
    timing: {
      start: {
        borderLeft: `1px solid ${tokens.color.foundation.border.tertiary}`,
        borderRadius: '16px 0 0 16px',
      },
      end: {
        borderRight: `1px solid ${tokens.color.foundation.border.tertiary}`,
        borderRadius: '0 16px 16px 0',
      },
      unique: {
        border: `1px solid ${tokens.color.foundation.border.tertiary}`,
        borderRadius: '50%',
      },
    },
  },
});

export const StyledMilestone = styled('span', {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
});

import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';
import { StyledBlackTooltipContainer } from 'shared/Styles';
import { theme } from 'theme';

export const StyledGanttChartHeaderTitle = styled('div', {
  fontFamily: '$paragraph',
  fontWeight: 500,
  fontSize: '14px',
  borderRight: `1px solid ${tokens.color.foundation.border.tertiary}`,

  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  textAlign: 'center',
  color: tokens.color.foundation.txt.default,
  alignItems: 'center',
  gap: '10px',
});

export const StyledGanttChartCellContainer = styled('div', {
  display: 'flex',
  borderBottom: `1px solid ${tokens.color.foundation.border.tertiary}`,
});
export const StyledGanttHeaderTooltip = styled(StyledBlackTooltipContainer, {
  zIndex: 99999,
  width: 256,
  height: 92,
  maxWidth: 256,
  maxHeight: 108,
  whiteSpace: 'normal',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  position: 'static',
});

export const StyledGanttHeaderCell = styled('div', {
  fontFamily: '$paragraph',
  fontWeight: 400,
  fontSize: '10px',
  border: `1px solid ${tokens.color.foundation.border.tertiary}`,
  position: 'relative',
  zIndex: 1,
  borderLeft: 'none',
  borderBottom: 'none',
  borderRight: `1px solid ${theme.colors.gray[30]}`,
  padding: '$05 $1',
  color: tokens.color.foundation.txt.secondary,
  flex: 1,
  textAlign: 'center',
  variants: {
    lastCell: {
      true: {
        borderRight: `1px solid ${tokens.color.foundation.border.tertiary}`,
      },
    },
  },
});

export const StyledGanttHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: tokens.color.foundation.bg['primary-clear'],
  flex: 1,
});

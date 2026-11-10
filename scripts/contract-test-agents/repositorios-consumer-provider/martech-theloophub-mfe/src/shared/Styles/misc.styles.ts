import { styled } from '@hexa-ui/theme';
import { theme } from 'theme';

export const StyledNoDataYet = styled('span', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  justifyContent: 'center',
  alignItems: 'center',
});

export const StyledFlag = styled('img', {
  width: '48px !important',
  height: '48px !important',
  minWidth: '48px !important',
  minHeight: '48px !important',
  div: {
    '&:hover': {
      background: 'none',
    },
  },
});

export const StyledVariation = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  gap: '$1.5',
  fontSize: '12px',
  variants: {
    color: {
      red: {
        color: theme.colors.charts.txt.status.decrease,
      },
      green: {
        color: theme.colors.charts.txt.status.increase,
      },
    },
  },
});

export const StyledBlackTooltipContainer = styled('div', {
  background: '#141414',
  color: '#ffffff',
  padding: '0 8px',
  borderRadius: '$2',
  fontSize: '$1',
  fontFamily: '$paragraph',
  fontWeight: 'normal',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  minHeight: '32px',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: '8px solid #141414',
  },
});

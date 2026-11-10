import { styled } from '@hexa-ui/theme';

export const StyledStrategicInnovationPortfolioContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  width: '100%',
  height: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  borderRight: '1px solid #14141429',
  minWidth: 0,
  '> *': {
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
});

export const StyledHealthContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  alignItems: 'center',
  marginTop: '32px',
  flex: 1,
  minHeight: '114px',
  maxHeight: '114px',
  borderBottom: '1px solid #14141429',
  width: '100%',
  maxWidth: '100%',
});

export const StyledBigNumbersContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '16px',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  '.big-number-item': {
    borderBottom: '1px solid #1414141f',
    height: '156px',
  },
  '.big-numbers-container': {
    gap: '0px !important',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    'div:first-of-type': {
      justifyContent: 'center',
    },
  },
});

export const StyledLegendContainer = styled('div', {
  padding: '24px',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
});

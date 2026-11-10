import { styled } from '@hexa-ui/theme';

export const StyledChartItemWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

export const StyledBeesDistributionCharContainer = styled('div', {
  background: '#ffffff',
  width: '100%',
  border: '1px solid rgba(20, 20, 20, 0.16)',
  borderRadius: '1rem',
  overflow: 'hidden',
  paddingBottom: '1rem',

  variants: {
    isEmpty: {
      true: {
        paddingBottom: '0',
      },
    },
  },
});

export const StyledDivider = styled('div', {
  display: 'flex',
  width: '100%',
  height: '1px',
  backgroundColor: '#c9d1d6',
});

export const StyledNoDataContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',

  variants: {
    withBorder: {
      true: {
        borderRight: '1px solid #c9d1d6',
      },
    },
  },
});

export const StyledBeesDistributionChartContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  height: '340px',
});

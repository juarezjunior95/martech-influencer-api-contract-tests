import { styled } from '@hexa-ui/theme';

export const StyledSummaryForPowerPerformance = styled('div', {
  display: 'flex',
  flexDirection: 'row',
});

export const StyledChartContainer = styled('div', {
  height: '300px',

  variants: {
    isExportPage: {
      true: {
        height: '300px',
      },
    },
  },
});

export const StyledYearPowerAcVariation = styled('div', {
  marginBottom: '48px',

  variants: {
    hideOverflow: {
      true: {
        marginBottom: '16px',
      },
    },
  },
});

export const StyledTrendOverTimeVariation = styled('div', {
  variants: {
    hideOverflow: {
      true: {
        marginBottom: '0',
      },
      false: {
        marginBottom: '48px',
      },
    },
  },
});

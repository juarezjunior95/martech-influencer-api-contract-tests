import { styled } from '@hexa-ui/theme';

export const StyledNoticeMessageContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '1rem',
  padding: '16px',
});

export const StyledNoDataYetIcon = styled('img', {
  width: '56px',
  height: '56px',
});

export const StyledChartHeaderWrapper = styled('div', {
  width: '150px',

  '@media (max-width: 1439px)': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '200px',
  },

  '@media (min-width: 1440px)': {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const StyledStrategyDriverCard = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  border: '1px solid #14141429',
  borderRadius: '16px',
  padding: '16px 8px',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  backgroundColor: 'white',
  height: '75px',

  '.bigNumberContainer': {
    height: 'auto',
  },

  '@media (max-width: 1439px)': {
    padding: '16px 0 16px 16px',
  },

  '@media (min-width: 1440px)': {
    height: '78px',
    padding: '16px 8px 16px 16px',
  },

  variants: {
    isExportPage: {
      true: {
        height: '90px',

        '@media (max-width: 1439px)': {
          height: '90px',
          padding: '24px 16px',
        },

        '@media (min-width: 1440px)': {
          height: '90px',
          padding: '24px 16px',
        },
      },
    },
  },
});

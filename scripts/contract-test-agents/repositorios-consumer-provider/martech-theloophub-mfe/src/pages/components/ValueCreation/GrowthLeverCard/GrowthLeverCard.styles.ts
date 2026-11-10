import { styled } from '@hexa-ui/theme';

export const StyledNoticeMessageContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '1rem',
  padding: '16px',
  borderLeft: '1px solid #14141414',
});

export const StyledNoDataYetIcon = styled('img', {
  width: '32px',
  height: '32px',

  '@media (min-width: 1440px)': {
    width: '40px',
    height: '40px',
  },
  '@media (min-width: 1920px)': {
    width: '50px',
    height: '50px',
  },
});

export const StyledGrowthLeverCardImage = styled('img', {
  width: '32px',
  height: '32px',
  objectFit: 'contain',

  '@media (min-width: 1440px)': {
    width: '40px',
    height: '40px',
  },
  '@media (min-width: 1920px)': {
    width: '50px',
    height: '50px',
  },
});

export const StyledGrowthLeverCard = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, auto)',
  borderRadius: '16px',
  border: '1px solid #14141429',
  backgroundColor: 'white',

  variants: {
    active: {
      true: {
        border: '2px solid transparent',
        background:
          'linear-gradient(0deg, rgba(229, 182, 17, 0.04), rgba(229, 182, 17, 0.04)) padding-box, linear-gradient(#fff, #fff) padding-box, linear-gradient(216.66deg, #F5E003 0%, #D3A238 75%) border-box',
      },
      false: {
        borderColor: '#14141429',
      },
    },

    isExportPage: {
      true: {
        height: '96px',
      },
    },
  },
});

export const StyledGrowthLeverCardHeader = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '16px',
  width: '118px',

  '@media (min-width: 1440px)': {
    width: '142px',
  },
  '@media (min-width: 1920px)': {
    width: '158px',
  },

  variants: {
    isExportPage: {
      true: {
        width: '158px',

        '@media (min-width: 1440px)': {
          width: '158px',
        },
        '@media (min-width: 1920px)': {
          width: '158px',
        },
      },
    },
  },
});

export const StyledGrowthLeverCardContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  borderLeft: '1px solid #14141414',
});

export const StyledGrowthLeverCardRow = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 48px)',
  alignItems: 'center',
  padding: '10px 12px',
  gap: '8px',

  '@media (min-width: 1440px)': {
    gridTemplateColumns: 'repeat(2, 56px)',
    gap: '8px',
  },
  '@media (min-width: 1920px)': {
    gridTemplateColumns: 'repeat(2, 70px)',
    gap: '8px',
  },

  '.bigNumberContainer': {
    height: 'auto',
  },

  variants: {
    hasBorderBottom: {
      true: {
        borderBottom: '1px solid #14141414',
      },
    },

    isExportPage: {
      true: {
        gridTemplateColumns: 'repeat(2, 80px)',

        '@media (min-width: 1440px)': {
          gridTemplateColumns: 'repeat(2, 80px)',
        },
        '@media (min-width: 1920px)': {
          gridTemplateColumns: 'repeat(2, 80px)',
        },
      },
    },
  },
});

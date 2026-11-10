import { styled } from '@hexa-ui/theme';

export const StyledKpiOverviewCardContent = styled('div', {
  width: '198px',
  minHeight: '468px',
  display: 'flex',
  flexDirection: 'column',

  '@media (min-width: 1440px)': {
    width: '228px',
  },

  '@media (min-width: 1920px)': {
    width: '264px',
  },

  '.bigNumberContainer': {
    height: 'auto',
  },

  variants: {
    variation: {
      export: {
        width: '312px',
        minHeight: '568px',

        '@media (min-width: 1440px)': {
          width: '312px',
        },

        '@media (min-width: 1920px)': {
          width: '312px',
        },
      },
      innovation: {
        width: '250px',
        maxHeight: '695px',

        '@media (min-width: 1440px)': {
          width: '252px',
        },

        '@media (min-width: 1920px)': {
          width: '336px',
        },
      },
    },
  },
});

export const StyledNoticeMessageContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  width: '100%',
  padding: 0,
});

export const StyledNoticeHeaderBlock = styled('div', {
  flexShrink: 0,
  padding: '16px 16px 0',
});

export const StyledNoticeDivider = styled('div', {
  flexShrink: 0,
  height: '1px',
  width: '100%',
  marginTop: '12px',
  backgroundColor: '#14141414',
});

export const StyledNoticeBodyBlock = styled('div', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '420px',
  padding: '12px 16px 16px',
});

export const StyledChartContainer = styled('div', {
  height: `300px`,
  maxWidth: '228px',
  display: 'flex',
  marginBottom: `8px`,
  borderTop: '1px solid #14141414',

  '@media (min-width: 1440px)': {
    maxWidth: '228px',
  },

  '@media (min-width: 1920px)': {
    maxWidth: '264px',
  },

  variants: {
    hasNoticeMessage: {
      true: {
        flex: 1,
        minHeight: 0,
        height: 'auto',
        width: '100%',
        maxWidth: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginBottom: 0,
        borderTop: 'none',
      },
    },

    variation: {
      export: {
        height: '380px',
        maxWidth: '312px',

        '@media (min-width: 1440px)': {
          maxWidth: '312px',
        },

        '@media (min-width: 1920px)': {
          maxWidth: '312px',
        },
      },
      innovation: {
        width: '100%',
        maxWidth: '100%',
        height: '200px',
        '@media (min-width: 1440px)': {
          maxWidth: '100%',
        },

        '@media (min-width: 1920px)': {
          maxWidth: '100%',
        },
      },
    },
  },

  compoundVariants: [
    {
      hasNoticeMessage: true,
      variation: 'export',
      css: {
        minHeight: '320px',
      },
    },
    {
      hasNoticeMessage: true,
      variation: 'innovation',
      css: {
        minHeight: '200px',
      },
    },
  ],
});

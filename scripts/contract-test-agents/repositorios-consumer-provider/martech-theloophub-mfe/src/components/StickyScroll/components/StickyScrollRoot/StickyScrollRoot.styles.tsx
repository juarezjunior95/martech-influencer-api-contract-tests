import { styled } from '@hexa-ui/theme';

export const StickyScrollRootStyles = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  position: 'sticky',
  top: '56px',
  padding: '24px 0 24px max(96px, 50% - 664px)',
  zIndex: 110,
  background: 'transparent',

  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(0deg, rgba(92, 72, 27, 0.04), rgba(92, 72, 27, 0.04)),
    linear-gradient(180deg, rgba(170, 106, 0, 0) 0%, rgba(195, 153, 85, 0.1) 100%),
    #FFFFFF`,
    backgroundAttachment: 'fixed',
    opacity: 0,
    transition: 'opacity 0.1s ease',
    zIndex: -1,
  },

  variants: {
    showBackground: {
      true: {
        '&::before': {
          opacity: 1,
        },
      },
    },
    isExportPage: {
      true: {
        paddingLeft: 'max(96px, 50% - 834px)',
      },
    },
    isResponsivePage: {
      true: {
        paddingLeft: 'max(80px, calc(40px + 50% - 548px))',

        '@media (min-width: 1440px)': {
          paddingLeft: 'max(80px, calc(40px + 50% - 628px))',
        },
        '@media (min-width: 1920px)': {
          paddingLeft: 'max(80px, calc(40px + 50% - 720px))',
        },
      },
    },
    isTabPage: {
      true: {
        paddingLeft: 'calc(max(96px, 50% - 664px) + 8px)',
      },
    },
    hiddenAll: {
      true: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    showContent: {
      false: {
        gap: 0,
      },
    },
  },

  // When `isTabPage` and `isResponsivePage` are both true, variants would override
  // each other on `paddingLeft`; this compound rule aligns the sticky filter with
  // responsive `StyledGridContainer` and keeps the +8px tab offset.
  compoundVariants: [
    {
      isTabPage: true,
      isResponsivePage: true,
      css: {
        paddingLeft: 'calc(max(80px, calc(40px + 50% - 548px)) + 8px)',

        '@media (min-width: 1440px)': {
          paddingLeft: 'calc(max(80px, calc(40px + 50% - 628px)) + 8px)',
        },

        '@media (min-width: 1920px)': {
          paddingLeft: 'calc(max(80px, calc(40px + 50% - 720px)) + 8px)',
        },
      },
    },
  ],
});

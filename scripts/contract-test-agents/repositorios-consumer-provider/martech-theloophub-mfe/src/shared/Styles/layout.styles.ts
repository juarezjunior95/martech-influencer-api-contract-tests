import { Grid } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledGridContainer = styled(Grid.Container, {
  width: '1328px !important',
  position: 'relative',
  left: 'max(96px, 50% - 664px)',
  paddingBottom: '2rem',
  margin: '0 !important',

  variants: {
    isExportPage: {
      true: {
        width: '1668px !important',
        position: 'relative',
        left: 'max(96px, 50% - 834px)',
      },
    },
    isResponsivePage: {
      true: {
        width: '1096px !important',
        position: 'relative',
        left: 'max(80px, calc(40px + 50% - 548px))',

        '@media (min-width: 1440px)': {
          width: '1256px !important',
          left: 'max(80px, calc(40px + 50% - 628px))',
        },
        '@media (min-width: 1920px)': {
          width: '1440px !important',
          left: 'max(80px, calc(40px + 50% - 720px))',
        },
      },
    },
  },
});

export const StyledHomeContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: 0,
  width: '100%',
});

export const StyledHomeHeaderContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const StyledSectionContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
  padding: '0 24px 24px 24px',
});

export const StyledGridItem = styled(Grid.Item, {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '0 !important',
});

export const StyledExpandableContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '1280px',
  minHeight: '196px',
  justifyContent: 'center',
  paddingBottom: '16px',

  variants: {
    isExportPage: {
      true: {
        maxWidth: '1668px',
        alignItems: 'start',
      },
    },
  },
});

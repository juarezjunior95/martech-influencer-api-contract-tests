import { styled } from '@hexa-ui/theme';

export const StyledBoxLink = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  paddingTop: '24px',
  justifyContent: 'flex-end',
  color: '$semanticInfoText',
  gap: '8px',
});

export const StyledGridLeagueContainer = styled('div', {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(2, 1fr)',
});

export const StyledGridCupContainer = styled('div', {
  marginTop: '24px',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '16px',
});

export const StyledPage = styled('div', {
  maxWidth: '1328px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  marginBottom: '32px',
});

export const SubtitleBox = styled('div', {
  width: 'fit-content',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '8px',
  marginBottom: '16px',
});

export const SubtitleText = styled('div', {
  fontFamily: '$heading',
  fontSize: '16px',
  fontWeight: '600',
  color: 'rgba(20, 20, 20, 0.56)',
});

export const TabsBox = styled('div', {
  width: 'fit-content',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
});

export const HeaderBox = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  variants: {
    space: {
      bottomMd: {
        marginBottom: '16px',
      },
      bottomLg: {
        marginBottom: '26px',
      },
      top: {
        marginTop: '24px',
      },
    },
  },
});

export const FlexContainer = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',

  variants: {
    align: {
      center: {
        alignItems: 'center',
        gap: '8px',
      },
    },
  },
});

export const BoxLink = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  paddingTop: '24px',
  justifyContent: 'flex-end',
});

export const FlexItem = styled('div', {
  variants: {
    qtdItems: {
      2: {
        width: '50%',
      },
      4: {
        width: '25%',
      },
    },
  },
});

export const TableContainer = styled('div', {
  maxWidth: '1280px',
  display: 'flex',
  gap: '16px',
  marginBottom: '16px',
});

export const StyledNoDataYetContainer = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '15rem',
});

export const StyledSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  position: 'relative',
});

import { styled } from '@hexa-ui/theme';

export const StyledLeaderBoardContainer = styled('div', {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: '8px',
});

export const StyledLeagueTitle = styled('div', {
  width: '100%',
  marginBottom: '4px',
  fontFamily: '$heading',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '24px',
  color: 'rgba(20, 20, 20, 0.56)',
});

export const StyledLeaderBoardItem = styled('div', {
  border: '1px solid  rgba(20, 20, 20, 0.12)',
  padding: '8px 16px',
  borderRadius: '8px',
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',

  variants: {
    position: {
      1: {
        order: '1',
      },
      2: {
        order: '2',
      },
      3: {
        order: '3',
      },
      4: {
        order: '4',
      },
      5: {
        order: '5',
      },
    },
  },
});

export const StyledLeaderCountryInfo = styled('div', {
  display: 'flex',
  width: 'fit-content',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '12px',
});

export const StyledBoxMedal = styled('div', {
  display: 'flex',
  width: '64px',
  height: '64px',
  alignItems: 'center',
  justifyContent: 'center',
});

export const StyledCountryName = styled('div', {
  fontSize: '16px',
  fontFamily: '$paragraph',
  fontWeight: '600',
  lineHeight: '20px',
  letterSpacing: '0',
  color: ' rgba(20, 20, 20, 1))',
});

export const StyledImage = styled('img', {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const StyledValue = styled('div', {
  padding: '4px 8px',
  fontFamily: '$paragraph',
  lineHeight: '18px',
  fontSize: '12px',
  letterSpacing: '0',
  fontWeight: '400',
  borderRadius: '4px',
  border: '1px solid rgba(20, 20, 20, 0.12)',

  variants: {
    color: {
      green: {
        background: 'rgba(230, 249, 230, 1)',
        color: 'rgba(0, 120, 0, 1)',
      },
      orange: {
        background: 'rgba(255, 249, 230, 1)',
        color: 'rgba(135, 106, 0, 1)',
      },
      red: {
        background: 'rgba(255, 230, 230, 1)',
        color: 'rgba(186, 11, 11, 1)',
      },
    },
  },
});

export const StyledImageBox = styled('div', {
  display: 'flex',
  width: '48px',
  height: '48px',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderRadius: '100%',
  background:
    'linear-gradient(216.66deg, rgba(233, 233, 233, 0.3) 0%, rgba(175, 175, 175, 0.3) 75%)',
});

export const StyledRankPosition = styled('div', {
  display: 'flex',
  width: '32px',
  height: '32px',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '2px',
  background:
    'linear-gradient(216.66deg, rgba(233, 233, 233, 0.3) 0%, rgba(175, 175, 175, 0.3) 75%)',
  fontFamily: '$paragraph',
  color: 'rgba(20, 20, 20, 1)',
  fontSize: '14px',
  fontWeight: '400',
});

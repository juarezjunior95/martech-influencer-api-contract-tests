import { styled } from '@hexa-ui/theme';

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

  variants: {
    position: {
      1: {
        background:
          'linear-gradient(216.66deg, rgba(238, 221, 37, 0.88) 0%, rgba(218, 165, 49, 0.88) 75%)',
      },
      2: {
        background:
          'linear-gradient(216.66deg, rgba(233, 233, 233, 0.88) 0%, rgba(175, 175, 175, 0.88) 75%)',
      },
      3: {
        background:
          'linear-gradient(216.66deg, rgba(252, 204, 142, 0.88) 0%, rgba(224, 135, 46, 0.88) 75%)',
      },
    },
  },
});

export const NumberPosition = styled('div', {
  position: 'absolute',
  height: '100%',
  top: '0',
  left: '0',
  width: '100%',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  paddingBottom: '16px',
  color: 'rgba(20, 20, 20, 1)',
  fontFamily: '$paragraph',
  fontSize: '14px',
});

export const MedalBoxItem = styled('div', {
  position: 'relative',
});

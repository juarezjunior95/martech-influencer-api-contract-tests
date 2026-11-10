import { styled } from '@hexa-ui/theme';

export const StyledCardsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
});

export const StyledSubPillarCardsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '16px',
  padding: '0 24px 24px 24px',
});

export const StyledSubPillarImage = styled('img', {
  border: 'none',
  borderRadius: 0,
  outline: 'none',
  display: 'block',
  height: '280px !important',
  maxWidth: '100%',
  objectFit: 'contain',

  '@media (min-width: 1440px)': {
    height: '302px !important',
  },
});

export const StyledSubPillarImageSmall = styled('img', {
  border: 'none',
  borderRadius: 0,
  outline: 'none',
  display: 'block',
  height: '268px !important',
  maxWidth: '100%',
  objectFit: 'contain',

  '@media (min-width: 1440px)': { height: '280px !important' },
});

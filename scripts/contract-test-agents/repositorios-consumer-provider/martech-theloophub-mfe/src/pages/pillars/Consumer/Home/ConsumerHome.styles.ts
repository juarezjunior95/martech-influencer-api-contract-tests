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

export const StyledCardImage = styled('img', {
  width: '100%',
  objectFit: 'cover',
});

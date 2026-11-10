import { styled } from '@hexa-ui/theme';

export const StyledSubPillarCardsGrid = styled('div', {
  display: 'grid',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: '1rem',
  padding: '0 24px 24px 24px',
  '& > *': {
    minWidth: 0,
  },
});

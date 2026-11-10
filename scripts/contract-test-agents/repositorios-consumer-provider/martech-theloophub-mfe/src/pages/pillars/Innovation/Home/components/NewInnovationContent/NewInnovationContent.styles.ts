import { styled } from '@hexa-ui/theme';

export const StyledNewInnovationKpiGrid = styled('div', {
  display: 'grid',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  alignItems: 'stretch',
  gap: '1rem',
  padding: '0 24px 24px 24px',
  '& > *': {
    minWidth: 0,
  },
});

export const StyledHowWeDoItHandoffSection = styled('div', {
  width: '100%',
  minWidth: 0,
  '& [data-testid="innovation-home-how-we-do-it-title"]': {
    color: '#141414',
  },
});

export const StyledHowWeDoItCardsGrid = styled('div', {
  display: 'grid',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  alignItems: 'stretch',
  gap: '1rem',
  padding: '0 24px 24px 24px',
  '& > *': {
    minWidth: 0,
    minHeight: 0,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
});

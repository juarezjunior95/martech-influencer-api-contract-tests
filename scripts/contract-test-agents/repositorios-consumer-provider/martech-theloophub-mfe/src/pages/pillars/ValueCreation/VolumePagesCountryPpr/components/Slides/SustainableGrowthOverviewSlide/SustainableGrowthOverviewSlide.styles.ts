import { styled } from '@hexa-ui/theme';

export const StyledSustainableGrowthSlideRoot = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '24px',
  width: '100%',
  marginTop: '24px',
  height: '790px',
});

export const StyledCardsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: '1rem',
});

export const StyledGrowthLeversGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '16px',
  width: '100%',
});

export const StyledStrategyDriversGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
  width: '100%',
});

export const StyledGrowthLeversContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

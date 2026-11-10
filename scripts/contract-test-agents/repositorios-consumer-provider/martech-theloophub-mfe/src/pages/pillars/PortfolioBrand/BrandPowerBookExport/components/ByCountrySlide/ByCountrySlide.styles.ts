import { styled } from '@hexa-ui/theme';

export const StyledByCountrySlideContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridTemplateAreas: `
    "bigNumber totalAbi totalAbi"
    "zones totalAbi totalAbi"
  `,
  gap: '16px',
});

export const StyledTablesContainer = styled('div', {
  gridArea: 'totalAbi',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
});

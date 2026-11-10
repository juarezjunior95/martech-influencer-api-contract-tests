import { styled } from '@hexa-ui/theme';

export const StyledComparisonLineContainer = styled('div', {
  padding: '16px 16px',
});

export const StyledBrandsGrid = styled('div', {
  display: 'grid',
  width: '100%',
  padding: '0 24px',
  boxSizing: 'border-box',
  gap: 16,
  alignItems: 'stretch',
  justifyItems: 'stretch',

  p: {
    margin: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
  },
});

export const StyledWaterfallContainer = styled('div', {
  height: '300px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

import { styled } from '@hexa-ui/theme';

export const StyledEvolutionSlideRoot = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'center',
  justifyContent: 'center',
  minHeight: '770px',
});

export const StyledEvolutionDivider = styled('div', {
  width: '1px',
  backgroundColor: '#14141429',
});

export const StyledSectionHeader = styled('div', {
  padding: '8px',
});

export const StyledFirstChartContainer = styled('div', {
  width: '410px',
  paddingBottom: '12px',
  display: 'flex',
  flexDirection: 'column',
});

export const StyledSecondChartContainer = styled('div', {
  width: '1210px',
  paddingRight: '12px',
  paddingBottom: '12px',
  display: 'flex',
  flexDirection: 'column',
});

export const StyledChartContainer = styled('div', {
  flex: 1,
  minHeight: '100px',
});

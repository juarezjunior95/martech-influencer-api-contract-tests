import { styled } from '@hexa-ui/theme';

export const StyledLineBarChartsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '3fr 1fr',
  paddingBottom: '0',
});

export const StyledChartContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  height: '286px',
});

export const StyledLegendContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  position: 'absolute',
  top: 8,
  right: 8,
});

export const StyledChartsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '0',
});

export const StyledLineBarChartsContainer = styled('div', {
  background: '#ffffff',
  width: '100%',
  border: '1px solid rgba(20, 20, 20, 0.16)',
  overflow: 'hidden',
  paddingBottom: '1rem',
});

export const StyledBodyContainer = styled('div', {
  padding: '0px 0px 24px 0px',
  position: 'relative',
});

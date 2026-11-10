import { styled } from '@hexa-ui/theme';

export const StyledNoDataContainer = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '284px',
  borderTop: '1px solid #e2e2e2',
});

export const StyledQuarterChartsContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'minmax(0px, 949px) minmax(0px, 360px)',
  paddingBottom: '16px',
  borderTop: '1px solid rgba(20, 20, 20, 0.12)',
});

export const StyledYearChartContainer = styled('div', {
  paddingBottom: '16px',
  borderTop: '1px solid rgba(20, 20, 20, 0.12)',
});

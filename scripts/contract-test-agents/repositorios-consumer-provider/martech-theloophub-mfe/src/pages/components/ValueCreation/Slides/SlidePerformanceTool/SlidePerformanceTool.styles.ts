import { styled } from '@hexa-ui/theme';

export const StyledSlidePerformanceToolRoot = styled('div', {
  height: '790px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '24px',
});

export const StyledSlidePerformanceToolBigNumberContainer = styled('div', {
  display: 'flex',
  gap: '16px',
  paddingTop: '16px',
});

export const StyledSlidePerformanceToolChartsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '0',
});

export const StyledSlidePerformanceToolLegendContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  position: 'absolute',
  top: 8,
  right: 8,
});

export const StyledSlidePerformanceToolLineChartContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const StyledSlidePerformanceToolChartContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  height: '490px',
});

export const StyledSlidePerformanceToolLineBarChartsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '3fr 1fr',
  paddingBottom: '0',
});

export const StyledSlidePerformanceToolBodyContainer = styled('div', {
  padding: '0px 0px 32px',
  position: 'relative',
  backgroundColor: 'white',
  borderRadius: '16px',
  border: '1px solid rgba(20, 20, 20, 0.08)',
});

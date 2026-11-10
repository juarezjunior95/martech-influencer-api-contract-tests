import { styled } from '@hexa-ui/theme';

export const StyledBarChartBaseContainer = styled('div', {
  width: '100%',
  height: '100%',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #1414141f',
  paddingBottom: '16px',
  position: 'relative',
});

export const StyledBarChartSectionHeaderWrapper = styled('div', {
  width: '100%',
  padding: '4px',
  display: 'flex',
});

export const StyledBarChartSlideGrid = styled('div', {
  display: 'flex',
  marginTop: '16px',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
});

import { styled } from '@hexa-ui/theme';
import { theme } from 'theme';

export const StyledContainer = styled('div', {
  width: '100%',
  height: '392px',
  display: 'grid',
  paddingBottom: '12px',
  gridTemplateColumns: 'minmax(0, 100%)',

  variants: {
    isExport: {
      true: {
        height: '630px',
      },
    },
  },
});

export const StyledContent = styled('div', {
  height: '100%',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const StyledChartWrapper = styled('div', {
  width: '100%',
  height: '100%',
});

export const StyledLegend = styled('div', {
  display: 'flex',
  gap: '12px',
  marginBottom: '24px',
  padding: '8px 0',
});

export const StyledLegendItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const StyledLegendColor = styled('div', {
  width: '24px',
  height: '12px',
  borderRadius: '4px',
});

export const StyledLegendLabel = styled('span', {
  fontFamily: "'Barlow', sans-serif",
  fontSize: '16px',
  fontWeight: 600,
  color: theme.colors.txt.default,
});

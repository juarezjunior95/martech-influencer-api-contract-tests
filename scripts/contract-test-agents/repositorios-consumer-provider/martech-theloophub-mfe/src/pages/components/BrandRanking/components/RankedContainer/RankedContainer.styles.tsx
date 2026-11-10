import { styled } from '@hexa-ui/theme';
import { theme } from 'theme';

const defaultTheme = {
  colors: {
    txt: {
      default: theme?.colors?.txt?.default || '#000000',
      secondary: theme?.colors?.txt?.secondary || '#666666',
    },
  },
};

export const StyledContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  '.c-leXOSy:nth-of-type(2)': {
    width: '100% !important',
    marginBottom: '0 !important',
  },
});

export const StyledHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  paddingBottom: '16px',
});

export const StyledTitleRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const StyledTitle = styled('h2', {
  fontFamily: 'Barlow, sans-serif',
  fontSize: '20px',
  fontWeight: '500',
  color: theme?.colors?.txt?.default || defaultTheme.colors.txt.default,
  margin: '0',
});

export const StyledSubtitle = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const StyledSubtitleText = styled('span', {
  fontFamily: 'Barlow, sans-serif',
  fontSize: '16px',
  color: theme?.colors?.txt?.default || defaultTheme.colors.txt.default,
});

export const StyledMeasure = styled('span', {
  fontFamily: 'Barlow, sans-serif',
  fontSize: '12px',
  fontWeight: '600',
  lineHeight: '16px',
  letterSpacing: '0px',
  verticalAlign: 'middle',
  color: theme?.colors?.txt?.secondary || defaultTheme.colors.txt.secondary,
});

export const StyledChartWrapper = styled('div', {
  width: '100%',
});

export const StyledVariationWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  gap: '12px',
  fontSize: '12px',
  width: '100%',
  marginTop: '0',
  padding: '0',
});

export const StyledLegend = styled('div', {
  display: 'flex',
  gap: '24px',
  marginTop: '8px',
});

export const StyledLegendItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const StyledLegendColor = styled('div', {
  width: '16px',
  height: '16px',
  borderRadius: '4px',
});

export const StyledLegendLabel = styled('span', {
  fontFamily: 'Barlow, sans-serif',
  fontSize: '12px',
  color: theme?.colors?.txt?.default || defaultTheme.colors.txt.default,
  fontWeight: '500',
});

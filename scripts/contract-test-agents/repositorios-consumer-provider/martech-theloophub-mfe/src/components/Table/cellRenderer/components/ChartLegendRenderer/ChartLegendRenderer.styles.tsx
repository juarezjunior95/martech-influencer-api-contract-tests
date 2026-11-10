import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$4',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
});

export const StyledLegendItem = styled('div', {
  display: 'flex',
  alignItems: 'baseline',
  gap: '$1',
  fontFamily: '$heading',
});

export const StyledColorBox = styled('div', {
  width: '16px',
  height: '8px',
  borderRadius: '1px',
  border: `1px solid ${tokens.color.foundation.border.secondary}`,
});

export const StyledLegendGroup = styled('div', {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
});

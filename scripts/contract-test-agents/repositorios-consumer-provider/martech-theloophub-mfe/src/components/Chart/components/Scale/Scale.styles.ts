import { styled } from '@hexa-ui/theme';
import { theme } from 'theme';

export const StyledScaleContainer = styled('div', {
  position: 'absolute',
  width: '42px',
  background: 'white',
  zIndex: 100,
});

export const StyledScale = styled('div', {
  display: 'flex',
  flexDirection: 'column-reverse',
  justifyContent: 'space-between',
  backgroundColor: '#ffffff',
  height: '100%',
  minWidth: 42,
  fontSize: 12,
  color: '#1414148F',
  position: 'absolute',
  fontWeight: 'normal',
  fontFamily: "'Work Sans', sans-serif",
  textAlign: 'right',
  borderRight: `1px solid ${theme.colors.charts.border.neutrals[40]}`,
  paddingRight: '10px',
});

export const StyledScaleItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
});

export const StyledScaleItemLine = styled('span', {
  position: 'absolute',
  left: '100%',
  top: '50%',
  width: '8px',
  borderTop: `1px solid #e2e7ea`,
  transform: 'translateY(-50%) translateX(2px)',
  zIndex: 1,
});

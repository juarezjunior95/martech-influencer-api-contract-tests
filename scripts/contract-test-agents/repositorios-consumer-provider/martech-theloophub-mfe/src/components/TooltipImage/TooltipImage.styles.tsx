import { styled } from '@hexa-ui/theme';

export const StyledTooltipContainer = styled('div', {
  background: '#141414',
  color: '#ffffff',
  padding: '0 8px',
  borderRadius: '$2',
  fontSize: '$1',
  fontFamily: '$paragraph',
  fontWeight: 'normal',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  minHeight: '32px',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: '8px solid #141414',
  },
});

export const StyledImage = styled('img', {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

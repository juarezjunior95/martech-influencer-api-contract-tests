import { styled } from '@hexa-ui/theme';

export const StyledBarYContainer = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  gap: '16px',
  flexDirection: 'column',
  justifyContent: 'center',
});

export const BarWrapper = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  position: 'relative',
});

export const BarContainer = styled('div', {
  backgroundColor: '$colorBrandSecondary',
  borderTopRightRadius: '4px',
  borderBottomRightRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  minWidth: '1px',
  transition: 'width 0.3s ease',
});

export const BarLabel = styled('span', {
  fontSize: '12px',
  lineHeight: '12px',
  fontFamily: "'Work Sans', sans-serif",
  fontWeight: 'normal',
  color: '$colorTextDefault',
  whiteSpace: 'nowrap',
  userSelect: 'none',

  variants: {
    position: {
      inside: {
        color: '$colorTextDefault',
      },
      outside: {
        color: '$colorTextDefault',
        marginLeft: '8px',
      },
    },
  },
});

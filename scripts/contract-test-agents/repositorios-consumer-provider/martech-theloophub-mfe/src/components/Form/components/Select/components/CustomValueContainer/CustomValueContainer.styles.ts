import { styled } from '@hexa-ui/theme';

export const StyledMoreCount = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#1414141a',
  color: '#141414',
  fontSize: '14px',
  fontWeight: 500,
  borderRadius: '512px',
  padding: '8px 12px',
  margin: '2px 4px',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',

  variants: {
    variant: {
      allSelected: {
        backgroundColor: '#FFF1C2',
        color: '#141414',
      },
    },
  },
});

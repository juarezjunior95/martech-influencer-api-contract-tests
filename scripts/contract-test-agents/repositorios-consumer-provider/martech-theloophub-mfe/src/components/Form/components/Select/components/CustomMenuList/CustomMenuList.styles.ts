import { styled } from '@hexa-ui/theme';

export const StyledSearchOption = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 12px',
  margin: '0 -4px 8px -2px',
  backgroundColor: '#ffffff',
  minHeight: '48px',
  cursor: 'text',
  fontFamily: 'Work Sans',
  borderBottom: '1px solid #14141414',
  boxShadow: 'none',
  borderRadius: '0',

  input: {
    color: '#141414',

    '&::placeholder': {
      color: '#9ca3af',
    },
  },

  svg: {
    color: '#5c5c5c',
    width: '24px',
    height: '24px',
  },

  variants: {
    isInputFocused: {
      true: {
        svg: { color: '#006edb' },
      },
    },
  },
});

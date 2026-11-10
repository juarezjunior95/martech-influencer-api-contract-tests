import { styled } from '@hexa-ui/theme';

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  margin: '0 auto',
});

export const ValueContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  flex: 1,
});

export const MultiValueRemove = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#141414',
  backgroundColor: 'white',
  borderRadius: '50%',
  width: '16px',
  height: '16px',

  '&:hover': {
    color: '#141414',
    backgroundColor: 'white',
  },

  svg: {
    width: '10px',
    height: '10px',
  },
});

export const StyledChips = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff1c2',
  borderRadius: '512px',
  margin: '2px 4px',
  padding: '8px 12px',
  gap: '4px',

  variants: {
    size: {
      small: {
        height: '24px',
      },
      medium: {
        height: '30px',
      },
      large: {
        height: '40px',
      },
    },

    disabled: {
      true: {
        backgroundColor: '#ffffff',
        borderColor: '#14141429',
      },
    },
  },
  '&:hover': {
    backgroundColor: '##fff8e0',
  },
});

export const StyledChipsPlaceholder = styled('div', {
  width: '16px',
  height: '16px',
  fontSize: '14px',

  variants: {
    size: {
      small: {
        fontSize: '14px',
      },
      medium: {
        fontSize: '16px',
      },
      large: {
        fontSize: '16px',
      },
    },
  },
});

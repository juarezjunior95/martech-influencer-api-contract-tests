import { Button } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const ActionButtonStyled = styled(Button, {
  '&&': {
    borderRadius: '512px',
    color: '#006edb',
    border: 'none',
    outline: '1px solid',
    fontWeight: '400',
    lineHeight: '20px',
    padding: '4px 8px',
    fontSize: '14px',
    height: 'min-content',
    borderWidth: '1px',
    textWrap: 'nowrap',
    backgroundColor: '#fff',
    boxShadow: 'none',
  },

  variants: {
    alertType: {
      AI: {
        '&&': {
          color: '#006edb',
          '&:hover': {
            outlineColor: '#a1d0ff',
            backgroundColor: '#fff',
          },
          '&:active': {
            backgroundColor: '#006edb',
            outlineColor: '#006edb',
            color: '#fff',
          },
        },
      },
      info: {
        '&&': {
          color: '#006edb',
          '&:hover': {
            outlineColor: '#a1d0ff',
            backgroundColor: '#fff',
          },
          '&:active': {
            backgroundColor: '#006edb',
            outlineColor: '#006edb',
            color: '#fff',
          },
        },
      },
      success: {
        '&&': {
          color: '#009900',
          '&:hover': {
            outlineColor: '#99e699',
            backgroundColor: '#fff',
          },
          '&:active': {
            outlineColor: '#99e699',
            backgroundColor: '#009900',
            color: '#fff',
          },
        },
      },
      warning: {
        '&&': {
          color: '#d47300',
          '&:hover': {
            outlineColor: '#ffd499',
            backgroundColor: '#fff',
          },
          '&:active': {
            outlineColor: '#ffd499',
            backgroundColor: '#d47300',
            color: '#fff',
          },
        },
      },
      error: {
        '&&': {
          color: '#d62222',
          '&:hover': {
            outlineColor: '#fca5a5',
            backgroundColor: '#fff',
          },
          '&:active': {
            outlineColor: '#fca5a5',
            backgroundColor: '#d62222',
            color: '#fff',
          },
        },
      },
      neutral: {
        '&&': {
          color: '#141414',
          '&:hover': {
            outlineColor: '#14141429',
            backgroundColor: '#fff',
          },
          '&:active': {
            outlineColor: '#14141429',
            backgroundColor: '#141414',
            color: '#fff',
          },
        },
      },
    },
  },
});

ActionButtonStyled.defaultProps = {
  variant: 'secondary',
};

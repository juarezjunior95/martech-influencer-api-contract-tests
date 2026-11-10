import { components } from 'react-select';

import { styled } from '@hexa-ui/theme';

export const StyledCustomOption = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  height: '100%',

  variants: {
    isDisabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
  },
});

export const StyledCheckInput = styled('div', {
  height: '20px',
  width: '20px',
  minHeight: '20px',
  minWidth: '20px',
  maxHeight: '20px',
  maxWidth: '20px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #b8b8b8',
  borderRadius: '4px',
  marginLeft: 'auto',
  boxSizing: 'border-box',

  '&:hover:not([data-disabled="true"])': {
    border: '2px solid #E5B611',
  },

  variants: {
    checked: {
      none: {
        backgroundColor: 'transparent',
        borderColor: '#b8b8b8',
      },
      selected: {
        backgroundColor: '#E5B611',
        borderColor: '#E5B611',
      },
    },
    isDisabled: {
      true: {
        opacity: 0.5,
        backgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0',

        '&:hover': {
          borderColor: '#e0e0e0',
        },
      },
    },
    error: {
      true: {
        borderColor: '#D62222',

        '&:hover': {
          borderColor: '#D62222',
        },
      },
    },
  },

  compoundVariants: [
    {
      checked: 'selected',
      isDisabled: true,
      css: {
        backgroundColor: '#c0c0c0',
        borderColor: '#e1e1e1',
      },
    },
  ],
});

export const StyledCustomReactSelectOption = styled(components.Option, {
  [`&:hover ${StyledCheckInput}:not([data-disabled="true"])`]: {
    border: '2px solid #E5B611',
  },
});

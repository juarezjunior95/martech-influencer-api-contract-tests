import { Button } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledButton = styled(Button, {
  borderRadius: '50%',

  variants: {
    disabled: {
      true: {
        opacity: '0.5',
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
    isExpanded: {
      true: {
        transform: 'rotate(180deg)',
      },
    },

    size: {
      small: {
        width: '32px',
        height: '32px',
        maxWidth: '32px',
        maxHeight: '32px',
        minWidth: '32px',
      },
      medium: {
        width: '48px',
        height: '48px',
        maxWidth: '48px',
        maxHeight: '48px',
        minWidth: '48px',
      },
      large: {
        width: '56px',
        height: '56px',
        maxWidth: '56px',
        maxHeight: '56px',
        minWidth: '56px',
      },
    },
  },
});

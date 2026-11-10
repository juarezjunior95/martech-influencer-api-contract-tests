import { Button } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledButton = styled(Button, {
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  minWidth: '40px',

  variants: {
    isExpanded: {
      true: {
        transform: 'rotate(180deg)',
      },
    },
  },
});

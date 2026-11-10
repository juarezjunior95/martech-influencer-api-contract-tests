import { Button } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledExpand = styled(Button, {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '40px',
  minWidth: '40px',
  height: '40px',
  maxHeight: '40px',
  borderRadius: '50%',
  border: `1px solid #141414`,
  cursor: 'pointer',
  background: 'white',

  ':active svg': {
    color: '#14141466',
  },

  variants: {
    disabledState: {
      false: {},
      true: {
        border: `1px solid #141414 !important`,
        background: 'white !important',
        opacity: 0.5,
        pointerEvents: 'none',
      },
    },
  },
});

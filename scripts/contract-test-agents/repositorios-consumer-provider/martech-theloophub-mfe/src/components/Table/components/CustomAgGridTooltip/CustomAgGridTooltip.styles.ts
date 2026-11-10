import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledCustomAgGridTooltip = styled('div', {
  padding: '1rem',
  borderRadius: '16px',
  boxShadow: tokens.shadow.elevation[2],
  position: 'relative',

  variants: {
    darkMode: {
      true: {
        background: '#141414',
        color: '#ffffff',
        padding: '0.5rem',
        borderRadius: '0.5rem',

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
      },
      false: {
        background: '#ffffff',
        color: '#141414',

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
          borderBottom: '8px solid #ffffff',
        },
      },
    },
  },
});

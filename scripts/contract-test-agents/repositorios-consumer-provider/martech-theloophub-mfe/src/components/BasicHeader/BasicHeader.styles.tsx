import { Heading } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledBasicHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  '.title': {
    marginRight: '8px',
  },
  marginBottom: '16px',
});

export const StyledSubtitle = styled(Heading, {
  marginRight: '8px',
  variants: {
    color: {
      black: {
        color: '$black',
      },
      grey: {
        color: tokens.color.foundation.txt.secondary,
      },
    },
  },
});

import { styled } from '@hexa-ui/theme';

export const StyledContainer = styled('div', {
  display: 'flex',
  variants: {
    gap: {
      8: { gap: '8px' },
      16: { gap: '16px' },
    },
  },
});

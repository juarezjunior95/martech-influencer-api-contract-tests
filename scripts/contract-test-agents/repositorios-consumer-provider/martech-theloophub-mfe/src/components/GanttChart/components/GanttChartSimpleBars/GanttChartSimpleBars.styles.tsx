import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';
import { theme } from 'theme';

export const StyledSimpleBars = styled('div', {
  flex: 1,
  borderRight: `1px solid ${tokens.color.foundation.border.tertiary}`,
  minHeight: '36px',
  variants: {
    weekDelimiter: {
      true: {
        borderRight: `1px solid ${theme.colors.charts.border.neutrals[40]}`,
      },
    },
  },
});

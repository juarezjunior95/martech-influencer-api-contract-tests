import { EmptyState } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import { theme } from 'theme';

export const StyledEmptyState = styled(EmptyState.PageLevel, {
  width: '230px',
  color: theme.colors.txt.secondary,
  maxWidth: '100%',

  h2: {
    fontSize: '16px',
  },

  p: {
    fontSize: '12px',
    color: '#1414148F',
  },

  variants: {
    font: {
      small: {
        fontSize: '$2',
      },
      basis: {
        fontSize: '$3',
      },
      large: {
        fontSize: '$4',
      },
    },

    color: {
      primary: {
        color: theme.colors.txt.default,
      },
      secondary: {
        color: theme.colors.txt.secondary,
      },
    },

    size: {
      auto: {
        width: 'auto',
        p: { width: 'auto' },
      },
    },
  },
  defaultVariants: {
    font: 'basis',
    color: 'secondary',
  },
});

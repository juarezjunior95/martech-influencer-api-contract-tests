import { Card } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import { theme } from 'theme';

export const StyledItemCard = styled(Card, {
  position: 'relative',
  borderRadius: '$4',
  minHeight: '56px',
  minWidth: '250px',
  maxWidth: '250px',
  flex: 1,
  border: `1px solid rgba(0, 0, 0, 0.1)`,
  overflow: 'hidden',

  '&.expanded': {
    maxWidth: 'none',
  },

  variants: {
    hide: {
      true: {
        display: 'none',
      },
    },
    cardBorder: {
      none: {
        border: 'none',
      },
    },
    minWidth: {
      '250': {
        minWidth: '250px',
      },
      '276': {
        minWidth: '276px',
      },
      '304': {
        minWidth: '304px',
      },
      '309': {
        minWidth: '309px',
      },
      '311': {
        minWidth: '311px',
      },
      '400': {
        minWidth: '400px',
      },
    },
  },
});

export const StyledItemHeaderContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  gap: '$4',
  padding: '$4',
  height: 'min-content',
  borderBottom: `1px solid ${theme.colors.charts.border.neutrals[20]}`,

  '&.paddingRight': {
    paddingRight: '$8',
  },

  variants: {
    isExpanded: {
      true: {
        alignItems: 'center',
      },
    },
    borderBottom: {
      hidden: {
        borderBottom: '1px solid transparent',
      },
    },
  },
});

export const StyledItemButtomContainer = styled('div', {
  position: 'absolute',
  top: '16px',
  right: '16px',
  maxWidth: '40px',

  button: {
    maxWidth: '40px !important',
    minWidth: '40px !important',
  },

  variants: {
    isExpanded: {
      true: {
        top: '50%',
        transform: 'translateY(-50%)',
      },
    },
  },
});

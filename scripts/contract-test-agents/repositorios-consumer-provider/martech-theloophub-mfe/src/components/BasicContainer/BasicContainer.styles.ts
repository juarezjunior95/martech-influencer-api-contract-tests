import { styled, theme } from '@hexa-ui/theme';

export const StyledBasicContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '$4',

  scrollbarColor: 'initial',

  variants: {
    border: {
      none: {
        border: 'none',
      },
      small: {
        border: '1px solid rgba(20, 20, 20, 0.12)',
      },
      gray: {
        border: '1px solid rgba(20, 20, 20, 0.08)',
      },
    },
    borderRadius: {
      none: {
        borderRadius: '0',
      },
      small: {
        borderRadius: '$1',
      },
      medium: {
        borderRadius: '$2',
      },
      large: {
        borderRadius: '$4',
      },
    },
    shadow: {
      none: {
        boxShadow: 'none',
      },
      small: {
        boxShadow: theme.shadows[1],
      },
      medium: {
        boxShadow: theme.shadows[2],
      },
      large: {
        boxShadow: theme.shadows[4],
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
      false: {},
    },
  },
});

export const StyledHeaderline = styled('div', {
  display: 'flex',
  gap: '$1',
  flexDirection: 'column',
});
export const StyledBasicContainerHeaderContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
});

export const StyledBasicContainerHeaderColumn = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

export const StyledBasicContainerHeaderRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '8px',
});

export const StyledBasicContainerTags = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
});

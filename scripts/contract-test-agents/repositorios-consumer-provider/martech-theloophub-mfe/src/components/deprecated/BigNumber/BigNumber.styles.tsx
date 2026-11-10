import { Card, Divider, Heading } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import { theme } from 'theme';

export const StyledBigNumberCard = styled(Card, {
  maxHeight: '168px',
  border: '1px solid #e2e2e2',
  boxShadow: 'none !important',

  variants: {
    hasPin: {
      true: {
        '&:hover': {
          cursor: 'pointer',
          boxShadow: '0px 0px 16px 0px #00000029 !important',
        },

        '&:focus': {
          border: '1px solid #006EDB',
        },
        '&:active': {
          border: '1px solid #006EDB',
        },
      },
      false: {},
    },
    isPinned: {
      true: {
        border: '2px solid #006EDB',
      },
      false: {},
    },
  },
});

export const StyledBigNumberContainer = styled('div', {
  display: 'flex',
  gap: '0.5rem',
  width: '100%',
});

export const StyledBigNumberContent = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',

  variants: {
    gap: {
      sm: {
        gap: '$1',
      },
      xs: {
        gap: '2px',
      },
      default: {
        gap: '$2',
      },
    },
  },
});

export const StyledBigNumberLine = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  columnGap: '$1',
  alignItems: 'center',
  variants: {
    borderTop: {
      true: {
        borderTop: '1px solid #1414141F',
      },
      false: {
        borderTop: 'none',
      },
    },
    marginTop: {
      none: {
        marginTop: '0px',
      },
      small: {
        marginTop: '4px',
      },
    },
  },
});

export const StyledBigNumberTitleSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
});

export const StyledBigNumberTitle = styled(Heading, {
  fontWeight: 'bold',
  height: 'auto',
  fontFamily: '$heading',
  color: '$interfaceLabelPrimary',

  '&.title-color--green': {
    color: theme.colors.charts.txt.status.increase,
  },
  '&.title-color--red': {
    color: theme.colors.charts.txt.status.decrease,
  },
});

export const StyledBigNumberText = styled('p', {
  fontSize: '1rem',
  color: '$interfaceLabelPrimary',
  margin: 0,
  fontFamily: '$paragraph',
  variants: {
    size: {
      xsmall: {
        fontSize: '0.625rem !important',
      },
      smallest: {
        fontSize: '0.75rem !important',
      },
      small: {
        fontSize: '0.875rem !important',
      },
      medium: {
        fontSize: '1rem !important',
      },
      large: {
        fontSize: '1.25rem !important',
      },
    },

    color: {
      gray: {
        color: '$interfaceLabelSecondary',
      },
      green: {
        color: theme.colors.charts.txt.status.increase,
      },
      red: {
        color: theme.colors.charts.txt.status.decrease,
      },
      black: {
        color: '$interfaceLabelPrimary',
      },
    },

    weight: {
      light: {
        fontWeight: 'light',
      },
      regular: {
        fontWeight: 'regular',
      },
      bold: {
        fontWeight: 'bold',
      },
      medium: {
        fontWeight: '500',
      },
    },
  },
});

export const StyledBigNumberVariationContainer = styled('span', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '80%',
});

export const StyledBigNumberNoDataYet = styled('span', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  justifyContent: 'center',
  alignItems: 'center',
});

export const StyledBigNumberDivider = styled(Divider, {
  margin: '0 0.25rem',
});

export const StyledBigNumber = styled('span', {
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: '$text',
});

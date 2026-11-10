import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledAppContainer = styled('div', {
  position: 'relative',
  background: `linear-gradient(0deg, rgba(92, 72, 27, 0.04), rgba(92, 72, 27, 0.04)),
  linear-gradient(180deg, rgba(170, 106, 0, 0) 0%, rgba(195, 153, 85, 0.1) 100%),
  #FFFFFF`,
  minHeight: 'calc(100vh - 56px)',
});

export const StyledContent = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '24px',
});

export const StyledPaddingContent = styled('div', {
  padding: '24px',
  variants: {
    noPaddingTop: {
      true: {
        paddingTop: '0',
      },
    },
  },
});

export const StyledHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0 16px',
  padding: '20px 24px',
  background: 'white',
  borderRadius: '16px 16px 0 0',

  variants: {
    bottomSeparator: {
      none: {},
      border: {
        borderBottom: '1px solid #1414141F',
      },
      margin: {
        borderRadius: '16px',
        boxShadow: tokens.shadow.elevation[1],
        marginBottom: '16px',
      },
    },

    topSepatator: {
      none: {},
      border: {
        borderTop: '1px solid #1414141F',
        borderRadius: '0px',
      },
    },

    fixedHeaderHeight: {
      true: {
        minHeight: '85px',
      },
    },

    padding: {
      none: {
        padding: '0',
      },
      small: {
        padding: '16px 18px',
      },
      medium: {
        padding: '20px 24px',
      },
      large: {
        padding: '26px 24px',
      },
    },

    borderRadius: {
      none: {
        borderRadius: '0',
      },
      small: {
        borderRadius: '$1 $1 0 0',
      },
      medium: {
        borderRadius: '$2 $2 0 0',
      },
      large: {
        borderRadius: '$4 $4 0 0',
      },
    },
  },
});

export const StyledRowContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  variants: {
    marginBottom: {
      none: { marginBottom: '0' },
      sm: { marginBottom: '8px' },
      md: { marginBottom: '16px' },
      lg: { marginBottom: '24px' },
    },
    marginTop: {
      none: { marginTop: '0' },
      sm: { marginTop: '8px' },
      md: { marginTop: '16px' },
      lg: { marginTop: '24px' },
    },
    paddingBottom: {
      none: { paddingBottom: '0' },
      sm: { paddingBottom: '8px' },
      md: { paddingBottom: '16px' },
      lg: { paddingBottom: '24px' },
    },
    paddingTop: {
      none: { paddingTop: '0' },
      sm: { paddingTop: '8px' },
      md: { paddingTop: '16px' },
      lg: { paddingTop: '24px' },
    },
  },

  defaultVariants: {
    marginBottom: 'none',
    marginTop: 'none',
    paddingBottom: 'none',
    paddingTop: 'none',
  },
});

export const StyledMultiChartContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns:
    'minmax(0px, 250px) minmax(0px, 798px) minmax(0px, 232px)',
  paddingBottom: '8px',

  variants: {
    isExportPage: {
      true: {
        gridTemplateColumns: '370px 880px 370px',
      },
    },
    quantity: {
      1: {
        gridTemplateColumns: '1fr',
        paddingBottom: '0',
      },
      2: {
        gridTemplateColumns: '1fr 2.2fr',
        paddingBottom: '0',
      },
      3: {
        gridTemplateColumns: '1fr 1.8fr 1fr',
        paddingBottom: '0',
      },
    },
    type: {
      2: {
        gridTemplateColumns: '249px 1012px',
        paddingBottom: '0',
      },
    },
  },
});

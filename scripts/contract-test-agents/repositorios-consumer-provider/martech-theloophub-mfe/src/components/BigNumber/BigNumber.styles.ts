import { Card, Heading } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledBigNumberCard = styled(Card, {
  border: '1px solid #1414141f',
  boxShadow: 'none !important',
  transition: 'background-color 300ms ease-out, transform 300ms ease-out',
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',

  variants: {
    clickeable: {
      false: {},
      true: {
        cursor: 'pointer',
        '&:hover': {
          background:
            'linear-gradient(0deg, rgba(229, 182, 17, 0.04) 0%, rgba(229, 182, 17, 0.04) 100%), var(--color-bg-surface_primary, #FFF)',
          boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.16) !important',
          transform: 'scale(1.02)',
          zIndex: 11,
        },

        '&.selected': {
          border: '2px solid transparent',
          borderRadius: '1rem',
          background: `
            linear-gradient(#fefcf5, #fefcf5) padding-box,
            linear-gradient(216.66deg, #F5E003 0%, #D3A238 75%) border-box
          `,
          margin: -1,
          zIndex: 10,
        },
      },
    },
    fullWidth: {
      true: {
        flex: '1',
      },
      false: {},
    },
  },
});

export const StyledBigNumberContentHeader = styled('div', {
  variants: {
    orientation: {
      vertical: {},
      horizontal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
      },
      none: {},
      center: {},
    },
  },
});

export const StyledBigNumberContentBody = styled('div', {
  variants: {
    orientation: {
      vertical: {
        height: '100%',
      },
      horizontal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
      },
      none: {},
      center: {},
    },
  },
});

export const StyledBigNumberContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '16px',
  height: '100%',
  transition: 'background-color 300ms ease-out, transform 300ms ease-out',

  variants: {
    orientation: {
      vertical: {
        flexDirection: 'column',
        padding: '16px',
      },
      horizontal: {
        flexDirection: 'row',
        padding: '0',
      },
      none: {
        padding: '0',
      },
      center: {},
    },
    clickeable: {
      false: {},
      true: {
        cursor: 'pointer',
        '&.selected': {
          borderRadius: '1rem',
          background:
            'linear-gradient(0deg, rgba(229, 182, 17, 0.04) 0%, rgba(229, 182, 17, 0.04) 100%), var(--color-bg-surface_primary, #FFF)',
        },
      },
    },
    spacing: {
      cozy: {
        gap: '4px',
      },
      loose: {},
    },
  },
});

export const StyledBigNumber = styled(Heading, {
  fontWeight: 'bold',
  margin: 0,

  variants: {
    size: {
      xxsmall: {
        fontSize: '20px !important',
        lineHeight: '20px',
      },
      xsmall: {
        fontSize: '24px !important',
        lineHeight: '24px',
      },
      small: {
        fontSize: '32px !important',
        lineHeight: '32px',
      },
      medium: {
        fontSize: '40px !important',
        lineHeight: '40px !important',
      },
      large: {
        fontSize: '56px !important',
        lineHeight: '56px !important',
      },
    },
    truncatable: {
      true: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
    },
  },
});

export const StyledBigNumberWithSuffix = styled('div', {
  display: 'flex',
  alignItems: 'baseline',
  minWidth: 0,
});

export const StyledBigNumberSuffix = styled(Heading, {
  fontWeight: 'bold',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  margin: 0,

  variants: {
    size: {
      xxsmall: {
        fontSize: '20px !important',
        lineHeight: '20px',
      },
      xsmall: {
        fontSize: '24px !important',
        lineHeight: '24px',
      },
      small: {
        fontSize: '32px !important',
        lineHeight: '32px',
      },
      medium: {
        fontSize: '40px !important',
        lineHeight: '40px !important',
      },
      large: {
        fontSize: '56px !important',
        lineHeight: '56px !important',
      },
    },
  },
});

export const StyledTitle = styled(Heading, {
  fontSize: '16px !important',
  lineHeight: '16px !important',
  color: '#141414',
  margin: 0,
});

export const StyledMeasure = styled('span', {
  fontFamily: '$paragraph',
  fontSize: '12px',
  lineHeight: '12px',

  variants: {
    size: {
      xxsmall: {
        fontSize: '10px',
        lineHeight: '10px',
      },
      xsmall: {
        fontSize: '10px',
        lineHeight: '10px',
      },
      small: {
        fontSize: '12px',
        lineHeight: '12px',
      },
      medium: {
        fontSize: '14px',
        lineHeight: '14px',
      },
      large: {
        fontSize: '14px',
        lineHeight: '14px',
      },
    },
  },
});

export const StyledComparison = styled('span', {
  fontFamily: '$paragraph',
  fontSize: '12px',
  margin: 0,
  color: '#5C5C5C',
  'text-wrap': 'nowrap',

  variants: {
    size: {
      xxsmall: {
        fontSize: '10px',
        lineHeight: '10px',
      },
      xsmall: {
        fontSize: '10px',
        lineHeight: '10px',
      },
      small: {
        fontSize: '12px',
      },
      medium: {
        fontSize: '14px',
      },
      large: {
        fontSize: '16px',
      },
    },
  },
});

export const StyledComparisonNumber = styled(Heading, {
  fontWeight: 'bold',
  margin: 0,

  variants: {
    size: {
      xxsmall: {
        fontSize: '12px',
        lineHeight: '12px',
      },
      xsmall: {
        fontSize: '14px',
        lineHeight: '14px',
      },
      small: {
        fontSize: '16px !important',
        lineHeight: '16px',
      },
      medium: {
        fontSize: '16px !important',
        lineHeight: '16px !important',
      },
      large: {
        fontSize: '18px !important',
        lineHeight: '18px !important',
      },
    },
  },
});

export const StyledSecondaryValue = styled('p', {
  fontFamily: '$paragraph',
  fontSize: '14px',
  fontWeight: '500',
  margin: 0,
  color: '#5C5C5C',

  variants: {
    size: {
      xxsmall: {
        fontSize: '12px',
        lineHeight: '12px',
      },
      xsmall: {
        fontSize: '12px',
        lineHeight: '12px',
      },
      small: {
        fontSize: '14px',
        lineHeight: '14px',
      },
      medium: {
        fontSize: '16px',
        lineHeight: '16px',
      },
      large: {
        fontSize: '16px',
        lineHeight: '16px',
      },
    },
  },
});

export const StyledPeriodLabel = styled('span', {
  fontFamily: '$paragraph',
  fontSize: '12px',
  margin: 0,
});

export const StyledPeriodValue = styled('span', {
  fontFamily: '$paragraph',
  fontSize: '12px',
  fontWeight: '500',
  margin: 0,
});

export const StyledDivider = styled('div', {
  width: '1px',
  minHeight: '100%',
  background: '#14141414',
});

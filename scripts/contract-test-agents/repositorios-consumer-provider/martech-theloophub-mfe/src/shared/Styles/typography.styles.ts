import { Heading, Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledTitle = styled(Heading, {
  fontWeight: 'bold',
  height: 'auto',
  fontFamily: '$heading',
  color: '$interfaceLabelPrimary',
});

export const StyledParagraph = styled(Paragraph, {
  fontSize: '14px !important',
  fontWeight: '400',
  fontFamily: '$paragraph',
  color: '#5C5C5C',
  margin: 0,

  variants: {
    size: {
      xsmall: {
        fontSize: '10px !important',
      },
      small: {
        fontSize: '12px !important',
      },
      medium: {
        fontSize: '14px !important',
      },
      large: {
        fontSize: '16px !important',
      },
    },

    color: {
      primary: {
        color: '$interfaceLabelPrimary',
      },
      secondary: {
        color: '$interfaceLabelSecondary',
      },
    },

    overflow: {
      true: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
  },
});

export const StyledSubtitle = styled('p', {
  fontFamily: '$heading',
  fontSize: '16px',
  fontWeight: '600',
  color: 'rgba(20, 20, 20, 0.56)',
  margin: 0,

  variants: {
    type: {
      heading: {
        fontFamily: '$heading',
      },
      paragraph: {
        fontFamily: '$paragraph',
      },
    },
  },
});

export const StyledSectionTitle = styled(Heading, {
  fontSize: '20px !important',
});

export const StyledLabel = styled('label', {
  fontSize: '14px',
  fontWeight: '600',
  fontFamily: '$paragraph',

  variants: {
    error: {
      true: { color: '#e82727' },
    },
  },
});

export const StyledOptionalFlag = styled('span', {
  color: tokens.color.foundation.txt.secondary,
  fontSize: '14px',
  fontWeight: '400',
  fontFamily: '$paragraph',
});

export const StyledErrorLabel = styled('span', {
  fontSize: '12px',
  fontWeight: '600',
  color: '#e82727',
  fontFamily: '$paragraph',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

export const StyledMeasure = styled('p', {
  fontSize: '1rem',
  color: '$interfaceLabelPrimary',
  margin: 0,
  fontFamily: '$paragraph',
  variants: {
    size: {
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

export const StyledRefreshLabel = styled('span', {
  fontWeight: '400',
  fontSize: '10px',
  fontFamily: '$paragraph',
  lineHeight: '12px',
  variants: {
    marginTop: {
      true: {
        marginTop: '$1',
      },
    },

    fontColor: {
      primary: {
        color: tokens.color.foundation.txt.default,
      },
      secondary: {
        color: tokens.color.foundation.txt.secondary,
      },
    },

    size: {
      small: {
        fontSize: '10px',
      },
      medium: {
        fontSize: '12px',
      },
      large: {
        fontSize: '14px',
      },
    },
  },
  defaultVariants: {
    fontColor: 'secondary',
  },
});

export const StyledTooltip = styled(Paragraph, {
  width: '100%',
});

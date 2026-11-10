import { TextButton } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledAlert = styled('div', {
  display: 'flex',
  gap: '12px',
  padding: '16px',
  borderRadius: '8px',
  minWidth: '320px',
  height: 'min-content',
  boxShadow: '0 0 4px 0 #00000029',
  flexDirection: 'column',
  variants: {
    type: {
      warning: {
        backgroundColor: '#fff4e6',
        color: '#a65900',
        border: '1px solid #ffd499',
      },
      info: {
        backgroundColor: '#e6f2ff',
        color: '#006edb',
        border: '1px solid #a1d0ff',
      },
      success: {
        backgroundColor: '#e6f9e6',
        color: '#007800',
        border: '1px solid #99e699',
      },
      error: {
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        border: '1px solid #fca5a5',
      },
      neutral: {
        backgroundColor: '#e7e7e7',
        color: '#141414',
        boxShadow: 'none',
      },
      AI: {
        backgroundColor: '#F0F9FF',
        color: '#141414',
        border: '1px solid #A1D0FF',
        padding: '13px',
        borderRadius: '16px',
      },
    },

    emphasis: {
      medium: {},
      low: {
        backgroundColor: '#f6f6f6',
        '&&': {
          borderLeft: '4px solid',
        },
      },
    },

    position: {
      sticky: {
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: 0,
      },
      inline: {
        boxShadow: 'none',
        '&&': {
          border: 'none',
        },
      },
      toast: {},
    },
  },

  compoundVariants: [
    {
      type: 'neutral',
      position: 'sticky',
      css: {
        borderRadius: '8px',
      },
    },
    {
      type: 'warning',
      emphasis: 'low',
      css: {
        color: '#d47300',
      },
    },
    {
      type: 'info',
      emphasis: 'low',
      css: {
        color: '#006edb',
      },
    },
    {
      type: 'success',
      emphasis: 'low',
      css: {
        color: '#009900',
      },
    },
    {
      type: 'error',
      emphasis: 'low',
      css: {
        color: '#d62222',
      },
    },
    {
      type: 'AI',
      emphasis: 'low',
      css: {
        color: '#0A0A0A',
      },
    },
  ],
});

export const StyledAlertBody = styled('div', {
  width: '100%',
  minWidth: '200px',
  minHeight: '24px',
});

export const StyledAlertTitle = styled('p', {
  fontFamily: '$paragraph',
  fontWeight: 'bold',
  fontSize: '14px',
  lineHeight: '24px',
  margin: 0,
});

export const StyledAlertMessage = styled('div', {
  display: 'flex',
  gap: '8px',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const SyledMessageContent = styled('span', {
  fontFamily: '$paragraph',
  fontSize: '14px',
  color: '#141414',
  lineHeight: '24px',
  variants: {
    iaAlertType: {
      true: {
        paddingTop: '8px',
        fontFamily: 'var(--font-family-body, "Work Sans")',
        fontSize: 'var(--size-paragraph-body-small, 14px)',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '140%',
        background:
          'linear-gradient(90deg, #0973B9 0%, var(--color-fg-neutral_primary, #141414) 10.09%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: '#0973B9',
      },
    },
  },
});

export const StyledContentWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

export const StyledAlertActionButtons = styled('div', {
  display: 'flex',
  gap: '8px',
});

export const StyledAlertCloseButton = styled(TextButton, {
  backgroundColor: '#1414141a',
  borderRadius: '512px',
  width: '24px',
  height: '24px',
  minWidth: '24px',
  marginLeft: 'auto',
});

export const StyledAlertExpandedMessage = styled('div', {
  paddingLeft: '36px',
  fontFamily: 'Work Sans, sans-serif',
  fontSize: '14px',
  color: '#141414',
});

export const StyledAlertExpandedMessageContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  gap: '12px',
});

export const StyledAlertAttribution = styled('span', {
  display: 'none',
  fontFamily: '$paragraph',
  fontWeight: 400,
  fontStyle: 'Regular',
  fontSize: '12px',
  lineHeight: '18px',
  letterSpacing: '0px',
  color: '#67665F',

  variants: {
    iaAlertType: {
      true: {
        display: 'block',
      },
    },
  },
});

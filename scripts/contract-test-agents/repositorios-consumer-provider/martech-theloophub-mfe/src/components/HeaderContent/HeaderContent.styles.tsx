import { Divider, Heading } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledHeaderContainerRoot = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

export const StyledHeaderContentTitleContainer = styled('div', {
  display: 'flex',
  gap: '8px',
  alignItems: 'baseline',
  marginBottom: '12px',
});

export const StyledHeaderContentBodyContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  paddingLeft: '20px',
  fontFamily: '$paragraph',

  p: {
    margin: 0,
  },

  variants: {
    noPadding: {
      true: {
        paddingLeft: 0,
      },
      false: {},
    },
  },
});

export const StyledHeaderContentIcon = styled('div', {
  width: '12px',
  height: '12px',
  background: '#E5B33A',
  borderRadius: '50%',
  marginBottom: 'auto',
  marginTop: '12px',

  variants: {
    type: {
      circle: {},
      block: {
        width: '20px',
        height: '20px',
        borderRadius: '4px',
      },
      none: {
        display: 'none',
      },
    },
  },
});

export const StyledHeaderContentTitle = styled(Heading, {
  fontSize: '24px',
  fontFamily: '$heading',
  fontWeight: 'bold',
});

export const StyledHeaderContentSubTitle = styled(Heading, {
  fontWeight: 'regular',
  margin: '0',
  variants: {
    color: {
      black: {
        color: '$black',
      },
      grey: {
        color: tokens.color.foundation.txt.secondary,
      },
    },
  },
});

export const StyledHeaderContentDivider = styled(Divider, { margin: '1rem 0' });

import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledContainer = styled('div', {
  height: '100%',
  minWidth: '96px',
  maxWidth: '96px',
});

export const StyledImg = styled('img', {
  maxHeight: '74px',
  maxWidth: '74px',
  objectFit: 'contain',
});

export const StyledFallback = styled('div', {
  maxHeight: '74px',
  maxWidth: '74px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

export const StyledImgContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  minWidth: '96px',
  maxWidth: '96px',
  height: '100%',
  justifyContent: 'space-between',
  variants: {
    hasPortolioColor: {
      false: {
        borderBottom: `1px solid ${tokens.color.foundation.border.tertiary}`,
      },
    },
  },
});

export const StyledBorderLeft = styled('div', {
  height: '100%',
  width: '8px',
  variants: {
    portfolioColor: {
      megabrands: {
        backgroundColor: '#E5B611',
      },
      expansion: {
        backgroundColor: '#C2346A',
      },
      sustain: {
        backgroundColor: '#2F74AA',
      },
      tail: {
        backgroundColor: '#4E579F',
      },
    },
  },
});

export const StyledImgContent = styled('div', {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  borderRight: `1px solid ${tokens.color.foundation.border.tertiary}`,
  paddingBottom: '5px',
  variants: {
    hasPortolioColor: {
      true: {
        borderBottom: `1px solid ${tokens.color.foundation.border.tertiary}`,
      },
    },
  },
});

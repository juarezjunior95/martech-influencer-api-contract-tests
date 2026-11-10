import { styled } from '@hexa-ui/theme';

export const StyledHeaderContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'stretch',
  height: 'min-content',

  variants: {
    showDivider: {
      true: {
        borderRight: '1px solid #14141440',
      },
    },
  },
});

export const StyledHeaderTopRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  borderBottom: '1px solid #14141429',
  variants: {
    noBorderBottom: {
      true: {
        borderBottom: 'none',
      },
    },
  },
});

export const StyledHeaderLegendsSlot = styled('div', {
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  minWidth: 0,
});

export const StyledHeaderTitleContainer = styled('div', {
  padding: '18px 16px',
  fontWeight: 'bold',
  fontSize: '16px',
  lineHeight: '16px',
  color: '#141414',
  fontFamily: '$heading',
});

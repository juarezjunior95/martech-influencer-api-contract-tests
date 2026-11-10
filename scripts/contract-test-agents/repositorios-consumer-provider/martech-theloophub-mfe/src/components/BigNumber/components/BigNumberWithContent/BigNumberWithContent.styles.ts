import { Card } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledBigNumberWithContentCard = styled(Card, {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '703px',
  height: '234px',
  minWidth: '481.5px',
  maxWidth: '1470px',
  padding: '24px 32px 32px 16px',
  border: '1px solid #14141429',
  borderRadius: '16px',
  background: '#FFFFFF',
  boxShadow: 'none !important',
  transition: 'all 300ms ease-out',

  variants: {
    clickeable: {
      false: {},
      true: {
        cursor: 'pointer',
        '&:hover': {
          background:
            'linear-gradient(0deg, rgba(229, 182, 17, 0.04) 0%, rgba(229, 182, 17, 0.04) 100%), #FFF',
          boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.16) !important',
          transform: 'scale(1.01)',
        },
        '&.selected': {
          border: '2px solid transparent',
          borderRadius: '16px',
          background: `
            linear-gradient(#fefcf5, #fefcf5) padding-box,
            linear-gradient(216.66deg, #F5E003 0%, #D3A238 75%) border-box
          `,
        },
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

export const StyledHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  paddingLeft: '16px',
});

export const StyledBody = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  gap: '24px',

  variants: {
    fullWidth: {
      true: {},
      false: {},
    },
  },
});

export const StyledBigNumberSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginTop: '12px',

  variants: {
    fullWidth: {
      true: {
        flex: '1 1 50%',
        width: '50%',
      },
      false: {},
    },
  },
});

export const StyledContentSection = styled('div', {
  width: '307.5px',
  height: '128px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    fullWidth: {
      true: {
        flex: '1 1 50%',
        width: '50%',
      },
      false: {},
    },
  },
});

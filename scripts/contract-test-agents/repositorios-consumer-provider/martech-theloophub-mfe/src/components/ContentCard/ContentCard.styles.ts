import { styled } from '@hexa-ui/theme';

export const StyledMainContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  backgroundColor: '#F9F9F9',
  borderRadius: '16px',
  border: '1px solid rgba(20, 20, 20, 0.08)',
  padding: '24px',

  variants: {
    fullWidth: {
      true: {
        width: '100%',
      },
      false: {},
    },
    noPaddingX: {
      true: {
        paddingLeft: '0px',
        paddingRight: '0px',
      },
      false: {},
    },
  },
});

export const StyledContentCardHeader = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '8px',
});

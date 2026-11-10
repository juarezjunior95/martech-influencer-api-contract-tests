import { styled } from '@hexa-ui/theme';

export const StyledPOSHeaderContainer = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const StyledPOSContentSection = styled('div', {
  width: '1290px',
  display: 'grid',
  gap: '24px',
  variants: {
    marginBottom: {
      true: {
        marginBottom: '48px',
      },
      false: {
        marginBottom: '0px',
      },
    },
  },
});

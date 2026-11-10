import { styled } from '@hexa-ui/theme';

export const StyledFilter = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  position: 'relative',
  height: 'max-content',

  variants: {
    hidden: {
      true: {
        display: 'none',
      },
    },
  },
});

export const StyledAutoApplyFieldsContainer = styled('div', {
  display: 'flex',
  gap: '16px',
  marginBottom: '16px',
});

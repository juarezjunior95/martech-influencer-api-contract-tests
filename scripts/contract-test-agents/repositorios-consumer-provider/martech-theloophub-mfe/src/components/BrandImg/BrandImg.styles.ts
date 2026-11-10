import { styled } from '@hexa-ui/theme';

export const StyledActiveBrandImg = styled('img', {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  objectFit: 'cover',
  background: 'transparent',
  '&:hover': {
    background: 'transparent',
  },
});

export const StyledDivider = styled('div', {
  width: '2px',
  height: '42px',
});

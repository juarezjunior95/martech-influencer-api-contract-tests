import { styled } from '@hexa-ui/theme';

export const CustomSkeletonLoaderContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  margin: '24px',
});

export const CustomSkeletonLoaderWrapper = styled('div', {
  display: 'flex',
  gap: '8px',

  variants: {
    marginBottom: {
      true: {
        marginBottom: '10px',
      },
      false: {
        marginBottom: '0',
      },
    },
  },
});

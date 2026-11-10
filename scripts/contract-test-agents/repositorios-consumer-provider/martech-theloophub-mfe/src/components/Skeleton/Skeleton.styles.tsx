import { SkeletonLoader } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledSkeletonContainer = styled('div', {
  display: 'flex',
  flex: 1,

  variants: {
    gap: {
      small: { gap: '8px' },
      medium: { gap: '16px' },
      large: { gap: '24px' },
    },
  },
});

export const StyledSkeletonLoader = styled(SkeletonLoader, {
  variants: {
    borderRadius: {
      none: { borderRadius: 'none' },
      'x-small': { borderRadius: '4px !important' },
      small: { borderRadius: '8px !important' },
      medium: { borderRadius: '16px !important' },
      large: { borderRadius: '24px !important' },
      'x-large': { borderRadius: '32px !important' },
    },
  },
  defaultVariants: {
    borderRadius: 'small',
  },
});

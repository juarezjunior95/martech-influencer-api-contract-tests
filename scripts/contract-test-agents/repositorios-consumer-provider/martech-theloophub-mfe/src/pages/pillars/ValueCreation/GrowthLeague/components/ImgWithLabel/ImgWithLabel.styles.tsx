import { Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const LeftImgComponent = styled('div', {
  display: 'Flex',
  gap: '12px',
  alignItems: 'center',
  maxWidth: '100%',
});

export const LeftImgBox = styled('div', {
  width: '32px',
  height: '32px',
  borderRadius: '100%',
  overflow: 'hidden',
  flexShrink: 0,
});

export const BrandImgBox = styled('div', {
  width: '40px',
  height: '32px',
  borderRadius: '2px',
  overflow: 'hidden',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const LeftImage = styled('img', {
  height: '100%',
  maxHeight: '100%!important',
  objectFit: 'cover',

  variants: {
    variant: {
      country: {
        width: '100%',
        objectFit: 'cover',
      },
      brand: {
        width: 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
      },
    },
  },

  defaultVariants: {
    variant: 'country',
  },
});

export const TruncatedText = styled(Paragraph, {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
  flexShrink: 1,
  minWidth: 0,
});

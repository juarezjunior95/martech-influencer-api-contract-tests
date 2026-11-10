import { styled } from '@hexa-ui/theme';

const StyledFirstColumnCellRendererImage = styled('img', {
  objectFit: 'contain',
  mixBlendMode: 'multiply',

  variants: {
    isBeyondBeer: {
      true: { width: '24px !important', height: '24px !important' },
    },
    isConfigImage: {
      true: {
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        border: '1px solid rgba(0, 0, 0, 0.08)',
      },
      false: { width: 'auto', height: '80%', borderRadius: '0%' },
    },
  },
});

const StyledSubtitle = styled('span', {
  fontSize: '16px',
  fontWeight: '400',
  fontFamily: '$heading',
  color: '#67665F',
  marginLeft: '4px',
});

export { StyledFirstColumnCellRendererImage, StyledSubtitle };

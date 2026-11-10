import { styled } from '@hexa-ui/theme';

const StyledGroupedImagesContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',

  marginLeft: '8px',
});

const StyledImage = styled('img', {
  position: 'relative',
  objectFit: 'cover',
  marginLeft: '-10px',
  borderRadius: '50%',
});

export { StyledGroupedImagesContainer, StyledImage };

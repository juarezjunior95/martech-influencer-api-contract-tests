import { styled } from '@hexa-ui/theme';

export const StyledCardsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
});

export const StyledSubPillarCardsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
  padding: '0 24px 24px 24px',
});

export const StyledHowWeDoItImage = styled('img', {
  width: '100%',
  height: '300px',
  objectFit: 'cover',
});

export const StyledAbiConnectQrcodeImage = styled('img', {
  width: '218px',
  height: '218px',
  borderRadius: '12px',
});

export const StyledAbiConnectImage = styled('img', {
  width: '152px',
  height: '46px',
});

export const StyledAbiConnectContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '28px',
  gap: '24px',
});

import { styled } from '@hexa-ui/theme';

export const LabelGrid = styled('div', {
  display: 'grid',
  marginTop: '-5px',
  padding: '5px 10px 5px 37px',
});

export const LabelItemBox = styled('div', {
  width: '100%',
  paddingTop: '18px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: '8px solid',
});

export const LabelTextAndIconBox = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
});

export const LabelText = styled('div', {
  color: 'rgba(20, 20, 20, 1)',
  fontSize: '0.875rem',
  fontWeight: '400',
  lineHeight: '1.25',
  fontFamily: '$paragraph',
  textAlign: 'center',
  marginBottom: '5px',
});

export const LabelImageBox = styled('div', {
  maxWidth: '100%',
  height: '40px',
  overflow: 'hidden',
  position: 'relative',
});

export const LabelImage = styled('img', {
  width: '100%',
  height: '100%',
  top: 'top',
  left: '0',
  objectFit: 'contain',
});

import { styled } from '@hexa-ui/theme';

export const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '$4',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  overflow: 'hidden',
});

export const Buttons = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$4',
});

export const Header = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.25rem',
});

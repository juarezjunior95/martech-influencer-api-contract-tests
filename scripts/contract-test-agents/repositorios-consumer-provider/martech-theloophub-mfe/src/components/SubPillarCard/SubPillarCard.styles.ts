import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledSubPillarCard = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '530px',
  border: `1px solid ${tokens.color.foundation.border.tertiary}`,
  borderRadius: '24px',
  backgroundColor: 'white',
  color: tokens.color.foundation.txt.secondary,
  padding: '24px',
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  cursor: 'default',
  textAlign: 'center',
});

export const StyledSubPillarCardHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  gap: '8px',
  marginBottom: '8px',
});

export const StyledSubPillarCardTitle = styled('h2', {
  fontFamily: '$heading',
  fontSize: '20px',
  fontWeight: '600',
  color: tokens.color.foundation.txt.default,
  margin: 0,
  lineHeight: '120%',
  letterSpacing: '0px',
  textAlign: 'center',

  '@media (min-width: 1440px)': {
    fontSize: '24px',
  },
});

export const StyledSubPillarCardDescription = styled('p', {
  fontFamily: '$paragraph',
  fontSize: '14px',
  fontWeight: '400',
  color: '$gray600',
  margin: 0,
  lineHeight: '140%',
  letterSpacing: '0px',
  textAlign: 'center',
  marginBottom: '24px',

  '@media (min-width: 1440px)': {
    fontSize: '16px',
  },
});

export const StyledSubPillarCardContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const StyledSubPillarCardImagePlaceholder = styled('div', {
  width: '100%',
  minHeight: '180px',
  backgroundColor: '#F3F4F6',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage:
    'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.02) 10px, rgba(0,0,0,.02) 20px)',
  color: '$gray400',
  fontSize: '14px',
  fontWeight: '$medium',
});

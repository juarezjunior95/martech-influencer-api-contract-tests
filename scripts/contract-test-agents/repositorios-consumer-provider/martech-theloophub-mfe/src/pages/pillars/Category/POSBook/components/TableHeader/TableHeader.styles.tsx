import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledTableHeaderContainer = styled('div', {
  display: 'grid',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'max-content',
  gap: '$2',
  gridTemplateColumns: '1fr 0.6fr',
});

export const StyledTableLastRefresh = styled('span', {
  fontWeight: '600',
  fontSize: '12px',
  fontFamily: 'Barlow',
  color: tokens.color.primitive.transparent.black['black-56'],
  margin: 0,
  width: 'max-content',
});

export const StyledSubfiltersGroup = styled('div', {
  display: 'flex',
  gap: '8px',
});

import { Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledHorizontalDivider = styled('div', {
  height: '2px',
  background: '#F5DB7F',
  margin: '8px 0',
});

export const StyledFooterItems = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  justifyContent: 'space-between',
});

export const StyledFootnotesText = styled(Paragraph, {
  color: '#5C5C5C !important',
  fontWeight: '700 !important',
});

export const StyledFootnotesContent = styled('span', {
  fontFamily: '$paragraph',
  fontWeight: '400',
  color: '#5C5C5C',
  margin: 0,
});

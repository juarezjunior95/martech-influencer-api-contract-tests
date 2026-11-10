import { Image, Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import { theme } from 'theme';

export const StyledNoResultsWrapper = styled('div', {
  width: '100%',
  color: theme.colors.txt.secondary,
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const StyledImage = styled(Image, {
  height: '200px',
  width: '200px',
  marginBottom: '$4',
});

export const StyledParagraph = styled(Paragraph, {
  textAlign: 'center !important',
  margin: '$2 0 $4 0',
});

export const StyledButtonsWrapper = styled('div', {
  display: 'flex',
  gap: '$4',
  alignItems: 'center',
  justifyContent: 'center',
});

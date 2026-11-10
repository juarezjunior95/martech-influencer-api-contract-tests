import { Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledContent = styled('div', {
  height: '100%',
  paddingTop: '24px',
});

export const StyledBrandPowerBookExportContainer = styled('div', {
  background: '#ffffff',
  overflow: 'hidden',
  borderRadius: '16px',
  border: '1px solid #14141429',
  height: 'min-content',
});

export const StyledParagraph = styled(Paragraph, {
  fontSize: '14px !important',
  lineHeight: '20px !important',
});

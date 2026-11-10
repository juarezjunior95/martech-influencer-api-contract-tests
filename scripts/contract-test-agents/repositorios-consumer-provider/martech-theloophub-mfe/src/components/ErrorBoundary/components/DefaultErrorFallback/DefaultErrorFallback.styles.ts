import { Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledErrorFallback = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '48px',
});

export const StyledErrorId = styled(Paragraph, {
  color: '#9ca3af',
  fontSize: '12px',
  marginBottom: '16px',
  fontFamily: 'monospace',
  backgroundColor: '#f3f4f6',
  padding: '4px 8px',
  borderRadius: '4px',
  marginTop: '48px',
});

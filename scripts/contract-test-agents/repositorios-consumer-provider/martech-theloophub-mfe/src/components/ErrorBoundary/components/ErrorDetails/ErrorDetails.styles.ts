import { styled } from '@hexa-ui/theme';

export const StyledErrorDetails = styled('details', {
  marginTop: '32px',
  width: '100%',
  maxWidth: '800px',
  textAlign: 'left',
});

export const StyledErrorSummary = styled('summary', {
  cursor: 'pointer',
  color: '#6c757d',
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '12px',
});

export const StyledErrorMessageContainer = styled('div', {
  background: '#f1f3f4',
  border: '1px solid #e1e5e9',
  borderRadius: '6px',
  marginTop: '12px',
});

export const StyledErrorMessage = styled('div', {
  padding: '12px 16px',
  borderBottom: '1px solid #e1e5e9',
  backgroundColor: '#fff3cd',
  fontSize: '14px',
  fontWeight: '600',
  color: '#856404',

  variants: {
    color: {
      red: {
        color: '#721c24',
        backgroundColor: '#f8d7da',
      },
      blue: {
        color: '#0c5460',
        backgroundColor: '#d1ecf1',
      },
    },
  },
});

export const StyledPre = styled('pre', {
  margin: 0,
  padding: '16px',
  fontSize: '11px',
  lineHeight: '1.3',
  overflow: 'auto',
  maxHeight: '200px',
  color: '#495057',
  fontFamily: '$paragraph',
});

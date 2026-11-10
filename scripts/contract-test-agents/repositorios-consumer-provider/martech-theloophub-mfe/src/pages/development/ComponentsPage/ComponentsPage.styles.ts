import { styled } from '@hexa-ui/theme';

export const StyledContainer = styled('div', {
  background: 'white',
  padding: '24px',
  '.c-leXOSy:nth-of-type(2)': {
    marginBottom: '24px',
    width: '50% !important',
  },
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  width: '100%',
  borderRadius: '16px',
  border: '1px solid rgba(20, 20, 20, 0.08)',
});

export const StyledSection = styled('div', {
  width: '100%',
  display: 'flex',
  gap: '16px',
  marginBottom: '16px',
});

export const StyledContentBoxExample = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px dashed #6A21B4',
  backgroundColor: '#F3EBFC',
  borderRadius: '8px',
});

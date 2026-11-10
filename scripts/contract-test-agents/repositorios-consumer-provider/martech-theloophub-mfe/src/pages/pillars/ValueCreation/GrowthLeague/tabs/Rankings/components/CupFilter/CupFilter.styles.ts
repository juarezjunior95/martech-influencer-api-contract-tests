import { styled } from '@hexa-ui/theme';

export const CupFilterStyles = styled('div', {
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  '& > *:not(:first-child)': {
    marginTop: '4px',
  },
});

export const CupFilterStylesFit = styled('div', {
  width: 'fit-content',
});

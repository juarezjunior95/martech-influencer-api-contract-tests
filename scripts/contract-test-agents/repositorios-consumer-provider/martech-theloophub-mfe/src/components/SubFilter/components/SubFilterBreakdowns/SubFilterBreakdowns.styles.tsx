import { styled } from '@hexa-ui/theme';

export const SubFilterBreakdownsBox = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
});

export const SubFilterBreakdownsSelects = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: 'fit-content',
  gap: '8px',
  '.selected': {
    backgroundColor: '#E6F2FF !important',
  },
});

export const SubFilterBreakdownsSelectsGroup = styled('div', {
  display: 'flex',
  height: '40px',
  alignItems: 'center',
  width: 'fit-content',
  gap: '8px',
  borderRight: '1px solid rgba(20, 20, 20, 0.12)',
  paddingRight: '8px',
  marginRight: '8px',
});

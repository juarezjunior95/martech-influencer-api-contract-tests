import { Button } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const QuickFiltersContainer = styled('div', {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  alignItems: 'center',
  maxWidth: '1280px',
});

export const QuickFiltersButton = styled(Button, {
  border: '1px solid #14141429 !important',
});

export const QuickFiltersBadge = styled('div', {
  backgroundColor: '#006EDB',
  borderRadius: '512px',
  color: '#FFFFFF',
  padding: '0px 8px',
  fontSize: '14px',
  fontWeight: 500,
});

export const ExpandButton = styled('button', {
  padding: '8px 16px',
  borderRadius: '512px',
  border: '1px solid #E0E0E0',
  backgroundColor: '#1414140a',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  color: '#006EDB',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',

  '&:hover': {
    backgroundColor: '#006EDB14',
  },

  '&:active': {
    backgroundColor: '#006EDB29',
  },
});

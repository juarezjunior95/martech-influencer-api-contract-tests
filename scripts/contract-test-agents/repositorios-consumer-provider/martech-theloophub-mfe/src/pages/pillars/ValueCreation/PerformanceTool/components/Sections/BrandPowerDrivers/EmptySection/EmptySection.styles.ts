import { EmptyState } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledEmptySectionContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '300px',
});

export const StyledEmptySection = styled(EmptyState.PageLevel, {
  h2: {
    fontSize: '20px',
    width: 'max-content',
  },
});

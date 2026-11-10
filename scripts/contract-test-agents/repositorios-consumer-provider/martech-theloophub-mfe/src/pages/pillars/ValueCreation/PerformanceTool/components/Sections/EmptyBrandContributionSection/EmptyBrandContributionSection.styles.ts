import { EmptyState } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledEmptyBrandContributionContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '400px',
});

export const StyledEmptyBrandContribution = styled(EmptyState.PageLevel, {
  '& h2': {
    fontSize: '20px !important',
    width: 'max-content',
  },
});

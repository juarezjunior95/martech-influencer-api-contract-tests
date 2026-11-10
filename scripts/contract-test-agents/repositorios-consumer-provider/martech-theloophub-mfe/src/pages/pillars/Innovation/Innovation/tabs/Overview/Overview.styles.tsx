import { Heading } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledEmptyState = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
});

export const StyledLegendContainer = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'start',
  margin: '14px 0px',

  '> div:first-child': {
    marginLeft: '0 !important',
  },
});

export const StyledChartsContainer = styled('div', {
  display: 'flex',
  alignItems: 'flex-end',
  flexDirection: 'column',
});

export const StyledOverviewContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

export const StyledTotalInnovationSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '34px',
});

export const StyledTotalInnovationSubTitle = styled(Heading, {
  marginBottom: '$6',
});

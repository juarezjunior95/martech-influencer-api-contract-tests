import { Heading } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledInnovationPerformanceChartHeaderSpacing = styled('div', {
  padding: '20px 24px',
});

export const StyledInnovationPerformanceContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '0 24px 24px 24px',
});

export const StyledBreakdownSection = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '#14141429 0px 0px 4px 0px',
  borderRadius: '16px',
  overflow: 'hidden',
});

export const StyledBreakdownHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  padding: '25px 16px',
  borderBottom: '1px solid #14141429',
});

export const StyledBreakdownHeading = styled(Heading, {
  fontSize: '16px',
  fontWeight: 'bold',
  marginRight: '8px',
});

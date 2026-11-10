import { Heading, Paragraph } from '@hexa-ui/components';
import { Icon } from '@hexa-ui/components2';
import { styled } from '@hexa-ui/theme';

export const StyledSpacedContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
});

export const StyledCalendarIcon = styled(Icon, {
  fontSize: '14px',
  color: '#5C5C5C',
  marginLeft: '4px',
});

export const StyledPeriodText = styled(Paragraph, {
  fontSize: '14px',
  color: '#5C5C5C !important',
  marginLeft: '4px',
});

export const StyledMeasureText = styled(Paragraph, {
  fontSize: '16px',
  color: '#5C5C5C !important',
  marginLeft: '4px',
});

export const StyledVerticalDivider = styled('div', {
  width: '2px',
  height: '32px',
  margin: '0 16px',
  background: '#F5DB7F',
});

export const StyledHorizontalDivider = styled('div', {
  height: '2px',
  background: '#F5DB7F',
  margin: '8px 0',
});

export const StyledFlagContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const StyledHeaderFlag = styled('img', {
  width: '32px',
  height: '32px',
  minWidth: '32px',
  minHeight: '32px',
  div: {
    '&:hover': {
      background: 'none',
    },
  },
});

export const StyledDivider = styled('div', {
  width: '1px',
  height: '32px',
  backgroundColor: '#14141414',
});

export const StyledDot = styled('div', {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: 'linear-gradient(90deg, #F5E003 0%, #D3A238 75%)',
  border: '1px solid #E5B611',
  margin: '0 4px',
});

export const StyledHeadlineText = styled(Heading, {
  color: '#5C5C5C !important',
});

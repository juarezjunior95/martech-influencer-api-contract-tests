import { styled } from '@hexa-ui/theme';
import { StyledSubtitle } from 'shared/Styles';

export const StyledContentHeader = styled('div', {
  display: 'flex',
  padding: '16px',
});

export const StyledContentHeaderContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const StyledContentHeaderTitleGroup = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

export const StyledContentHeaderSubtitle = styled(StyledSubtitle, {
  fontSize: '12px',
  fontWeight: '400',
});

export const StyledContentHeaderDivider = styled('div', {
  width: '100%',
});

export const StyledContentHeaderRightContent = styled('div', {
  marginLeft: 'auto',
  display: 'flex',
});

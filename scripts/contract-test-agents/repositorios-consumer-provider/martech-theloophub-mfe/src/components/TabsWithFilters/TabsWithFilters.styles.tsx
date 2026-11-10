import { Tabs } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledTabsList = styled(Tabs.List, {});

export const StyledContainer = styled('div', {
  paddingTop: '24px',
  '.c-leXOSy:nth-of-type(2)': {
    marginBottom: '24px',
  },
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
});

export const StyledContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  position: 'relative',
  flex: 1,
});

export const StyledTabContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const StyledPageTitleContainer = styled('div', {
  marginBottom: '8px',
});

export const StyledPageTitleRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '8px',
});

export const StyledPageTitleContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
});

export const StyledPageDescription = styled('p', {
  fontFamily: '$paragraph',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '24px',
  color: '$interfaceLabelSecondary',
  margin: 0,
});

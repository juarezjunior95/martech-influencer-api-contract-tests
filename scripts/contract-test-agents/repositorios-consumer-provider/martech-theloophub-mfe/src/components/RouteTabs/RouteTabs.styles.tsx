import { Tabs } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledTabsRoot = styled(Tabs.Root, {});

export const StyledTabsList = styled(Tabs.List, {
  maxWidth: '100$',
  overflow: 'hidden',
});

export const StyledTabContent = styled(Tabs.Content, {
  backgroundColor: 'transparent',
  padding: '0 !important',
});

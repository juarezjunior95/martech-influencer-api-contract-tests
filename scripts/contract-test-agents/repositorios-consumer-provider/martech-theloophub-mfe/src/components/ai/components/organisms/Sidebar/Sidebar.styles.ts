import styled from '@emotion/styled';

import { Button } from '../../atoms/Button';

export const StyledSidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 318px;
  height: 100%;
  padding-top: var(--ai-chat-space-3, 12px);
  gap: var(--ai-chat-space-4, 12px);
  background-color: var(--ai-chat-color-bg-default-subtle, #fafafa);
  border-right: 1px solid var(--ai-chat-color-bd-tertiary, #14141414);
  box-shadow: 4px 0 16px 0 rgba(0, 0, 0, 0.16);
  box-sizing: border-box;
`;

export const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: var(--ai-chat-space-2, 8px) var(--ai-chat-space-2, 8px) 0;
`;

export const SidebarCloseButton = styled(Button)`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--ai-chat-radius-md, 8px);
  color: var(--ai-chat-color-text-primary, #141414);
  transition: background-color var(--ai-chat-transition-fast, 150ms ease);

  &:hover:not(:disabled) {
    background-color: var(--ai-chat-color-bg-default-subtle, #fafafa);
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 0 var(--ai-chat-space-2, 8px);
  overflow: hidden;
`;

export const NewChatButton = styled.div`
  margin-bottom: var(--ai-chat-space-3, 12px);
  padding: 0 var(--ai-chat-space-2, 8px);

  > button {
    border: 1px solid;
    border-image-source: linear-gradient(216.66deg, #f5e003 0%, #d3a238 75%);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ai-chat-space-2, 8px);
  margin-bottom: var(--ai-chat-space-2, 8px);
`;

export const SectionTitle = styled.span`
  font-family: var(--ai-chat-font-family-header, 'Barlow');
  font-size: var(--ai-chat-font-size-lg, 16px);
  font-weight: var(--ai-chat-font-weight-semibold, 600);
  line-height: var(--ai-chat-line-height-tight, 1.2);
  letter-spacing: 0;
  color: var(--ai-chat-color-fg-default, #0d0d0c);
  padding: var(--ai-chat-space-1, 4px) var(--ai-chat-space-3, 12px);
`;

export const Divider = styled.hr`
  width: calc(100% + var(--ai-chat-space-2, 8px) * 2);
  height: 0;
  border: none;
  border-top: 1px solid var(--ai-chat-color-bg-tertiary, #1414141a);
  margin: 0 calc(var(--ai-chat-space-2, 8px) * -1);
`;

export const ConversationsList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: var(--ai-chat-space-2, 8px);
  overflow-y: auto;
  padding: var(--ai-chat-space-3, 12px) 0 var(--ai-chat-space-1, 4px);
`;

export const LoadingMore = styled.div`
  display: flex;
  justify-content: center;
  padding: var(--ai-chat-space-3, 12px) 0;
`;

export const Sentinel = styled.div`
  height: 1px;
  flex-shrink: 0;
`;

export const EmptyStateWrapper = styled.div`
  > div {
    min-height: unset;
    height: auto;
  }
`;

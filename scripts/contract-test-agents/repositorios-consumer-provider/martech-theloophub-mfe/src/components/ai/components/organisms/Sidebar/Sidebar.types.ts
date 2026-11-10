import type { HTMLAttributes, ReactNode } from 'react';

export interface Conversation {
  id: string;
  title: string;
  hasError?: boolean;
}

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  conversations: Conversation[];
  activeConversationId?: string;
  onNewChat?: () => void;
  onConversationClick?: (conversation: Conversation) => void;
  onConversationRename?: (conversation: Conversation, newName: string) => void;
  onConversationDelete?: (conversation: Conversation) => void;
  onRetryLoadHistory?: () => void;
  loadingHistory?: boolean;
  hasHistoryError?: boolean;
  onClose?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  newChatIcon?: ReactNode;
  className?: string;
}

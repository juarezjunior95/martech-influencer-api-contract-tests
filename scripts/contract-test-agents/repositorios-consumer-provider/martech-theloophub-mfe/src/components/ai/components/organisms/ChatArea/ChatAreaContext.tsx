import { createContext, useContext } from 'react';

import type { Message } from '../../../types';

export interface ChatAreaContextValue {
  messages: Message[];
  projectKey: string;
  isLoading: boolean;
  hasMessages: boolean;
  isAbandoned: boolean;
}

export const ChatAreaContext = createContext<ChatAreaContextValue | null>(null);

export function useChatAreaContext() {
  const context = useContext(ChatAreaContext);
  if (!context) {
    throw new Error(
      'ChatArea compound components must be used within <ChatArea>',
    );
  }
  return context;
}

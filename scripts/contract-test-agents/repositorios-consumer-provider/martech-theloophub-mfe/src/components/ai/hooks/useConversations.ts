import { useCallback, useState } from 'react';

import {
  useDeleteConversationMutation,
  useRenameConversationMutation,
} from 'redux/api/insightsCopilot';

import { DEFAULT_CLARA_PROJECT_KEY } from '../constants/projectKeys';

interface UseConversationsOptions {
  projectKey?: string;
  onDeleted?: (conversationId: string) => void;
}

export function useConversations(options: UseConversationsOptions = {}) {
  const { projectKey = DEFAULT_CLARA_PROJECT_KEY, onDeleted } = options;

  const [deleteMut] = useDeleteConversationMutation();
  const [renameMut] = useRenameConversationMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const requestDelete = useCallback(
    (conversation: { id: string; title: string }) => {
      setConversationToDelete(conversation);
      setIsDeleteModalOpen(true);
    },
    [],
  );

  const confirmDelete = useCallback(async () => {
    if (!conversationToDelete) return;
    try {
      await deleteMut({
        conversationId: conversationToDelete.id,
        projectKey,
      }).unwrap();
      onDeleted?.(conversationToDelete.id);
    } catch {
      /* handled by RTK Query */
    }
    setIsDeleteModalOpen(false);
    setConversationToDelete(null);
  }, [conversationToDelete, deleteMut, projectKey, onDeleted]);

  const cancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
    setConversationToDelete(null);
  }, []);

  const rename = useCallback(
    async (conversation: { id: string }, name: string) => {
      try {
        await renameMut({
          conversationId: conversation.id,
          projectKey,
          name,
        }).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [renameMut, projectKey],
  );

  return {
    requestDelete,
    confirmDelete,
    cancelDelete,
    rename,
    isDeleteModalOpen,
  };
}

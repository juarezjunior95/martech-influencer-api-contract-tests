import { useCallback, useMemo, useState } from 'react';

import { useListConversationsQuery } from 'redux/api/insightsCopilot';

import { DEFAULT_CLARA_PROJECT_KEY } from '../constants/projectKeys';
import { formatConversationName } from '../utils/formatConversationName';

interface UseConversationHistoryOptions {
  projectKey?: string;
  limit?: number;
}

export function useConversationHistory(
  options: UseConversationHistoryOptions = {},
) {
  const { projectKey = DEFAULT_CLARA_PROJECT_KEY, limit = 20 } = options;

  const [page, setPage] = useState(1);

  const {
    data: conversationHistory = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useListConversationsQuery({ projectKey, page, limit });

  const loadingMore = isFetching && page > 1;
  const isRetrying = isFetching && !isLoading && !loadingMore;
  const hasMore = conversationHistory.length >= page * limit;

  const loadMore = useCallback(() => {
    if (isFetching || !hasMore) return;
    setPage((p) => p + 1);
  }, [isFetching, hasMore]);

  const resetPage = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  const sidebarConversations = useMemo(
    () =>
      conversationHistory.map((item) => ({
        id: item.conversation_id,
        title: formatConversationName(item.name),
        hasError: !item.name?.trim(),
      })),
    [conversationHistory],
  );

  return {
    sidebarConversations,
    refetch: resetPage,
    isLoading,
    isError: isError || isRetrying,
    isRetrying,
    loadMore,
    hasMore,
    loadingMore,
  };
}

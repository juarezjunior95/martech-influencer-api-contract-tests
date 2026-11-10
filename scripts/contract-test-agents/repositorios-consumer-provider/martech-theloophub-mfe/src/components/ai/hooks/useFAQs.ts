import { useCallback } from 'react';

import { useGetFAQsQuery } from 'redux/api/insightsCopilot';

import { DEFAULT_CLARA_PROJECT_KEY } from '../constants/projectKeys';
import type { FAQ } from '../types';

interface UseFAQsOptions {
  projectKey?: string;
  onSelect?: (query: string) => void;
}

export function useFAQs(options: UseFAQsOptions = {}) {
  const { projectKey = DEFAULT_CLARA_PROJECT_KEY, onSelect } = options;
  const {
    data: items = [],
    isFetching: isLoading,
    isError,
    refetch,
  } = useGetFAQsQuery({ projectKey });

  const handleClick = useCallback(
    (faq: FAQ) => {
      onSelect?.(faq.query);
    },
    [onSelect],
  );

  return { items, handleClick, isLoading, isError, refetch };
}

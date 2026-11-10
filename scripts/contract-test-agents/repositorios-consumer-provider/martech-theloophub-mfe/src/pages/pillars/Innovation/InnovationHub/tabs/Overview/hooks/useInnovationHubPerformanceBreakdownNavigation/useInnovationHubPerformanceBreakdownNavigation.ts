import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useSubFilters } from 'hooks';

import { buildInnovationHubPerformanceBreakdownHref } from '../../utils/buildInnovationHubPerformanceBreakdownHref';

export interface UseInnovationHubPerformanceBreakdownNavigationResult {
  resolveOnClick: (cardId: string) => (() => void) | undefined;
}

/**
 * KPI card deep-link: sub-filter + Performance & Breakdown route with preserved query.
 */
export function useInnovationHubPerformanceBreakdownNavigation(
  navigableCardIds: string[],
): UseInnovationHubPerformanceBreakdownNavigationResult {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setSubFilterValue } = useSubFilters();

  const handleDeepDive = useCallback(
    (cardId: string) => {
      setSubFilterValue('kpis', cardId);
      navigate(
        buildInnovationHubPerformanceBreakdownHref(searchParams, cardId),
      );
    },
    [navigate, searchParams, setSubFilterValue],
  );

  const resolveOnClick = useCallback(
    (cardId: string) => {
      if (!navigableCardIds.includes(cardId)) {
        return undefined;
      }
      return () => handleDeepDive(cardId);
    },
    [handleDeepDive, navigableCardIds],
  );

  return { resolveOnClick };
}

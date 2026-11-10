import { INNOVATION_HUB_PERFORMANCE_BREAKDOWN_ROUTE } from '../../../constants';

/**
 * Builds the in-app href for Innovation Hub "Performance & Breakdown" with current query
 * string and `kpi` set to the Overview card id (camelCase).
 */
export function buildInnovationHubPerformanceBreakdownHref(
  searchParams: URLSearchParams,
  kpiCardId: string,
): string {
  const next = new URLSearchParams(searchParams);
  next.set('kpi', kpiCardId);
  return `${INNOVATION_HUB_PERFORMANCE_BREAKDOWN_ROUTE}?${next.toString()}`;
}

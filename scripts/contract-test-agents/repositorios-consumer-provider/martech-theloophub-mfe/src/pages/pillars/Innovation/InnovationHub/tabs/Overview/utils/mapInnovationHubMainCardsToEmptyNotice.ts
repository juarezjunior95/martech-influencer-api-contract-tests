import { toKpiOverviewCardEmptyStateData } from '../__mocks__/innovationHubOverviewMainCardsData';
import type { InnovationHubMainCards } from '../types';

/**
 * Maps every main-card entry to empty-state data; keys follow the mock/BFF record (no fixed KPI list).
 */
export function mapInnovationHubMainCardsToEmptyNotice(
  cards: InnovationHubMainCards,
  noticeMessage: string,
): InnovationHubMainCards {
  return Object.fromEntries(
    Object.entries(cards).map(([key, data]) => [
      key,
      toKpiOverviewCardEmptyStateData(data, noticeMessage),
    ]),
  ) as InnovationHubMainCards;
}

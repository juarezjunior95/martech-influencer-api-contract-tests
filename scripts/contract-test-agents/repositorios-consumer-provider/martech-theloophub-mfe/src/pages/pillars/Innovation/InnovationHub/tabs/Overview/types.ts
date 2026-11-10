import type { KpiOverviewCardData } from 'pages/components/KpiOverviewCard';

export type InnovationHubMainCards = Record<string, KpiOverviewCardData>;

export type InnovationHubOverviewViewState =
  'loading' | 'error' | 'empty' | 'ready';

export interface InnovationHubOverviewMockDataResult {
  view: InnovationHubOverviewViewState;
  /** `null` while `view` is `loading` (no KPI payload yet). */
  mainCards: InnovationHubMainCards | null;
  refetch: () => Promise<void>;
}

export type InnovationHubOverviewDataResult =
  InnovationHubOverviewMockDataResult;

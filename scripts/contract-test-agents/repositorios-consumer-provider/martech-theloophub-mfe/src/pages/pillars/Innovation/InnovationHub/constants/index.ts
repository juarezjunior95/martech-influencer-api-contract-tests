export const INNOVATION_HUB_PAGE_NAME = 'innovation_hub';

export const INNOVATION_HUB_OVERVIEW_MOCK_ONLY = true;

export const INNOVATION_HUB_BASE_ROUTE = '/innovation/innovation-performance';

export const INNOVATION_HUB_TAB_ID_OVERVIEW = 'overview';

export const INNOVATION_HUB_TAB_ID_PERFORMANCE_AND_BREAKDOWN =
  'performance-and-breakdown';

export const INNOVATION_HUB_PERFORMANCE_BREAKDOWN_ROUTE = `${INNOVATION_HUB_BASE_ROUTE}/${INNOVATION_HUB_TAB_ID_PERFORMANCE_AND_BREAKDOWN}`;

/**
 * Fourth argument to `createTab` (`disabled`). `false` keeps tabs selectable (Overview and Performance & Breakdown).
 */
export const INNOVATION_HUB_TAB_DISABLED = false;

/** Order matches `QUICK_FILTERS_COMPONENTS` / other pillar pages (presets: `GET /v1/presets/innovation_hub`). */
export const INNOVATION_HUB_VISIBLE_FILTER_FIELDS = [
  'zone',
  'country',
  'periods',
  'time_frame',
  'kpis',
] as const;

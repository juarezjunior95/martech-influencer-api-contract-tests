/** Section header on the Overview tab (BasicContainer). */
export const INNOVATION_HUB_OVERVIEW_GLOBAL_TOTAL_PERFORMANCE_TITLE_I18N_ID =
  'Innovation.InnovationHub.Overview.GlobalTotalInnovationPerformance.title';

/** DataStateHandler messages for the Total Innovation Performance KPI block. */
export const INNOVATION_HUB_TOTAL_PERFORMANCE_ERROR_TITLE_I18N_ID =
  'Innovation.InnovationHub.Overview.TotalInnovationPerformance.errorTitle';

export const INNOVATION_HUB_TOTAL_PERFORMANCE_ERROR_DESCRIPTION_I18N_ID =
  'Innovation.InnovationHub.Overview.TotalInnovationPerformance.errorDescription';

export const INNOVATION_HUB_TOTAL_PERFORMANCE_EMPTY_TITLE_I18N_ID =
  'Innovation.InnovationHub.Overview.TotalInnovationPerformance.emptyTitle';

export const INNOVATION_HUB_TOTAL_PERFORMANCE_EMPTY_DESCRIPTION_I18N_ID =
  'Innovation.InnovationHub.Overview.TotalInnovationPerformance.emptyDescription';

/** i18n id per card id when BFF adds a KPI without a dedicated tooltip yet, `formatMessage` falls back to `cardId`. */
export const INNOVATION_HUB_TOTAL_PERFORMANCE_TOOLTIP_IDS: Partial<
  Record<string, string>
> = {
  volume:
    'Innovation.InnovationHub.Overview.TotalInnovationPerformance.tooltipVolume',
  nr: 'Innovation.InnovationHub.Overview.TotalInnovationPerformance.tooltipNr',
  maco: 'Innovation.InnovationHub.Overview.TotalInnovationPerformance.tooltipMaco',
  macoMargin:
    'Innovation.InnovationHub.Overview.TotalInnovationPerformance.tooltipMacoMargin',
};

/** i18n id for mock "KPI data not available" empty-state notice (TotalInnovationPerformance). */
export const INNOVATION_HUB_OVERVIEW_KPI_DATA_NOT_AVAILABLE_I18N_ID =
  'Innovation.InnovationHub.Overview.TotalInnovationPerformance.kpiDataNotAvailable';

/**
 * Dev-only: mock hook returns `loading` + `mainCards: null` so KPI skeletons can be audited locally.
 * Must stay `false` in committed code. If both mock force flags are `true`, this one wins.
 */
export const INNOVATION_HUB_OVERVIEW_MOCK_FORCE_SKELETON_STATE = false;

/**
 * Dev-only: mock maps every main-card to empty-state using {@link INNOVATION_HUB_OVERVIEW_KPI_DATA_NOT_AVAILABLE_I18N_ID}.
 * Must stay `false` in committed code.
 */
export const INNOVATION_HUB_OVERVIEW_MOCK_FORCE_EMPTY_STATE = false;

export const INNOVATION_HUB_KPIS_CHART_COLORS = {
  striped: '#99D6FF',
  current: '#FDD349',
  default: '#DAC8A9',
} as const;

export const KPI_OVERVIEW_CARD_VARIATION_INNOVATION_HUB = 'innovation' as const;

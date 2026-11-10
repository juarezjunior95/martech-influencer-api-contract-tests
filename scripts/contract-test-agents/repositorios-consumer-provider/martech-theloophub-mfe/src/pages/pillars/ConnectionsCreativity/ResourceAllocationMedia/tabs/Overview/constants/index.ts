import { featureToggles } from 'config/featureToggle';

export const VIEW_TYPES = {
  BREAKDOWN: 'breakdown_toggle',
  RANKING: 'ranking_toggle',
};

export const RA_DEEP_DIVE_SUBFILTER = 'kpis';
export const RA_DEEP_DIVE_SUBFILTER_PRESET = 'kpis_resource-allocation-ranking';

export const RA_DEEP_DIVE_SUBFILTER_GROUP = 'resource_allocation_ranking';

const BASE_SECTION_TOGGLES =
  featureToggles.pillar.connectionsAndCreativity.submenus
    .resourceAllocationMedia.tab.overview.sections;

export const OVERVIEW_TOGGLES = {
  BREAKDOWN_TABLE: BASE_SECTION_TOGGLES.breakdownTable,
  BREAKDOWN_CHARTS: BASE_SECTION_TOGGLES.breakdownCharts,
  RANKING: BASE_SECTION_TOGGLES.ranking,
  DEV_VIEWER: featureToggles.developmentViewer,
};

export const BFF_VIEW_IDS = {
  mediaSpend:
    'connections-and-creativity_resource-allocation-media_overview_media-spend',
  megaBrands:
    'connections-and-creativity_resource-allocation-media_overview_megabrands-qwoa',
  campaigns:
    'connections-and-creativity_resource-allocation-media_overview_campaigns-qwoa',
  resourceAllocation:
    'connections-and-creativity_resource-allocation-media_overview_non-working-money',
} as const;

export const BFF_TABLE_VIEWS_IDS = {
  media_spend:
    'connections-and-creativity_resource-allocation-media_overview_media-spend-table',
  megabrands:
    'connections-and-creativity_resource-allocation-media_overview_megabrands-qwoa-table',
  campaigns:
    'connections-and-creativity_resource-allocation-media_overview_campaigns-qwoa-table',
  resource_allocation:
    'connections-and-creativity_resource-allocation-media_overview_non-working-money-table',
} as const;

export const BFF_RANKING = {
  media_spend: {
    viewId:
      'connections-and-creativity_resource-allocation-media_overview_media-spend-ranking',
    componentId: 'media_spend_ranking',
  },
  megabrands: {
    viewId:
      'connections-and-creativity_resource-allocation-media_overview_megabrands-qwoa-ranking',
    componentId: 'megabrands_qwoa_ranking',
  },
  campaigns: {
    viewId:
      'connections-and-creativity_resource-allocation-media_overview_campaigns-qwoa-ranking',
    componentId: 'campaigns_qwoa_ranking',
  },
  resource_allocation: {
    viewId:
      'connections-and-creativity_resource-allocation-media_overview_non-working-money-ranking',
    componentId: 'non_working_money_ranking',
  },
} as const;

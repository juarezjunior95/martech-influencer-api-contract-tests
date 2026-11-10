export const CATEGORY_HEALTH_PAGE_NAME = 'category_category-health';

export const FILTER_CONFIGS = {
  pageName: CATEGORY_HEALTH_PAGE_NAME,
  filtersList: ['zones', 'country', 'years', 'segments'],
  visibleFields: ['zone', 'country', 'years', 'segments'],
  params: {
    'zones[include_global]': true,
    'country[include_global]': true,
    'segments[use_category_health_scope]': true,
  },
};

export const DEFAULT_PRODUCT_TYPE = 'Beer';

export const GLOBAL_ZONE = 'ABI';

export const DRILL_DOWN_BASE_URL = '/category/category-health/drill-down';

export const OVERVIEW_BASE_URL = '/category/category-health/overview';

export const KPI_COLUMN_MAPPING: Record<string, string> = {
  bv_fy: 'volume',
  bv_vsly: 'volume',
  bicl_fy: 'icl',
  bicl_vsly: 'icl',
  sot_fy: 'sot',
  sot_vsly: 'sot',
  bp_fy: 'participation',
  bp_vsly: 'participation',
  wmtbb_fy: 'wmtbb',
  wmtbb_vsly: 'wmtbb',
};

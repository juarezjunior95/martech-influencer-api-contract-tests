export enum AudienceTargetingError {
  PermissionRequired = 'AUDIENCE_TARGETING_PERMISSION_REQUIRED',
  PermissionRequiredNoOtherAccess = 'AUDIENCE_TARGETING_PERMISSION_REQUIRED_NO_OTHER_ACCESS',
  DataRefreshFail = 'AUDIENCE_TARGETING_DATA_REFRESH_FAIL',
  CompetitorWithoutData = 'AUDIENCE_TARGETING_COMPETITOR_WITHOUT_DATA',
}

export const FILTER_CONFIG_DEFINITION = {
  pageName: 'consumer_audience-targeting-definition',
  filtersApiKeys: ['zones', 'country', 'audience_targeting_brands', 'periods'],
  apiParams: {
    'zones[include_global]': false,
    'country[include_global]': false,
    'country[scope]': 'audience_targeting',
    'periods[scope]': 'r12m',
    'periods[use_full_label]': true,
  },
  visibleFields: [
    'zone',
    'country',
    'audience_targeting_brands',
    'audience_targeting_brands_comp',
    'periods',
  ],
};

export const FILTER_CONFIG_PERFORMANCE = {
  pageName: 'consumer_audience-targeting-performance',
  filtersApiKeys: [
    'zones',
    'country',
    'audience_targeting_brands',
    'periods',
    'kpis',
  ],
  apiParams: {
    'zones[include_global]': false,
    'country[include_global]': false,
    'country[scope]': 'audience_targeting',
    'periods[scope]': 'r12m',
    'periods[use_full_label]': true,
    'kpis[kpi_groups]': 'audience_targeting',
  },
  visibleFields: [
    'zone',
    'country',
    'audience_targeting_brands',
    'audience_targeting_brands_comp',
    'periods',
    'kpis',
  ],
};

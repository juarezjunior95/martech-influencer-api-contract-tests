const PROTECTED_FIELDS = new Set(['time_frame', 'ytd-month', 'pos_periods']);

export const FILTER_DEPENDENCIES: Record<string, string[]> = {
  kpis: [
    'brands',
    'brand_filter_groupings',
    'portfolios',
    'beer_price_segment',
  ],
  zone: ['country', 'brands', 'sub_brands', 'brands_abi', 'brands_comp'],
  country: [
    'zone',
    'brands',
    'sub_brands',
    'brands_abi',
    'brands_comp',
    'audience_targeting_brands',
  ],
  portfolios: ['brands'],
  beer_price_segment: ['brands', 'sub_brands'],
  brands: ['sub_brands'],
  global_brands: ['brand_filter_groupings', 'sub_brands'],
  brand_filter_groupings: ['brands', 'portfolios'],
  brands_abi: ['brands_comp'],
  brands_comp: [],
  scopes: ['sub_scopes'],
  audience_targeting_brands: ['audience_targeting_brands_comp'],
};

export const DYNAMIC_DEFAULT_FILTERS = [
  'sub_brands',
  'audience_targeting_brands',
  'audience_targeting_brands_comp',
  'sub_scopes',
];

export const DYNAMIC_RESET_CONTEXT: Record<string, string[]> = {
  audience_targeting_brands: ['country'],
  audience_targeting_brands_comp: ['country', 'audience_targeting_brands'],
  sub_brands: ['country', 'brands'],
  sub_scopes: ['scopes'],
};

export const getFiltersToReset = (filterKey: string): string[] => {
  const dependents = FILTER_DEPENDENCIES[filterKey] || [];
  const allToReset = [filterKey, ...dependents];
  return allToReset.filter((key) => !PROTECTED_FIELDS.has(key));
};

export const hasDynamicDefault = (filterKey: string): boolean => {
  return DYNAMIC_DEFAULT_FILTERS.includes(filterKey);
};

export const getDynamicResetContext = (filterKey: string): string[] => {
  return DYNAMIC_RESET_CONTEXT[filterKey] || [];
};

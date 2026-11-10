export interface FilterCategory {
  id: string;
  title: string;
  fields: string[];
  defaultOpen?: boolean;
}

export const FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: 'kpis',
    title: 'KPI',
    fields: ['kpis'],
    defaultOpen: true,
  },
  {
    id: 'geographic',
    title: 'Geographic',
    fields: ['zone', 'country'],
    defaultOpen: true,
  },
  {
    id: 'timeframe',
    title: 'Time Frame',
    fields: ['years', 'ytd-month', 'pos_periods', 'periods'],
    defaultOpen: true,
  },
  {
    id: 'products',
    title: 'Product Type',
    fields: ['segments', 'product_scope'],
    defaultOpen: true,
  },
  {
    id: 'growth_levers',
    title: 'Growth Levers',
    fields: ['growth_levers', 'value_creation_growth_levers'],
    defaultOpen: true,
  },
  {
    id: 'brands',
    title: 'Brands',
    fields: [
      'brand_filter_groupings',
      'portfolios',
      'beer_price_segment',
      'global_brands',
      'brands',
      'sub_brands',
      'brands_abi',
      'brands_comp',
      'audience_targeting_brands',
      'audience_targeting_brands_comp',
    ],
    defaultOpen: true,
  },
  {
    id: 'scopes',
    title: 'Scopes',
    fields: ['distribution_scopes', 'scopes', 'sub_scopes'],
    defaultOpen: true,
  },
];

// Helper function to get category by field key
export const getCategoryByField = (
  fieldKey: string,
): FilterCategory | undefined => {
  return FILTER_CATEGORIES.find((category) =>
    category.fields.some(
      (field) => field.toLowerCase() === fieldKey.toLowerCase(),
    ),
  );
};

// Helper function to group fields by category
export const groupFieldsByCategory = (
  fieldKeys: string[],
): Record<string, string[]> => {
  const grouped: Record<string, string[]> = {};

  FILTER_CATEGORIES.forEach((category) => {
    grouped[category.id] = [];
  });

  // Add 'uncategorized' for fields without a category
  grouped['uncategorized'] = [];

  fieldKeys.forEach((fieldKey) => {
    const category = getCategoryByField(fieldKey);
    if (category) {
      grouped[category.id].push(fieldKey);
    } else {
      grouped['uncategorized'].push(fieldKey);
    }
  });

  // Remove empty categories
  Object.keys(grouped).forEach((key) => {
    if (grouped[key].length === 0) {
      delete grouped[key];
    }
  });

  return grouped;
};

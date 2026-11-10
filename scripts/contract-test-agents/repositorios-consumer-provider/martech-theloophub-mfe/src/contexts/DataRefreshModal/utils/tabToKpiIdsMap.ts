const PORTFOLIO_PERFORMANCE_KPIS = [
  'volume',
  'nr',
  'cores',
  'market_share',
  'power',
  'sm',
  'category_participation',
  'superior_core',
  'occasions_development',
  'lead_premium',
  'beyond_beer',
];

export const tabToKpiIdsMap: Record<string, string[]> = {
  // Brand Analysis
  'Brand Analysis - Overall': [
    'volume',
    'nr',
    'cores',
    'market_share',
    'power',
  ],
  'Brand Analysis - Volume & Market Share': ['volume', 'market_share', 'pos'],
  'Brand Analysis - Net Revenue': ['nr', 'nr_vs_cpi'],
  'Brand Analysis - CORES': ['cores', 'pl', 'sm', 'sm_hl'],
  'Brand Analysis - Brand Power': [
    'power',
    'meaning',
    'difference',
    'salience',
    'imageries',
  ],

  // Brand Power Book
  'Brand Power Book - Power Book': ['power'],

  // Category Health
  'Category Health - Overview': ['cat_health', 'icl', 'sot', 'p4w', 'wmtbb'],
  'Category Health - DrillDown': ['cat_health', 'icl', 'sot', 'p4w', 'wmtbb'],

  // POS Book
  'POS Book - Grow the Category': ['pos'],
  'POS Book - Lead the Category': ['pos'],

  // Resource Allocation
  'Resource Allocation - Overview': [
    'media_spend',
    'megabrands',
    'qwoa',
    'resource_allocation',
  ],
  'Resource Allocation - Resource Allocation': [
    'nwm',
    'sponsorship_activations',
    'resource_allocation_media',
  ],
  'Resource Allocation - Investment Breakdown': [
    'volume',
    'marketing_package',
    'nwm',
    'sponsorship_activations',
    'resource_allocation_media',
  ],

  // Growth League
  'Growth League - Overview': ['all_kpis'],
  'Growth League - Ranking': ['all_kpis'],

  // Portfolio Performance
  'Portfolio Performance - Overview': PORTFOLIO_PERFORMANCE_KPIS,
  'Portfolio Performance - P&L': ['pl'],

  // Volume Page Global
  'volume-page-global': PORTFOLIO_PERFORMANCE_KPIS,

  // Audience Targeting
  'Audience Targeting - Definition': ['pos'],
  'Audience Targeting - Performance': ['pos'],
};

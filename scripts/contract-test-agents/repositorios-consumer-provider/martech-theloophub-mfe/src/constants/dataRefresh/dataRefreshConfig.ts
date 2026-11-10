interface ColumnDef {
  headerName: string;
  field: string;
}

interface RowData {
  kpi: string;
  id: string;
  update_time: string;
  source: string;
  sourceTooltip?: string;
}

type RowSeed = readonly [
  kpi: string,
  id: string,
  update_time: string,
  source: string,
  sourceTooltip?: string,
];

const DATA_REFRESH_ROW_SEEDS: RowSeed[] = [
  ['Volume', 'volume', 'WD4', 'Sunlight'],
  ['Net Revenue', 'nr', 'WD9', 'Sunlight'],
  ['CORES', 'cores', 'WD9', 'Sunlight'],
  ['Market Share', 'market_share', 'WD13-16', 'Anaplan'],
  ['Brand Power', 'power', 'WD13-16 (Quarterly)', 'Kantar'],
  ['POS', 'pos', 'WD13-16 (Quarterly)', 'Kantar, Atlantia (MAZ)'],
  ['Net Revenue vs CPI', 'nr_vs_cpi', 'WD9', 'Sunlight'],
  ['P&L Composition', 'pl', 'WD9', 'Sunlight'],
  ['S&M', 'sm', 'WD9', 'Sunlight'],
  ['S&M/hl and S&M % of MACO', 'sm_hl', 'WD9', 'Sunlight'],
  ['Meaning', 'meaning', 'WD13-16 (Quarterly)', 'Kantar'],
  ['Difference', 'difference', 'WD13-16 (Quarterly)', 'Kantar'],
  ['Salience', 'salience', 'WD13-16 (Quarterly)', 'Kantar'],
  ['Imageries', 'imageries', 'WD13-16 (Quarterly)', 'Kantar'],
  ['Media Spend', 'media_spend', 'WD16-21', 'ZBB + Efficiencies manual file'],
  ['Megabrands', 'megabrands', 'WD16-21', 'ZBB + Efficiencies manual file'],
  ['Media QWOA', 'qwoa', 'WD16-21', 'ZBB + Efficiencies manual file'],
  [
    'Resource Allocation',
    'resource_allocation',
    'WD16-21',
    'ZBB + Efficiencies manual file',
  ],
  ['NWM', 'nwm', 'WD16-21', 'ZBB + Efficiencies manual file'],
  [
    'Marketing Package',
    'marketing_package',
    'WD16-21',
    'ZBB + Efficiencies manual file',
  ],
  [
    'Sponsorship & Activations',
    'sponsorship_activations',
    'WD16-21',
    'ZBB + Efficiencies manual file',
  ],
  [
    'Media',
    'resource_allocation_media',
    'WD16-21',
    'ZBB + Efficiencies manual file',
  ],
  ['All KPIs', 'all_kpis', 'WD1', 'Manual files'],
  [
    'Beer Participation',
    'category_participation',
    'WD13-16 (Quarterly)',
    'Kantar, Atlantia (MAZ)',
  ],
  ['Superior Core', 'superior_core', 'WD9', 'Sunlight'],
  ['Occasions Development', 'occasions_development', 'WD9', 'Sunlight'],
  ['Lead Premium', 'lead_premium', 'WD9', 'Sunlight'],
  ['Beyond Beer', 'beyond_beer', 'WD9', 'Sunlight'],
  ['S&M of MACO', 'sm_of_maco', 'WD9', 'Sunlight'],
  ['Total Volume', 'total_volume', 'WD9', 'Sunlight'],
  ['MACO', 'maco', 'WD9', 'Sunlight'],
  ['VICL', 'vilc', 'WD9', 'Sunlight'],
  ['Category Volume', 'cat_health', 'March (Yearly)', 'IFM (GAC)'],
  ['ICL', 'icl', 'March (Yearly)', 'IFM (GAC)'],
  ['SOT', 'sot', 'March (Yearly)', 'IFM (GAC)'],
  ['Participation', 'p4w', 'March (Yearly)', 'Kantar, Atlantia (MAZ)'],
  [
    'WMTBB',
    'wmtbb',
    'March (Yearly)',
    'Mix of Providers',
    'Consumption per capita: IHS & World Bank\nBeer price: Euromonitor, Nielsen\nConsumer Price Index: IHS Markit',
  ],
];

const toRowData = (row: RowSeed): RowData => ({
  kpi: row[0],
  id: row[1],
  update_time: row[2],
  source: row[3],
  ...(row[4] ? { sourceTooltip: row[4] } : {}),
});

export interface DataRefreshConfig {
  columnDefs: ColumnDef[];
  rowData: RowData[];
}

export const DATA_REFRESH_CONFIG: DataRefreshConfig = {
  columnDefs: [
    { headerName: 'KPIs', field: 'kpi' },
    { headerName: 'ID', field: 'id' },
    { headerName: 'Update Time', field: 'update_time' },
    { headerName: 'Source', field: 'source' },
  ],
  rowData: DATA_REFRESH_ROW_SEEDS.map(toRowData),
};

// NOTE: keep these strings in sync with the page name constants defined
// alongside each page (e.g. BRAND_ANALYSIS_PAGE_NAME in BrandAnalysis.tsx,
// KPI_TO_PAGE_NAME in VolumePagesKpiContext.tsx, etc.).
// They are inlined here to avoid pulling the entire `pages` barrel (and its
// React component tree) into modules that only need page-name strings, which
// would cascade through `contexts` -> `DataRefreshModal` -> this file.
export const PAGES_WITH_DATA = [
  'portfolio-brand_brand-analysis',
  'portfolio-brand_brand-analysis-brand-power',
  'portfolio-brand_brand-power-results',
  'category_category-health',
  'category_pos-results',
  'connections-creativity_media-campaign-results',
  'value-creation_growth-league',
  'portfolio-brand_portfolio-performance',
  'value-creation_volume-pages',
  'value-creation_nr-pages',
  'value-creation_market-share-pages',
  'consumer_audience-targeting',
];

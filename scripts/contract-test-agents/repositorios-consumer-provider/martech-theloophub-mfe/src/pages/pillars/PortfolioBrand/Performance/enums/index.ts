export const Kpis = {
  //Breakdowns
  COUNTRY: 'owr_value-creation_breakdown_region-view',
  ZONE: 'owr_value-creation_breakdown_region-view',
  SEGMENTS: 'owr_value-creation_breakdown_category-view_segment',
  PORTFOLIO: 'owr_value-creation_breakdown_category-view_portfolio',
  ALL: 'owr_value-creation_breakdown_brand-view_all-brands',
  BRAND_SEGMENT: 'owr_value-creation_breakdown_brand-view_segment',
  BRAND_PORTFOLIO: 'owr_value-creation_breakdown_brand-view_portfolio',

  //Overview
  MAIN_RESULTS: 'owr_value-creation_overview_main-results',

  //Pnl
  PNL_OVERVIEW: 'owr_value-creation_pl',
  PNL_DEEP_DIVE: 'owr_value-creation_pl_deep-dive',
};

export const KPIS_BFF = {
  BREAKDOWNS: {
    brands: {
      ALL: {
        id: 'value-creation_portfolio-performance_breakdowns_brands_all_brands-all',
      },
      portfolio: {
        id: 'value-creation_portfolio-performance_breakdowns_brands_portfolio_brands-portfolio',
      },
      segments: {
        id: 'value-creation_portfolio-performance_breakdowns_brands_segments_brands-segments',
      },
    },
    region: {
      id: 'value-creation_portfolio-performance_breakdowns_region_region',
    },
    category: {
      portfolio: {
        id: 'value-creation_portfolio-performance_breakdowns_category_portfolio_category-portfolio',
      },
      segments: {
        id: 'value-creation_portfolio-performance_breakdowns_category_segments_category-segments',
      },
    },
  },
} as const;

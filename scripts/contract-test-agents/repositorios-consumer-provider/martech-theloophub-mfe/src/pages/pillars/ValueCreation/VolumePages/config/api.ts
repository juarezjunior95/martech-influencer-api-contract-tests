export interface KpiEndpoints {
  country: string;
  global: string;
  globalMoves: string;
  segmentsGb: string;
  segmentsGbTable?: string;
  segmentsGbPortfolio?: string;
}

export const DEFAULT_ENDPOINTS: KpiEndpoints = {
  country: 'value-creation_pr-pages_country',
  global: 'value-creation_pr-pages_global',
  globalMoves: 'value-creation_pr-pages_global-moves',
  segmentsGb: 'value-creation_pr-pages_segments-gb',
  segmentsGbTable: 'value-creation_pr-pages_segments-gb_table',
  segmentsGbPortfolio: 'value-creation_pr-pages_segments-gb_portfolio',
};

export const DEFAULT_BEER_ADJ_ENDPOINTS: KpiEndpoints = {
  country: 'value-creation_pr-pages-beer-adj_country',
  global: 'value-creation_pr-pages-beer-adj_global',
  globalMoves: 'value-creation_pr-pages-beer-adj_global-moves',
  segmentsGb: 'value-creation_pr-pages-beer-adj_segments-gb',
  segmentsGbTable: 'value-creation_pr-pages-beer-adj_segments-gb_table',
  segmentsGbPortfolio: 'value-creation_pr-pages-beer-adj_segments-gb_portfolio',
};

export const MARKET_SHARE_ENDPOINTS: KpiEndpoints = {
  country: 'value-creation_pr-pages_market-share_country',
  global: 'value-creation_pr-pages_market-share_global',
  globalMoves: 'value-creation_pr-pages_market-share_global-moves',
  segmentsGb: 'value-creation_pr-pages_market-share_segment-gb',
  segmentsGbTable: 'value-creation_pr-pages_market-share_priorities-table',
};

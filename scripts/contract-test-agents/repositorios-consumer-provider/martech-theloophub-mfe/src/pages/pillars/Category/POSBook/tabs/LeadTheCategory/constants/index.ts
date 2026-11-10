export const PRICE_SEGMENTS_KEY_BRAND = 'price-segments-brand';
export const PRICE_SEGMENTS_ALL_BRAND = '';
export const PRICE_SEGMENTS_KEY_MANUFACTURE = 'price-segments-manufacture';
export const PRICE_SEGMENTS_ALL_MANUFACTURE = 'all';

export const SEGMENT_OPTIONS = [
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'global-brands', label: 'Global Brands' },
  { value: 'rankings', label: 'Key Brands' },
];

export const COMPETITOR_LEGEND_LABEL = 'Competitor';

export const VIEW_TYPES = {
  PORTFOLIO: 'portfolio',
  GLOBAL_BRANDS: 'global-brands',
  RANKINGS: 'rankings',
} as const;

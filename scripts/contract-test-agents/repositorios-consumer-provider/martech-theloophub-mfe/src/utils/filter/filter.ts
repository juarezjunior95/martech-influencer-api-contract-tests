import { FilterForm, FilterValue } from 'models/Filters';

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export interface Quarter {
  name: string;
  startMonth: number;
  endMonth: number;
}
export const quarters: Quarter[] = [
  { name: 'Q1', startMonth: 0, endMonth: 2 },
  { name: 'Q2', startMonth: 3, endMonth: 5 },
  { name: 'Q3', startMonth: 6, endMonth: 8 },
  { name: 'Q4', startMonth: 9, endMonth: 11 },
];

export function getRegionIdentifier(zone: FilterValue, country: FilterValue) {
  if (zone !== 'ABI' && !country) return '';
  return zone === 'ABI' ? 'ABI' : country;
}

const mappedKeys = {
  brands_abi: 'sub_brand',
  brands_comp: 'sub_brand_comp',
};

export function parseFilters(jsonFilters) {
  if (!jsonFilters) return {};

  return Object.entries(jsonFilters).reduce((filters, [key, value]) => {
    const finalKey = mappedKeys[key] || key;

    if (value !== null) return { ...filters, [`filters[${finalKey}]`]: value };

    return { ...filters };
  }, {});
}

export const getViewtype = (country: FilterValue) => {
  return country === 'ABI' ? 'global' : 'country';
};

export function normalizeFilters(applied: FilterForm) {
  return {
    timeframe: applied.time_frame,
    timeperiod: applied.pos_periods,
    zone: applied.zone,
    country: applied.country,
    brand: applied.brands,
    sub_brand: applied.sub_brands || applied.brands_abi,
    sub_brand_comp: applied.brands_comp,
    period: applied?.['ytd-month'],
    scope: applied.scopes,
    sub_scope: applied.sub_scopes,
    product_scope: applied.product_scope,
  };
}

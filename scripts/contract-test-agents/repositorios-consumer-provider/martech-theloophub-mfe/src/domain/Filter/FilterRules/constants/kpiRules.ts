import { GeoRules } from '../types';

// =============================================================================
// KPI IDENTIFIERS
// =============================================================================

export const KPI = {
  VOLUME: 'volume',
  NET_REVENUE: 'nr',
  POWER: 'power',
  CORES: 'cores',
  MARKET_SHARE: 'market_share',
} as const;

export type KpiKey = (typeof KPI)[keyof typeof KPI];

// =============================================================================
// KPI BEHAVIORAL GROUPS
// =============================================================================

const PERFORMANCE_TOOL_KPIS = new Set<string>([
  KPI.VOLUME,
  KPI.NET_REVENUE,
  KPI.POWER,
  KPI.CORES,
  KPI.MARKET_SHARE,
]);

const KPIS_WITH_GROWTH_LEVERS = new Set<string>([
  KPI.VOLUME,
  KPI.NET_REVENUE,
  KPI.CORES,
]);

const KPIS_WITH_CLASSIFICATION_DEPENDENT_BRANDS = new Set<string>([
  KPI.VOLUME,
  KPI.NET_REVENUE,
  KPI.CORES,
]);

const KPIS_FILTER_BPS_OTHER_ALL_COUNTRIES = new Set<string>([KPI.NET_REVENUE]);

const KPIS_WITH_BPS_COUNTRY_RESTRICTIONS = new Set<string>([
  KPI.VOLUME,
  KPI.CORES,
]);

// =============================================================================
// KPI HELPERS
// =============================================================================

export const isPerformanceToolKpi = (kpi: string): boolean =>
  PERFORMANCE_TOOL_KPIS.has(kpi?.toLowerCase());

export const hasGrowthLevers = (kpi: string): boolean =>
  KPIS_WITH_GROWTH_LEVERS.has(kpi?.toLowerCase());

export const requiresClassificationForBrand = (kpi: string): boolean =>
  KPIS_WITH_CLASSIFICATION_DEPENDENT_BRANDS.has(kpi?.toLowerCase());

export const hasBpsOptionsRestrictions = (
  kpi: string,
  country?: string,
): boolean => {
  const kpiLower = kpi?.toLowerCase();

  return (
    KPIS_FILTER_BPS_OTHER_ALL_COUNTRIES.has(kpiLower) ||
    (KPIS_WITH_BPS_COUNTRY_RESTRICTIONS.has(kpiLower) &&
      country?.toUpperCase() === 'CAN')
  );
};

export const KPI_RULES: Record<string, GeoRules> = {
  [KPI.POWER]: {
    global: {
      'All Brands': { subBrandHidden: true },
      Portfolio: { brandLocked: true, subBrandHidden: true },
      'Beer Price Segment': { brandLocked: true, subBrandHidden: true },
      'Global Brands': { notAvailable: true },
    },
    zone: {
      'All Brands': { subBrandHidden: true },
      Portfolio: { brandLocked: true, subBrandHidden: true },
      'Beer Price Segment': { brandLocked: true, subBrandHidden: true },
      'Global Brands': { notAvailable: true },
    },
    eur: {
      'All Brands': { subBrandHidden: true },
      Portfolio: { brandLocked: true, subBrandHidden: true },
      'Beer Price Segment': { brandLocked: true, subBrandHidden: true },
      'Global Brands': { notAvailable: true },
    },
    country: {
      'All Brands': {},
      Portfolio: {},
      'Beer Price Segment': { brandLocked: true },
      'Global Brands': { notAvailable: true },
    },
  },
  [KPI.VOLUME]: {
    global: {
      'All Brands': { subBrandHidden: true },
      Portfolio: { brandHidden: true, subBrandHidden: true },
      'Beer Price Segment': {
        brandHidden: true,
        subBrandHidden: true,
        allowed: ['Super Premium', 'Premium', 'Core+', 'Core', 'Value'],
      },
      'Global Brands': {
        noAllOption: true,
        defaultFirstAlphabetical: true,
        subBrandHidden: true,
      },
    },
    zone: {
      'All Brands': { brandLocked: true, subBrandHidden: true },
      Portfolio: { brandLocked: true, subBrandHidden: true },
      'Beer Price Segment': { brandLocked: true, subBrandHidden: true },
      'Global Brands': { notAvailable: true },
    },
    eur: {
      'All Brands': { brandLocked: true, subBrandHidden: true },
      Portfolio: { brandHidden: true, subBrandHidden: true },
      'Beer Price Segment': { brandHidden: true, subBrandHidden: true },
      'Global Brands': {
        noAllOption: true,
        defaultFirstAlphabetical: true,
        subBrandHidden: true,
      },
    },
    country: {
      'All Brands': {},
      Portfolio: { brandLocked: true },
      'Beer Price Segment': { brandLocked: true },
      'Global Brands': { noAllOption: true, defaultFirstAlphabetical: true },
    },
  },
  [KPI.NET_REVENUE]: {
    global: {
      'All Brands': { subBrandHidden: true },
      Portfolio: { brandHidden: true, subBrandHidden: true },
      'Beer Price Segment': {
        brandHidden: true,
        subBrandHidden: true,
        allowed: ['Super Premium', 'Premium', 'Core+', 'Core', 'Value'],
      },
      'Global Brands': {
        noAllOption: true,
        defaultFirstAlphabetical: true,
        subBrandHidden: true,
      },
    },
    zone: {
      'All Brands': { brandLocked: true, subBrandHidden: true },
      Portfolio: { brandLocked: true, subBrandHidden: true },
      'Beer Price Segment': { brandLocked: true, subBrandHidden: true },
      'Global Brands': { notAvailable: true },
    },
    eur: {
      'All Brands': { brandLocked: true, subBrandHidden: true },
      Portfolio: { brandHidden: true, subBrandHidden: true },
      'Beer Price Segment': { brandHidden: true, subBrandHidden: true },
      'Global Brands': {
        noAllOption: true,
        defaultFirstAlphabetical: true,
        subBrandHidden: true,
      },
    },
    country: {
      'All Brands': {},
      Portfolio: { brandLocked: true },
      'Beer Price Segment': { brandLocked: true },
      'Global Brands': { noAllOption: true, defaultFirstAlphabetical: true },
    },
  },
  [KPI.CORES]: {
    global: {
      'All Brands': { subBrandHidden: true },
      Portfolio: { brandHidden: true, subBrandHidden: true },
      'Beer Price Segment': {
        brandHidden: true,
        subBrandHidden: true,
        allowed: ['Super Premium', 'Premium', 'Core+', 'Core', 'Value'],
      },
      'Global Brands': {
        noAllOption: true,
        defaultFirstAlphabetical: true,
        subBrandHidden: true,
      },
    },
    zone: {
      'All Brands': { brandLocked: true, subBrandHidden: true },
      Portfolio: { brandLocked: true, subBrandHidden: true },
      'Beer Price Segment': { brandLocked: true, subBrandHidden: true },
      'Global Brands': { notAvailable: true },
    },
    eur: {
      'All Brands': { brandLocked: true, subBrandHidden: true },
      Portfolio: { brandHidden: true, subBrandHidden: true },
      'Beer Price Segment': { brandHidden: true, subBrandHidden: true },
      'Global Brands': {
        noAllOption: true,
        defaultFirstAlphabetical: true,
        subBrandHidden: true,
      },
    },
    country: {
      'All Brands': {},
      Portfolio: { brandLocked: true },
      'Beer Price Segment': { brandLocked: true },
      'Global Brands': { noAllOption: true, defaultFirstAlphabetical: true },
    },
  },
  [KPI.MARKET_SHARE]: {
    global: {
      'All Brands': {},
      'Global Brands': { notAvailable: true },
      Portfolio: { brandLocked: true, subBrandHidden: true },
      'Beer Price Segment': { brandLocked: true, subBrandHidden: true },
    },
    zone: {
      'All Brands': {
        subBrandHidden: true,
      },
      'Global Brands': { notAvailable: true },
      Portfolio: { brandLocked: true, subBrandHidden: true },
      'Beer Price Segment': { brandLocked: true, subBrandHidden: true },
    },
    eur: {
      'All Brands': {
        subBrandHidden: true,
        brandLocked: true,
      },
      'Global Brands': { notAvailable: true },
      Portfolio: { brandLocked: true, subBrandHidden: true },
      'Beer Price Segment': { brandLocked: true, subBrandHidden: true },
    },
    country: {
      'All Brands': {},
      'Global Brands': { notAvailable: true },
      Portfolio: { brandLocked: true, subBrandHidden: true },
      'Beer Price Segment': { brandLocked: true, subBrandHidden: true },
    },
  },
};

import { DEFAULT_ENDPOINTS, MARKET_SHARE_ENDPOINTS } from '../../../config/api';
import { pageSections } from './sections';

export interface GrowthLeverSubFilters {
  bar?: { page_type: string };
  waterfall?: { page_type: string };
  line?: { page_type: string };
}

export type TableOrderItem = 'priorities' | 'portfolio' | 'markets';

interface GrowthLeverBffSubFilter {
  growth_lever: string;
}

export interface GrowthLeverMainSubFilters {
  page_type: string;
  growth_lever: string;
  dt_ini: null;
  bigNumbers: GrowthLeverBffSubFilter;
  topBottomBrands: GrowthLeverBffSubFilter;
}

export interface GrowthLeverPortfolioConfig {
  pageType: string;
  dataKey: string;
  endpoint?: string;
  tableOrder?: TableOrderItem[];
}

export interface GrowthLeverConfig {
  title: string;
  endpoints: Record<Exclude<TableOrderItem, 'markets'>, string>;
  growthLeverKey: string;
  section: string;
  coverSection: string;
  volumeCountriesBreakdown: string;
  topBrandsYtd: string;
  topBrandsMtd: string;
  mainSubFilters: GrowthLeverMainSubFilters;
  prioritiesPageType?: string;
  prioritiesGrowthLever?: string;
  brand?: string;
  portfolioConfig?: GrowthLeverPortfolioConfig;
  tableOrder?: TableOrderItem[];
}

export type GrowthLevers = Record<string, GrowthLeverConfig>;

export const DEFAULT_GROWTH_LEVERS: GrowthLevers = {
  superiorCore: {
    title: 'Superior Core',
    endpoints: {
      priorities: DEFAULT_ENDPOINTS.segmentsGbTable,
      portfolio: DEFAULT_ENDPOINTS.segmentsGbPortfolio,
    },
    growthLeverKey: 'Superior Core',
    section: pageSections.superiorCoreGlobal,
    coverSection: pageSections.superiorCoreCover,
    volumeCountriesBreakdown: pageSections.superiorCoreVolumeCountriesBreakdown,
    topBrandsYtd: pageSections.superiorCoreTopBrandsYtd,
    topBrandsMtd: pageSections.superiorCoreTopBrandsMtd,
    mainSubFilters: {
      page_type: 'Superior Core',
      growth_lever: 'Superior Core',
      dt_ini: null,
      bigNumbers: { growth_lever: 'Superior Core' },
      topBottomBrands: { growth_lever: 'Superior Core' },
    },
    prioritiesPageType: 'Superior Core',
    portfolioConfig: {
      pageType: 'Superior Core - Portfolio',
      dataKey: 'portfolio',
    },
    tableOrder: ['priorities', 'portfolio', 'markets'],
  },
  leadPremium: {
    title: 'Lead Premium',
    endpoints: {
      priorities: DEFAULT_ENDPOINTS.segmentsGbTable,
      portfolio: DEFAULT_ENDPOINTS.segmentsGbTable,
    },
    growthLeverKey: 'Lead Premium',
    section: pageSections.leadPremiumGlobal,
    coverSection: pageSections.leadPremiumCover,
    volumeCountriesBreakdown: pageSections.leadPremiumVolumeCountriesBreakdown,
    topBrandsYtd: pageSections.leadPremiumTopBrandsYtd,
    topBrandsMtd: pageSections.leadPremiumTopBrandsMtd,
    mainSubFilters: {
      dt_ini: null,
      page_type: 'Lead Premium',
      growth_lever: 'Lead Premium',
      bigNumbers: { growth_lever: 'Lead Premium' },
      topBottomBrands: { growth_lever: 'Lead Premium' },
    },
    prioritiesPageType: 'Lead Premium',
    portfolioConfig: {
      pageType: 'Global Brands Lead Premium',
      dataKey: 'segments-table',
    },
    tableOrder: ['priorities', 'portfolio', 'markets'],
  },
  nonAlcBeer: {
    title: 'Non Alc Beer',
    endpoints: {
      priorities: DEFAULT_ENDPOINTS.segmentsGbTable,
      portfolio: DEFAULT_ENDPOINTS.segmentsGbPortfolio,
    },
    growthLeverKey: 'Non Alc Beer',
    section: pageSections.nonAlcBeerGlobalMoves,
    coverSection: pageSections.nonAlcBeerCover,
    volumeCountriesBreakdown: pageSections.nonAlcBeerVolumeCountriesBreakdown,
    topBrandsYtd: pageSections.nonAlcBeerTopBrandsYtd,
    topBrandsMtd: pageSections.nonAlcBeerTopBrandsMtd,
    mainSubFilters: {
      dt_ini: null,
      page_type: 'Non Alc Beer',
      growth_lever: 'Non Alc Beer',
      bigNumbers: { growth_lever: 'Non Alc Beer' },
      topBottomBrands: { growth_lever: 'Non Alc Beer' },
    },
    prioritiesPageType: 'Non Alc Beer',
  },
  beyondBeer: {
    title: 'Beyond Beer',
    endpoints: {
      priorities: DEFAULT_ENDPOINTS.segmentsGbTable,
      portfolio: DEFAULT_ENDPOINTS.segmentsGbPortfolio,
    },
    growthLeverKey: 'Beyond Beer',
    section: pageSections.beyondBeerGlobalMoves,
    coverSection: pageSections.beyondBeerCover,
    volumeCountriesBreakdown: pageSections.beyondBeerVolumeCountriesBreakdown,
    topBrandsYtd: pageSections.beyondBeerTopBrandsYtd,
    topBrandsMtd: pageSections.beyondBeerTopBrandsMtd,
    mainSubFilters: {
      dt_ini: null,
      page_type: 'Beyond Beer',
      growth_lever: 'Beyond Beer',
      bigNumbers: { growth_lever: 'Beyond Beer' },
      topBottomBrands: { growth_lever: 'Beyond Beer' },
    },
    prioritiesPageType: 'Beyond Beer',
  },
  balancedChoices: {
    title: 'Balanced Choices',
    endpoints: {
      priorities: DEFAULT_ENDPOINTS.segmentsGbTable,
      portfolio: DEFAULT_ENDPOINTS.segmentsGbPortfolio,
    },
    growthLeverKey: 'Balanced Choices',
    section: pageSections.balancedChoicesGlobal,
    coverSection: pageSections.balancedChoicesCover,
    volumeCountriesBreakdown:
      pageSections.balancedChoicesVolumeCountriesBreakdown,
    topBrandsYtd: pageSections.balancedChoicesTopBrandsYtd,
    topBrandsMtd: pageSections.balancedChoicesTopBrandsMtd,
    mainSubFilters: {
      dt_ini: null,
      page_type: 'Balanced Choices',
      growth_lever: 'Balanced Choices',
      bigNumbers: { growth_lever: 'Balanced Choices' },
      topBottomBrands: { growth_lever: 'Balanced Choices' },
    },
    prioritiesPageType: 'Balanced Choices',
  },
};

export const VOLUME_GROWTH_LEVERS: GrowthLevers = DEFAULT_GROWTH_LEVERS;

export const NR_GROWTH_LEVERS: GrowthLevers = DEFAULT_GROWTH_LEVERS;

export const CORES_GROWTH_LEVERS: GrowthLevers = DEFAULT_GROWTH_LEVERS;

export const POWER_GROWTH_LEVERS: GrowthLevers = DEFAULT_GROWTH_LEVERS;

export const MARKET_SHARE_GROWTH_LEVERS: GrowthLevers = {
  superiorCore: {
    title: 'Superior Core',
    endpoints: {
      priorities: MARKET_SHARE_ENDPOINTS.segmentsGbTable,
      portfolio: MARKET_SHARE_ENDPOINTS.segmentsGbPortfolio,
    },
    growthLeverKey: 'Superior Core',
    section: pageSections.superiorCoreGlobal,
    coverSection: pageSections.superiorCoreCover,
    volumeCountriesBreakdown: pageSections.superiorCoreVolumeCountriesBreakdown,
    topBrandsYtd: pageSections.superiorCoreTopBrandsYtd,
    topBrandsMtd: pageSections.superiorCoreTopBrandsMtd,
    mainSubFilters: {
      page_type: 'Superior Core',
      growth_lever: 'Superior Core',
      dt_ini: null,
      bigNumbers: { growth_lever: 'Superior Core' },
      topBottomBrands: { growth_lever: 'Superior Core' },
    },
    portfolioConfig: {
      pageType: 'Superior Core - Portfolio',
      dataKey: 'portfolio',
    },
    tableOrder: ['markets'],
  },
  leadPremium: {
    title: 'Lead Premium',
    endpoints: {
      priorities: MARKET_SHARE_ENDPOINTS.segmentsGbTable,
      portfolio: MARKET_SHARE_ENDPOINTS.segmentsGbPortfolio,
    },
    growthLeverKey: 'Lead Premium',
    section: pageSections.leadPremiumGlobal,
    coverSection: pageSections.leadPremiumCover,
    volumeCountriesBreakdown: pageSections.leadPremiumVolumeCountriesBreakdown,
    topBrandsYtd: pageSections.leadPremiumTopBrandsYtd,
    topBrandsMtd: pageSections.leadPremiumTopBrandsMtd,
    mainSubFilters: {
      dt_ini: null,
      page_type: 'Lead Premium',
      growth_lever: 'Lead Premium',
      bigNumbers: { growth_lever: 'Lead Premium' },
      topBottomBrands: { growth_lever: 'Lead Premium' },
    },
    prioritiesGrowthLever: 'All',
    portfolioConfig: {
      pageType: 'Global Brands',
      dataKey: 'segments-table',
    },
    tableOrder: ['priorities', 'markets'],
  },
};

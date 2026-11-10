import { pageSections } from './sections';

export const COUNTRY_MARKET_TITLE_MESSAGE_ID =
  'ValueCreation.VolumePages.countryMarketTitle' as const;

export const COUNTRY_MARKET_BRANDS_BREAKDOWN_TITLE_MESSAGE_ID =
  'ValueCreation.VolumePages.countryMarketBrandsBreakdownTitle' as const;

export const COUNTRIES = {
  BRA: {
    countryName: 'Brazil',
    zone: 'SAZ',
    coverSection: pageSections.braCover,
    section: pageSections.braVolume,
    barChartSection: pageSections.braBarCountryChart,
    subFilters: {
      country: 'BRA',
      zone: 'SAZ',
    },
  },
  USA: {
    countryName: 'United States',
    zone: 'NAZ',
    coverSection: pageSections.usaCover,
    section: pageSections.usaVolume,
    barChartSection: pageSections.usaBarCountryChart,
    subFilters: {
      country: 'USA',
      zone: 'NAZ',
    },
  },
  MEX: {
    countryName: 'Mexico',
    zone: 'MAZ',
    coverSection: pageSections.mexCover,
    section: pageSections.mexVolume,
    barChartSection: pageSections.mexBarCountryChart,
    subFilters: {
      country: 'MEX',
      zone: 'MAZ',
    },
  },
  CHN: {
    countryName: 'China',
    zone: 'APAC',
    coverSection: pageSections.chnCover,
    section: pageSections.chnVolume,
    barChartSection: pageSections.chnBarCountryChart,
    subFilters: {
      country: 'CHN',
      zone: 'APAC',
    },
  },
  ZAF: {
    countryName: 'South Africa',
    zone: 'AFR',
    coverSection: pageSections.zafCover,
    section: pageSections.zafVolume,
    barChartSection: pageSections.zafBarCountryChart,
    subFilters: {
      country: 'ZAF',
      zone: 'AFR',
    },
  },
  EUR: {
    countryName: 'Europe',
    zone: 'EUR',
    coverSection: pageSections.eurCover,
    section: pageSections.eurVolume,
    barChartSection: pageSections.eurBarCountryChart,
    subFilters: {
      country: 'EUR',
      zone: 'EUR',
    },
  },
  KOR: {
    countryName: 'South Korea',
    zone: 'APAC',
    coverSection: pageSections.korCover,
    section: pageSections.korVolume,
    barChartSection: pageSections.korBarCountryChart,
    subFilters: {
      country: 'KOR',
      zone: 'APAC',
    },
  },
  CAN: {
    countryName: 'Canada',
    zone: 'NAZ',
    coverSection: pageSections.canCover,
    section: pageSections.canVolume,
    barChartSection: pageSections.canBarCountryChart,
    subFilters: {
      country: 'CAN',
      zone: 'NAZ',
    },
  },
  COL: {
    countryName: 'Colombia',
    zone: 'MAZ',
    coverSection: pageSections.colCover,
    section: pageSections.colVolume,
    barChartSection: pageSections.colBarCountryChart,
    subFilters: {
      country: 'COL',
      zone: 'MAZ',
    },
  },
  ARG: {
    countryName: 'Argentina',
    zone: 'SAZ',
    coverSection: pageSections.argCover,
    section: pageSections.argVolume,
    barChartSection: pageSections.argBarCountryChart,
    subFilters: {
      country: 'ARG',
      zone: 'SAZ',
    },
  },
  PER: {
    countryName: 'Peru',
    zone: 'MAZ',
    coverSection: pageSections.perCover,
    section: pageSections.perVolume,
    barChartSection: pageSections.perBarCountryChart,
    subFilters: {
      country: 'PER',
      zone: 'MAZ',
    },
  },
  NGA: {
    countryName: 'Nigeria',
    zone: 'AFR',
    coverSection: pageSections.ngaCover,
    section: pageSections.ngaVolume,
    barChartSection: pageSections.ngaBarCountryChart,
    subFilters: {
      country: 'NGA',
      zone: 'AFR',
    },
  },
  IND: {
    countryName: 'India',
    zone: 'APAC',
    coverSection: pageSections.indCover,
    section: pageSections.indVolume,
    barChartSection: pageSections.indBarCountryChart,
    subFilters: {
      country: 'IND',
      zone: 'APAC',
    },
  },
  DOM: {
    countryName: 'Dominican Republic',
    zone: 'MAZ',
    coverSection: pageSections.domCover,
    section: pageSections.domVolume,
    barChartSection: pageSections.domBarCountryChart,
    subFilters: {
      country: 'DOM',
      zone: 'MAZ',
    },
  },
  ECU: {
    countryName: 'Ecuador',
    zone: 'MAZ',
    coverSection: pageSections.ecuCover,
    section: pageSections.ecuVolume,
    barChartSection: pageSections.ecuBarCountryChart,
    subFilters: {
      country: 'ECU',
      zone: 'MAZ',
    },
  },
};

/**
 * Zone code per country (derived from COUNTRIES). For building One Way cover links.
 * Must match backend zone_countries / filter options.
 */
export const COUNTRY_TO_ZONE: Record<string, string> = Object.fromEntries(
  Object.entries(COUNTRIES).map(([code, config]) => [code, config.zone]),
);

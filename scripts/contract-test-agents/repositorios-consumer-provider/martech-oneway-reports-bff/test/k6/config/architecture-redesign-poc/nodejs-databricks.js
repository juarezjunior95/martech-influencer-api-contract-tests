/**
 * Architecture Redesign PoC - NodeJS + Databricks Configuration
 */

import { countries } from '../countries.js';

export const config = {
  groupName: 'NodeJS + Databricks - Brand Power Book Overview (Main Filters)',
  baseUrl: {
    uat: 'https://one.martech.uat.bees-platform.dev/api/martech-oneway-reports-bff'
  },
  endpoints: [
    '/v1/views/portfolio-brand_brand-power-book_power-book_zone-maturity',
    '/v1/views/portfolio-brand_brand-power-book_power-book_countries-contribution',
    '/v1/views/portfolio-brand_brand-power-book_power-book_overview'
  ],
  queryParams: [
    {
      "filter[viewtype]": "global",
      "filter[page_filter]": "All",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[dt_end]": "2025-09-01"
    },
    {
      "filter[viewtype]": "global",
      "filter[page_filter]": "Megabrands",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[dt_end]": "2025-09-01"
    },
    {
      "filter[viewtype]": "global",
      "filter[page_filter]": "Expansion",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[dt_end]": "2025-09-01"
    },
    {
      "filter[viewtype]": "global",
      "filter[page_filter]": "Sustain",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[dt_end]": "2025-09-01"
    },
    {
      "filter[viewtype]": "global",
      "filter[page_filter]": "Tail",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[dt_end]": "2025-09-01"
    },
    {
      "filter[viewtype]": "global",
      "filter[page_filter]": "Premiumization",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[dt_end]": "2025-09-01"
    },
    {
      "filter[viewtype]": "global",
      "filter[page_filter]": "Core+",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[dt_end]": "2025-09-01"
    },
    {
      "filter[viewtype]": "global",
      "filter[page_filter]": "Mainstream",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[dt_end]": "2025-09-01"
    },
    {
      "filter[viewtype]": "global",
      "filter[page_filter]": "Beyond Beer",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[dt_end]": "2025-09-01"
    }
  ],
  randomFilters: {
    'filter[country]': countries
  }
};

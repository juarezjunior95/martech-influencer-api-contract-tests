/**
 * Architecture Redesign PoC - Drupal + Databricks Configuration
 */

import { countries } from '../countries.js';

export const config = {
  groupName: 'Drupal + Databricks - Brand Power Book Overview (Main Filters)',
  baseUrl: {
    uat: 'https://theloop20.test-abinbev.acsitefactory.com'
  },
  endpoints: [
    '/api/v2/kpi/owr_brand-power-book_performance-breadown_by-top-countries-contribution',
    '/api/v2/kpi/owr_brand-power-book_performance-breadown_by-maturity',
    '/api/v2/kpi/owr_brand-power-book_performance-breadown_by-zone',
    '/api/v2/kpi/owr_brand-power-book_power-performance-trend_by-year-power-ac_trend-over-time',
    '/api/v2/kpi/owr_brand-power-book_big-numbers'
  ],
  queryParams: [
    {
      "pageName": "brand-power-book",
      "kpiGroup": "power",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[timeframe]": "2025"
    },
    {
      "pageName": "brand-power-book",
      "kpiGroup": "power",
      "filter[scope]": "portfolio",
      "filter[sub_scope]": "Megabrands",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[timeframe]": "2025"
    },
    {
      "pageName": "brand-power-book",
      "kpiGroup": "power",
      "filter[scope]": "portfolio",
      "filter[sub_scope]": "Expansion",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[timeframe]": "2025"
    },
    {
      "pageName": "brand-power-book",
      "kpiGroup": "power",
      "filter[scope]": "portfolio",
      "filter[sub_scope]": "Sustain",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[timeframe]": "2025"
    },
    {
      "pageName": "brand-power-book",
      "kpiGroup": "power",
      "filter[scope]": "portfolio",
      "filter[sub_scope]": "Tail",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[timeframe]": "2025"
    },
    {
      "pageName": "brand-power-book",
      "kpiGroup": "power",
      "filter[scope]": "segment",
      "filter[sub_scope]": "Premiumization",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[timeframe]": "2025"
    },
    {
      "pageName": "brand-power-book",
      "kpiGroup": "power",
      "filter[scope]": "segment",
      "filter[sub_scope]": "Core+",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[timeframe]": "2025",
      "filter[zone_maturity]": ""
    },
    {
      "pageName": "brand-power-book",
      "kpiGroup": "power",
      "filter[scope]": "segment",
      "filter[sub_scope]": "Mainstream",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[timeframe]": "2025"
    },
    {
      "pageName": "brand-power-book",
      "kpiGroup": "power",
      "filter[scope]": "segment",
      "filter[sub_scope]": "Beyond Beer",
      "filter[zone]": "ABI",
      "filter[country]": "ABI",
      "filter[timeframe]": "2025"
    }
  ],
  randomFilters: {
    'filter[country]': countries
  }
};

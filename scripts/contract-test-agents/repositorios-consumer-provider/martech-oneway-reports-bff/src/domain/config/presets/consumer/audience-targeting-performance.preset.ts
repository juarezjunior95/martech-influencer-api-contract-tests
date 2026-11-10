import { PresetConfig } from "../../../entities/preset.entity";
import { buildZoneCountryFilters } from "../common/zone-country.builder";
import { AUDIENCE_TARGETING_CODES } from "../common/country-scopes";

/**
 * BFF preset for the Consumer - Audience Targeting Performance - Core Audience Performance page.
 *
 * Populates: country/zone selectors, periods filter (R12M scope),
 * brand filter (audience-targeting-brands), competitor filter
 * (audience-targeting-competitors) and KPI selector (kpis).
 */

const { zones, country } = buildZoneCountryFilters({
  countries: AUDIENCE_TARGETING_CODES,
});

const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    zones,
    country,
    "audience-targeting-brands": {
      filters: [],
      formatter: "presets/filter-name-normalization",
    },
    periods: {
      filters: [{ name: "scope", value: "R12M" }],
    },
    kpis: {
      filters: [{ name: "kpi_groups", value: "audience_targeting" }],
    },
  },
};

export default config;

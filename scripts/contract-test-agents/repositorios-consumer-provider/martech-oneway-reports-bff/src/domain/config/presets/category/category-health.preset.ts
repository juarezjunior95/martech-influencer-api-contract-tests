import { PresetConfig } from "@domain/entities/preset.entity";
import { buildZoneCountryFilters } from "@domain/config/presets/common/zone-country.builder";
import { CATEGORY_HEALTH_CODES } from "../common/country-scopes";

/**
 * BFF preset for the Category - Category Health page.
 */

const { zones, country } = buildZoneCountryFilters(
  {
    countries: CATEGORY_HEALTH_CODES,
  },
  "category_category-health",
);

const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    country,
    zones,
    years: {},
    segments: {
      filters: [{ name: "scope", value: "category_health" }],
    },
  },
};

export default config;

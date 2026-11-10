import { PresetConfig } from "@domain/entities/preset.entity";
import { buildZoneCountryFilters } from "@domain/config/presets/common/zone-country.builder";
import { BRAND_POWER_RESULTS_CODES } from "../common/country-scopes";
import { buildBrandPowerResultsFilters } from "@domain/config/presets/common/brand-power-results.builder";
import { buildTimeFrameFilters } from "@domain/config/presets/common/time-frame.builder";

/**
 * BFF preset for Portfolio Brand — brand power results (composite data-service refs).
 */
const { zones, country } = buildZoneCountryFilters(
  {
    countries: BRAND_POWER_RESULTS_CODES,
  },
  "brand-power-results",
);

const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    ...buildBrandPowerResultsFilters(),
    zones,
    country,
    ...buildTimeFrameFilters(),
    portfolio: {
      filters: [
        { name: "noDefault", value: true },
        { name: "ignoreNab", value: true },
      ],
    },
    segments: {
      filters: [
        { name: "noDefault", value: true },
        { name: "scope", value: "brand_power_book" },
      ],
    },
  },
};

export default config;

import { PresetConfig } from "@domain/entities/preset.entity";
import { buildZoneCountryFilters } from "@domain/config/presets/common/zone-country.builder";
import { BRAND_POWER_RESULTS_CODES } from "../common/country-scopes";
import { buildTimeFrameFilters } from "@domain/config/presets/common/time-frame.builder";

/**
 * BFF preset for Portfolio Brand — brand power results export (composite data-service refs).
 */
const { zones, country } = buildZoneCountryFilters({
  countries: BRAND_POWER_RESULTS_CODES,
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
    periods: {
      filters: [{ name: "scope", value: "YTD" }],
    },
    ...buildTimeFrameFilters(),
  },
};

export default config;

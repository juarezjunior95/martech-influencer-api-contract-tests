import { PresetConfig } from "@domain/entities/preset.entity";
import { buildZoneCountryFilters } from "@domain/config/presets/common/zone-country.builder";
import { RESOURCE_ALLOCATION_MEDIA_SCOPE } from "../common/country-scopes";
import { buildTimeFrameFilters } from "@domain/config/presets/common/time-frame.builder";

/**
 * BFF preset for the Category - Home page.
 */

const { zones, country } = buildZoneCountryFilters({
  countries: RESOURCE_ALLOCATION_MEDIA_SCOPE,
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

import { PresetConfig } from "@domain/entities/preset.entity";
import { buildZoneCountryFilters } from "@domain/config/presets/common/zone-country.builder";
import { buildTimeFrameFilters } from "@domain/config/presets/common/time-frame.builder";
import { INNOVATION_SCOPE } from "../common/country-scopes";

/**
 * BFF preset for the Innovation - Home page.
 */

const { zones, country } = buildZoneCountryFilters({
  countries: INNOVATION_SCOPE,
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

import { PresetConfig } from "@domain/entities/preset.entity";
import { buildZoneCountryFilters } from "@domain/config/presets/common/zone-country.builder";
import { buildTimeFrameFilters } from "@domain/config/presets/common/time-frame.builder";
import { POS_BOOK_SCOPE } from "../common/country-scopes";

/**
 * BFF preset for the Consumer - Audience Targeting page.
 */

const { zones, country } = buildZoneCountryFilters({
  countries: POS_BOOK_SCOPE,
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
    ...buildTimeFrameFilters(),
    periods: {
      filters: [{ name: "scope", value: "YTD" }],
    },
  },
};

export default config;

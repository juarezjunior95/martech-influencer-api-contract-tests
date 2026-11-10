import { PresetConfig } from "@domain/entities/preset.entity";

import { buildTimeFrameFilters } from "@domain/config/presets/common/time-frame.builder";
import { COUNTRY_PPR_SCOPE } from "@domain/config/presets/common/country-scopes";
import { buildZoneCountryFilters } from "@domain/config/presets/common/zone-country.builder";

/**
 * BFF preset for the Value Creation - Volume pages.
 */

const { zones, country } = buildZoneCountryFilters({
  countries: COUNTRY_PPR_SCOPE,
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
  },
};

export default config;

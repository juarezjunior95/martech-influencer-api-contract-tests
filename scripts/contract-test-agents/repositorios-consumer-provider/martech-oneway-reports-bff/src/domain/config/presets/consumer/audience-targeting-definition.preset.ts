import { PresetConfig } from "../../../entities/preset.entity";
import { buildZoneCountryFilters } from "../common/zone-country.builder";
import { buildTimeFrameFilters } from "../common/time-frame.builder";
import { AUDIENCE_TARGETING_CODES } from "../common/country-scopes";

/**
 * BFF preset for the Consumer - Audience Targeting Definition - Brand Audience page.
 *
 * Populates: country/zone selectors, time-frame date picker (dt_end),
 * periods filter (R12M scope), brand filter (audience-targeting-brands)
 * and competitor filter (audience-targeting-competitors).
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
    ...buildTimeFrameFilters(),
    periods: {
      filters: [{ name: "scope", value: "R12M" }],
    },
    "audience-targeting-brands": {
      filters: [],
      formatter: "presets/filter-name-normalization",
    },
  },
};

export default config;

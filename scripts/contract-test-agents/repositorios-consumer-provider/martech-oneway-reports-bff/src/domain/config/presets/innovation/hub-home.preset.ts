import { PresetConfig } from "@domain/entities/preset.entity";
import { buildZoneCountryFilters } from "@domain/config/presets/common/zone-country.builder";
import { buildTimeFrameFilters } from "@domain/config/presets/common/time-frame.builder";
import { INNOVATION_SCOPE } from "@domain/config/presets/common/country-scopes";

/**
 * BFF preset for the Innovation Hub — Home page.
 *
 * Consumed as `GET /presets/innovation_hub-home` (underscores encode `/`
 * between path segments: `innovation/hub-home.preset.ts`).
 *
 * Composes Data-Service presets: `zones`, `country`, `periods`, `time-frame`.
 * Country list matches Innovation Home scope; split into a dedicated
 * `INNOVATION_HUB_SCOPE` in country-scopes when Hub geography diverges.
 */
const { zones, country } = buildZoneCountryFilters(
  {
    countries: INNOVATION_SCOPE,
  },
  "innovation_hub_home",
);

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

import { PresetConfig } from "@domain/entities/preset.entity";
import { buildZoneCountryFilters } from "@domain/config/presets/common/zone-country.builder";
import { buildTimeFrameFilters } from "@domain/config/presets/common/time-frame.builder";
import { INNOVATION_SCOPE } from "@domain/config/presets/common/country-scopes";

/**
 * BFF preset for the Innovation Hub page (composite filters).
 *
 * API name: `innovation_hub` (underscore → path `innovation/hub`, flat file).
 *
 * Composes Data-Service presets: `kpis` (group `innovation_hub`), `zones`,
 * `country`, `periods`, `time-frame`.
 */
const { zones, country } = buildZoneCountryFilters(
  {
    countries: INNOVATION_SCOPE,
  },
  "innovation_hub",
);

const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    kpis: {
      filters: [{ name: "kpiGroups", value: "innovation_hub" }],
    },
    zones,
    country,
    periods: {
      filters: [{ name: "scope", value: "YTD" }],
    },
    ...buildTimeFrameFilters(),
  },
};

export default config;

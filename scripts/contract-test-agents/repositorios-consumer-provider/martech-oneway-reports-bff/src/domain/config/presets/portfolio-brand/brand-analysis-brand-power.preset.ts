import { PresetConfig } from "@domain/entities/preset.entity";
import { buildTimeFrameFilters } from "../common/time-frame.builder";
import { BRAND_ANALYSIS_SCOPE } from "../common/country-scopes";
import { buildZoneCountryFilters } from "../common/zone-country.builder";

const { zones, country } = buildZoneCountryFilters({
  countries: BRAND_ANALYSIS_SCOPE,
});

const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    "brands-abi": { formatter: "presets/filter-name-normalization" },
    "brands-comp": { formatter: "presets/filter-name-normalization" },
    country,
    ...buildTimeFrameFilters(),
    zones,
  },
};

export default config;

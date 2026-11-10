import { PresetConfig } from "@domain/entities/preset.entity";
import { buildZoneCountryFilters } from "@domain/config/presets/common/zone-country.builder";
import { buildTimeFrameFilters } from "@domain/config/presets/common/time-frame.builder";
import { BEES_DISTRIBUTION_COUNTRIES } from "../common/country-scopes";

const { zones, country } = buildZoneCountryFilters({
  countries: BEES_DISTRIBUTION_COUNTRIES,
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
    distributions: {
      formatter: "presets/distributions-rename",
    },
    ...buildTimeFrameFilters(),
  },
};

export default config;

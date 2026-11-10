import { PresetConfig } from "@domain/entities/preset.entity";
import { buildZoneCountryFilters } from "@domain/config/presets/common/zone-country.builder";
import { POS_BOOK_SCOPE } from "../common/country-scopes";
import { buildTimeFrameFilters } from "@domain/config/presets/common/time-frame.builder";

/**
 * BFF preset for the Category - POS Results page.
 */

const { zones, country } = buildZoneCountryFilters(
  {
    countries: POS_BOOK_SCOPE,
  },
  "category_pos-results",
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
    "pos-periods": {
      filters: [],
      formatter: "presets/filter-name-normalization",
    },
    ...buildTimeFrameFilters(),
  },
};

export default config;

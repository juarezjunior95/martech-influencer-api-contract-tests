import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for sub-filter options: income groups.
 *
 * Resolves as API name `sub-filters_income-groups`. Response branch key is
 * normalized to `income_groups` (hyphen → underscore), consistent with other
 * hyphenated preset refs.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    "income-groups": {
      filters: [],
      formatter: "presets/filter-name-normalization",
    },
  },
};

export default config;

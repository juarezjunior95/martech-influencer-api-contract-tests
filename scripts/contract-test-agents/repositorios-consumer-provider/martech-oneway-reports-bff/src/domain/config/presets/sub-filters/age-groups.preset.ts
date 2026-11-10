import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for sub-filter options: age groups.
 *
 * Resolves as API name `sub-filters_age-groups`. Response branch key is
 * normalized to `age_groups` (hyphen → underscore), consistent with other
 * hyphenated preset refs.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    "age-groups": {
      filters: [],
    },
  },
};

export default config;

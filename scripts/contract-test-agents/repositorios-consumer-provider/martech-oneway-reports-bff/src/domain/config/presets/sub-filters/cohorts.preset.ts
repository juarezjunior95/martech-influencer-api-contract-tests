import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for sub-filter options: cohorts.
 *
 * Resolves as API name `sub-filters_cohorts`.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    cohorts: {
      filters: [],
    },
  },
};

export default config;

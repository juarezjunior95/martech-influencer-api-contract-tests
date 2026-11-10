import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for sub-filter options: genders.
 *
 * Resolves as API name `sub-filters_genders`.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    genders: {},
  },
};

export default config;

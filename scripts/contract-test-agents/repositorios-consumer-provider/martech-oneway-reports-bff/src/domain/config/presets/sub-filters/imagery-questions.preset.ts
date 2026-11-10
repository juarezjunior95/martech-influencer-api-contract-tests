import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for sub-filter options: imagery-questions.
 *
 * Resolves as API name `sub-filters_imagery-questions`.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },

  preset: {
    "imagery-questions": {},
  },
};

export default config;

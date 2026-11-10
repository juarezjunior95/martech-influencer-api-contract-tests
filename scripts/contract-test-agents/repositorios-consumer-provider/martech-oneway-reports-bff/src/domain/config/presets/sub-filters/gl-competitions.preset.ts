import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for sub-filter options: GL Competitions.
 *
 * Resolves as API name `sub-filters_gl-competitions`.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    "gl-competitions": {
      filters: [{ name: "type", value: "cup" }],
    },
  },
};

export default config;

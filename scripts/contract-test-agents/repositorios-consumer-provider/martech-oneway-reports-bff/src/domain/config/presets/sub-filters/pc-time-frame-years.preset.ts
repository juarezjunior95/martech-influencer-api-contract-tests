import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for sub-filter options: pc-time-frame.
 *
 * Resolves as API name `sub-filters_pc-time-frame-years`.
 *
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },

  preset: {
    "pc-time-frame-years": {},
  },
};

export default config;

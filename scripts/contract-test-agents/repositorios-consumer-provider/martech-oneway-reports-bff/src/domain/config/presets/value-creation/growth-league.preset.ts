import { PresetConfig } from "@domain/entities/preset.entity";

import { buildTimeFrameFilters } from "@domain/config/presets/common/time-frame.builder";

/**
 * BFF preset for the Value Creation - Volume pages.
 */

const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    zones: {},
    country: {},
    ...buildTimeFrameFilters(),
  },
};

export default config;

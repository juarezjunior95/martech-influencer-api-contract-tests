import { PresetConfig } from "@domain/entities/preset.entity";

import { buildTimeFrameFilters } from "@domain/config/presets/common/time-frame.builder";

/**
 * BFF preset for the Value Creation - Market Share pages.
 */

const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    zones: {
      filters: [{ name: "excludeGlobal", value: true }],
    },
    country: {
      filters: [{ name: "excludeGlobal", value: true }],
    },
    ...buildTimeFrameFilters(),
  },
};

export default config;

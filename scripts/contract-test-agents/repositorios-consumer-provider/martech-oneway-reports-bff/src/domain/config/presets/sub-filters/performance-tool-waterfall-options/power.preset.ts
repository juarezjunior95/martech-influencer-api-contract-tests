import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for Performance Tool — performance tool waterfall options.
 */

const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    "performance-tool-waterfall-options": {
      filters: [{ name: "kpi", value: "power" }],
    },
  },
};

export default config;

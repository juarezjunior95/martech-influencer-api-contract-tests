import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for the Value Creation - Commercial Results filters.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    "commercial-results": {
      formatter: "presets/filter-name-normalization",
    },
  },
};

export default config;

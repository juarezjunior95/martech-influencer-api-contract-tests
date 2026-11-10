import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for the Value Creation - Performance Tool pages.
 */

const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    kpis: {
      filters: [{ name: "kpi_groups", value: "performance_tool" }],
    },
    "performance-tool": {
      filters: [],
      formatter: "presets/filter-name-normalization",
    },
  },
};

export default config;

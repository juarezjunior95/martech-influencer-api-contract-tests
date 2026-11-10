import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for sub-filter options: POS KPIs.
 *
 * Resolves as API name `sub-filters_pos-kpi`.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    "pos-kpi": {
      filters: [],
    },
  },
};

export default config;

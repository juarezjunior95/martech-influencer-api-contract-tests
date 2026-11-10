import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for sub-filter options: innovation KPIs.
 *
 * Resolves as API name `sub-filters_innovation_kpis`.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    kpis: {
      filters: [{ name: "kpiGroups", value: "innovation" }],
    },
  },
};

export default config;

import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for sub-filter options: resource allocation KPIs.
 *
 * Resolves as API name `sub-filters_kpis_resource-allocation-ranking`.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    kpis: {
      filters: [{ name: "kpiGroups", value: "resource_allocation_ranking" }],
    },
  },
};

export default config;

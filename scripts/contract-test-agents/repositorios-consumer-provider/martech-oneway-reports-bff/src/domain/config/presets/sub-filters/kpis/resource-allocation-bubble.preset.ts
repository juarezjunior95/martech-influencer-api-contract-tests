import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF preset for sub-filter options: resource allocation KPIs.
 *
 * Resolves as API name `sub-filters_kpis_resource-allocation-bubble`.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    kpis: {
      filters: [{ name: "kpiGroups", value: "resource_allocation_bubble" }],
    },
  },
};

export default config;

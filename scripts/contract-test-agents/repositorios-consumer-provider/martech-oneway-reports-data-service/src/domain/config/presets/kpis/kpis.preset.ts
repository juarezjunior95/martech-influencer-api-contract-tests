import { PresetConfig } from "@domain/entities/preset.entity";
import { kpisHandler } from "@domain/config/presets/kpis/kpis.handler";
import type { KpisPresetConfig } from "@domain/config/presets/kpis/kpis.types";

/**
 * `kpis` preset — static KPI option lists keyed by legacy Drupal
 * `kpi_groups` (`Kpis.php` / `Kpi.php`).
 *
 * Endpoint: `GET /v1/presets/kpis`.
 *
 * Overrides use the generic namespaced query shape, e.g.
 * `?kpis[kpi_groups]=performance_tool,innovation,innovation_hub` (CSV expands to
 * `string[]` in the entity pipeline).
 */
const kpisPreset: { kpis: KpisPresetConfig } = {
  kpis: {
    kpiGroups: [],
  },
};

const config: PresetConfig<typeof kpisPreset> = {
  version: "1.0.0",
  handler: kpisHandler,
  preset: kpisPreset,
};

export default config;

import { PresetConfig } from "@domain/entities/preset.entity";

/**
 * BFF-side configuration for the `kpi-group` preset.
 *
 * Forwards to the data-service preset of the same name (a flat
 * passthrough of the legacy Drupal `kpi_group_time_frame` config:
 * per-KPI cutoff dates plus the `category_health_full_years_*`
 * range), caches the result, and skips JSONata formatting — the
 * data-service already emits the expected snake_case shape.
 *
 * Endpoint: `GET /v1/presets/kpi-group`.
 */
const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    "kpi-group": {
      filters: [],
    },
  },
};

export default config;

import { PresetConfig } from "@domain/entities/preset.entity";
import { valueCreationHandler } from "@domain/config/presets/value-creation/value-creation.handler";

/**
 * `value-creation` preset — Value Creation homepage filter payload
 * (country / zones / periods) aligned with Drupal `ValueCreation` and
 * `PerformanceToolDto`, with raw combinations loaded from Databricks via the
 * {@link VALUE_CREATION_FILTER_SP_NAME} statement (`owr_result_query_sp`)
 * instead of the legacy `filter_value-creation` recipe dataset.
 *
 * The handler also loads `presets/kpi-group/kpi-group` for volume refresh
 * dates used in period labels (same pattern as `performance-tool`).
 *
 * Endpoint: `GET /v1/presets/value-creation`.
 *
 * The `data` object matches Drupal JSON: top-level `country`, `zones`, and
 * `periods` only.
 */
const valueCreationPreset = {} as const;

const config: PresetConfig<Record<string, never>> = {
  version: "1.0.0",
  handler: valueCreationHandler,
  preset: valueCreationPreset,
};

export default config;

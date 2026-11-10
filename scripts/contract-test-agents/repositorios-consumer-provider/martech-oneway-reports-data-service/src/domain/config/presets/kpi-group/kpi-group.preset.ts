import { PresetConfig } from "@domain/entities/preset.entity";
import { kpiGroupHandler } from "@domain/config/presets/kpi-group/kpi-group.handler";
import { KpiGroupFilterItem } from "@domain/config/presets/kpi-group/kpi-group.types";

/**
 * `kpi-group` preset — query-backed.
 *
 * Endpoint: `GET /v1/presets/kpi-group`.
 *
 * The handler loads `presets/kpi-group/kpi-group.sql`, reads
 * `{ kpi_name, time_frame }` rows, and emits a flat
 * `kpi_name -> time_frame` map at the response root — preserving the
 * legacy Drupal-parity shape consumers already expect.
 *
 * Numeric-looking values are coerced back to numbers by the handler,
 * so the `category_health_full_years_*` range stays a number range and
 * the per-KPI cut-off dates stay raw `DD-MM-YYYY` strings.
 */
const kpiGroup: KpiGroupFilterItem = {
  type: "kpi-group",
  source: "databricks",
};

const kpiGroupPreset = { kpiGroup };

const config: PresetConfig<typeof kpiGroupPreset> = {
  version: "1.0.0",
  handler: kpiGroupHandler,
  preset: kpiGroupPreset,
};

export default config;

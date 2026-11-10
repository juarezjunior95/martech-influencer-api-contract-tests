import { PresetConfig } from "@domain/entities/preset.entity";
import { posKpiHandler } from "@domain/config/presets/pos-kpi/pos-kpi.handler";

/**
 * `pos-kpi` preset — POS KPI options (`Participation`, `Occasions`,
 * `Servings`) as a flat selectable list. Default is the first row.
 *
 * Endpoint: `GET /v1/presets/pos-kpi`.
 *
 * The handler builds the payload from a static registry; no Databricks
 * dataset is declared.
 */
const posKpiPreset: { "pos-kpi": Record<string, never> } = {
  "pos-kpi": {},
};

const config: PresetConfig<typeof posKpiPreset> = {
  version: "1.0.0",
  handler: posKpiHandler,
  preset: posKpiPreset,
};

export default config;

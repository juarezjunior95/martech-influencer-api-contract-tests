import { PresetConfig } from "@domain/entities/preset.entity";
import {
  periodsHandler,
  PeriodsPresetConfig,
} from "@domain/config/presets/periods/periods.handler";

/**
 * `periods` preset — exposes the supported time-period codes (`QTD`,
 * `R12M`, `YTD`) as a flat selectable list.
 *
 * Endpoint: `GET /v1/presets/periods`.
 *
 * The handler builds the payload entirely from the static period
 * registry; no Databricks dataset is declared. Page-level overrides
 * are wired through the entity's generic `?ns[name]=value` pipeline:
 *
 *   - `?periods[scope]=YTD`        emit only the YTD row.
 *   - `?periods[scope]=QTD,R12M`   emit just QTD and R12M.
 *
 * Page-level fixed filters (BFF object form) work the same way.
 */
const periodsPreset: { periods: PeriodsPresetConfig } = {
  periods: {},
};

const config: PresetConfig<typeof periodsPreset> = {
  version: "1.0.0",
  handler: periodsHandler,
  preset: periodsPreset,
};

export default config;

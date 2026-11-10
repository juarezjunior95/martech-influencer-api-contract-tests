import { PresetConfig } from "@domain/entities/preset.entity";
import { posPeriodsHandler } from "@domain/config/presets/pos-periods/pos-periods.handler";

/**
 * `pos-periods` preset — POS Book period codes (`QTD`, `R12M`) as a
 * flat selectable list (`Quarter` / `R12M` labels, empty `full`).
 *
 * Endpoint: `GET /v1/presets/pos-periods`.
 *
 * The handler builds the payload from a static registry; no Databricks
 * dataset is declared.
 */
const posPeriodsPreset: { "pos-periods": Record<string, never> } = {
  "pos-periods": {},
};

const config: PresetConfig<typeof posPeriodsPreset> = {
  version: "1.0.0",
  handler: posPeriodsHandler,
  preset: posPeriodsPreset,
};

export default config;

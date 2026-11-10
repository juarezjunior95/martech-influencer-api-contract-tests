import { PresetConfig } from "@domain/entities/preset.entity";
import { posToolOverviewPeriodsHandler } from "@domain/config/presets/pos-tool-overview-periods/pos-tool-overview-periods.handler";

/**
 * `pos-tool-overview-periods` preset — dynamic POS Tool overview period
 * options with quarter/year labels derived from the volume time-frame.
 *
 * Endpoint: `GET /v1/presets/pos-tool-overview-periods`.
 */
const posToolOverviewPeriodsPreset: {
  "pos-tool-overview-periods": Record<string, never>;
} = {
  "pos-tool-overview-periods": {},
};

const config: PresetConfig<typeof posToolOverviewPeriodsPreset> = {
  version: "1.0.0",
  handler: posToolOverviewPeriodsHandler,
  preset: posToolOverviewPeriodsPreset,
};

export default config;

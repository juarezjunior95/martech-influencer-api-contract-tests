import { PresetConfig } from "@domain/entities/preset.entity";
import { brandPowerResultsHandler } from "./brand-power-results.handler";

/**
 * Endpoint: `GET /v1/presets/brand-power-results`.
 */
const brandPowerResultsPreset = {} as const;

const config: PresetConfig<typeof brandPowerResultsPreset> = {
  version: "1.0.0",
  handler: brandPowerResultsHandler,
  preset: brandPowerResultsPreset,
};

export default config;

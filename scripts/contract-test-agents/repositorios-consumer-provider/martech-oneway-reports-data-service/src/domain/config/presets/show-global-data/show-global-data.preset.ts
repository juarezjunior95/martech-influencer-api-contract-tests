import { PresetConfig } from "@domain/entities/preset.entity";
import { showGlobalDataHandler } from "@domain/config/presets/show-global-data/show-global-data.handler";
import type { ShowGlobalDataPresetConfig } from "@domain/config/presets/show-global-data/show-global-data.types";

/**
 * Endpoint: `GET /v1/presets/show-global-data`.
 */
const showGlobalDataPreset: { show_global_data: ShowGlobalDataPresetConfig } = {
  show_global_data: {},
};

const config: PresetConfig<typeof showGlobalDataPreset> = {
  version: "1.0.0",
  handler: showGlobalDataHandler,
  preset: showGlobalDataPreset,
};

export default config;

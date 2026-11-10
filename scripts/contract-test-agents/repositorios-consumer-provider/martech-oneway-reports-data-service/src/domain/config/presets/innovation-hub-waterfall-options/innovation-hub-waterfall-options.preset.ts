import { PresetConfig } from "@domain/entities/preset.entity";
import { innovationHubWaterfallOptionsHandler } from "@domain/config/presets/innovation-hub-waterfall-options/innovation-hub-waterfall-options.handler";
import type { InnovationHubWaterfallOptionsPresetConfig } from "@domain/config/presets/innovation-hub-waterfall-options/innovation-hub-waterfall-options.types";

/**
 * `innovation-hub-waterfall-options` preset — static waterfall drill-down options
 * for Innovation Hub KPIs (volume, nr, maco, maco_margin), keyed by current scope.
 *
 * Endpoint: `GET /v1/presets/innovation-hub-waterfall-options`.
 *
 * Overrides: `?innovation-hub-waterfall-options[kpi]=volume` (required at request time
 * unless the BFF injects `kpi` into the preset config).
 */
const innovationHubWaterfallOptionsPreset: {
  "innovation-hub-waterfall-options": InnovationHubWaterfallOptionsPresetConfig;
} = {
  "innovation-hub-waterfall-options": {
    kpi: "",
  },
};

const config: PresetConfig<typeof innovationHubWaterfallOptionsPreset> = {
  version: "1.0.0",
  handler: innovationHubWaterfallOptionsHandler,
  preset: innovationHubWaterfallOptionsPreset,
};

export default config;

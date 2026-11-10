import { PresetConfig } from "@domain/entities/preset.entity";
import { innovationHubWaterfallDimensionsHandler } from "@domain/config/presets/innovation-hub-waterfall-dimensions/innovation-hub-waterfall-dimensions.handler";
import type { InnovationHubWaterfallDimensionsPresetConfig } from "@domain/config/presets/innovation-hub-waterfall-dimensions/innovation-hub-waterfall-dimensions.types";

/**
 * `innovation-hub-waterfall-dimensions` preset — breakdown dimension options for
 * Innovation Hub waterfall "view by" (first subfilter).
 *
 * Endpoint: `GET /v1/presets/innovation-hub-waterfall-dimensions`.
 */
const innovationHubWaterfallDimensionsPreset: {
  "innovation-hub-waterfall-dimensions": InnovationHubWaterfallDimensionsPresetConfig;
} = {
  "innovation-hub-waterfall-dimensions": {},
};

const config: PresetConfig<typeof innovationHubWaterfallDimensionsPreset> = {
  version: "1.0.0",
  handler: innovationHubWaterfallDimensionsHandler,
  preset: innovationHubWaterfallDimensionsPreset,
};

export default config;

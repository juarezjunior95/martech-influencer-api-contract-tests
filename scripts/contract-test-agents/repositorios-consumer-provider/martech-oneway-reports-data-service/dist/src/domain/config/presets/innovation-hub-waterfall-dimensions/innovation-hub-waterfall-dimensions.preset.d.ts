import { PresetConfig } from "@domain/entities/preset.entity";
import type { InnovationHubWaterfallDimensionsPresetConfig } from "@domain/config/presets/innovation-hub-waterfall-dimensions/innovation-hub-waterfall-dimensions.types";
declare const innovationHubWaterfallDimensionsPreset: {
    "innovation-hub-waterfall-dimensions": InnovationHubWaterfallDimensionsPresetConfig;
};
declare const config: PresetConfig<typeof innovationHubWaterfallDimensionsPreset>;
export default config;

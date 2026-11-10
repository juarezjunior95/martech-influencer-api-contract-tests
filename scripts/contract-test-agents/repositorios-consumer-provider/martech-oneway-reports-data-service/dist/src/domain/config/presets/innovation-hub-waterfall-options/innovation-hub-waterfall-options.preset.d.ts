import { PresetConfig } from "@domain/entities/preset.entity";
import type { InnovationHubWaterfallOptionsPresetConfig } from "@domain/config/presets/innovation-hub-waterfall-options/innovation-hub-waterfall-options.types";
declare const innovationHubWaterfallOptionsPreset: {
    "innovation-hub-waterfall-options": InnovationHubWaterfallOptionsPresetConfig;
};
declare const config: PresetConfig<typeof innovationHubWaterfallOptionsPreset>;
export default config;

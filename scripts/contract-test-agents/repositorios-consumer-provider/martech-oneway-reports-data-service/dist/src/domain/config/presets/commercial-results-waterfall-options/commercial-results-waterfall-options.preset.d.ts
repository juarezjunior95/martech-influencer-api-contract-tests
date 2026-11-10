import { PresetConfig } from "@domain/entities/preset.entity";
import type { CommercialResultsWaterfallOptionsPresetConfig } from "@domain/config/presets/commercial-results-waterfall-options/commercial-results-waterfall-options.types";
declare const commercialResultsWaterfallOptionsPreset: {
    "commercial-results-waterfall-options": CommercialResultsWaterfallOptionsPresetConfig;
};
declare const config: PresetConfig<typeof commercialResultsWaterfallOptionsPreset>;
export default config;

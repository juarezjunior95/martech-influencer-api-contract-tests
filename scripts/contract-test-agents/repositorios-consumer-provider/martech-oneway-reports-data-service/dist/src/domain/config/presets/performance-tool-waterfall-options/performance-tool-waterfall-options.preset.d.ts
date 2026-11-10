import { PresetConfig } from "@domain/entities/preset.entity";
import type { PerformanceToolWaterfallOptionsPresetConfig } from "@domain/config/presets/performance-tool-waterfall-options/performance-tool-waterfall-options.types";
declare const performanceToolWaterfallOptionsPreset: {
    "performance-tool-waterfall-options": PerformanceToolWaterfallOptionsPresetConfig;
};
declare const config: PresetConfig<typeof performanceToolWaterfallOptionsPreset>;
export default config;

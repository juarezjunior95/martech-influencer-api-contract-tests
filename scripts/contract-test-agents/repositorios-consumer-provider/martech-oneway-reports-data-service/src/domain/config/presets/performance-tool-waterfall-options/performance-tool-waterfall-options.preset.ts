import { PresetConfig } from "@domain/entities/preset.entity";
import { performanceToolWaterfallOptionsHandler } from "@domain/config/presets/performance-tool-waterfall-options/performance-tool-waterfall-options.handler";
import type { PerformanceToolWaterfallOptionsPresetConfig } from "@domain/config/presets/performance-tool-waterfall-options/performance-tool-waterfall-options.types";

/**
 * `performance-tool-waterfall-options` preset — static waterfall drill-down options
 * keyed by KPI and current scope (e.g. `global`, `country`).
 *
 * Endpoint: `GET /v1/presets/performance-tool-waterfall-options`.
 *
 * Overrides: `?performance-tool-waterfall-options[kpi]=volume` (required at request time
 * unless the BFF injects `kpi` into the preset config).
 */
const performanceToolWaterfallOptionsPreset: {
  "performance-tool-waterfall-options": PerformanceToolWaterfallOptionsPresetConfig;
} = {
  "performance-tool-waterfall-options": {
    kpi: "",
  },
};

const config: PresetConfig<typeof performanceToolWaterfallOptionsPreset> = {
  version: "1.0.0",
  handler: performanceToolWaterfallOptionsHandler,
  preset: performanceToolWaterfallOptionsPreset,
};

export default config;

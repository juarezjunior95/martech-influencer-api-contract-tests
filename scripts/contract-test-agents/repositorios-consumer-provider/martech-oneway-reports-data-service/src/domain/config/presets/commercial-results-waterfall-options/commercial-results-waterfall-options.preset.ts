import { PresetConfig } from "@domain/entities/preset.entity";
import { commercialResultsWaterfallOptionsHandler } from "@domain/config/presets/commercial-results-waterfall-options/commercial-results-waterfall-options.handler";
import type { CommercialResultsWaterfallOptionsPresetConfig } from "@domain/config/presets/commercial-results-waterfall-options/commercial-results-waterfall-options.types";

/**
 * `commercial-results-waterfall-options` preset — static waterfall drill-down options
 * keyed by KPI and current scope (e.g. `global`, `brand`, `sub_brand`).
 *
 * Endpoint: `GET /v1/presets/commercial-results-waterfall-options`.
 *
 * Overrides: `?commercial-results-waterfall-options[kpi]=volume` (required at request time
 * unless the BFF injects `kpi` into the preset config).
 */
const commercialResultsWaterfallOptionsPreset: {
  "commercial-results-waterfall-options": CommercialResultsWaterfallOptionsPresetConfig;
} = {
  "commercial-results-waterfall-options": {
    kpi: "",
  },
};

const config: PresetConfig<typeof commercialResultsWaterfallOptionsPreset> = {
  version: "1.0.0",
  handler: commercialResultsWaterfallOptionsHandler,
  preset: commercialResultsWaterfallOptionsPreset,
};

export default config;

import { PresetConfig } from "@domain/entities/preset.entity";
import { commercialResultsHandler } from "./commercial-results.handler";

const commercialResultsPreset = {
  commercial_results_filters: {
    brand: "All",
    kpi: "volume",
  },
} as const;

const config: PresetConfig<typeof commercialResultsPreset> = {
  version: "1.0.0",
  handler: commercialResultsHandler,
  preset: commercialResultsPreset,
};

export default config;

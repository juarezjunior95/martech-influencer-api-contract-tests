import type { KpiTuple } from "@domain/config/presets/kpis/kpis.types";

/**
 * Author-facing config for the `innovation-hub-waterfall-dimensions` preset.
 * No runtime overrides; options are static.
 */
export type InnovationHubWaterfallDimensionsPresetConfig = Record<
  string,
  never
>;

export interface InnovationHubWaterfallDimensionsPresetValue {
  enabled: boolean;
  default: KpiTuple | Record<string, never>;
  values: KpiTuple[];
}

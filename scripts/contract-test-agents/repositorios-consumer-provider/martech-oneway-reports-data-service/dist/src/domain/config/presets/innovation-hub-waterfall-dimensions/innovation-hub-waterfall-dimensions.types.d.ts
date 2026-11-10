import type { KpiTuple } from "@domain/config/presets/kpis/kpis.types";
export type InnovationHubWaterfallDimensionsPresetConfig = Record<string, never>;
export interface InnovationHubWaterfallDimensionsPresetValue {
    enabled: boolean;
    default: KpiTuple | Record<string, never>;
    values: KpiTuple[];
}

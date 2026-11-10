import { PresetConfig } from "@domain/entities/preset.entity";
declare const commercialResultsPreset: {
    readonly commercial_results_filters: {
        readonly brand: "All";
        readonly kpi: "volume";
    };
};
declare const config: PresetConfig<typeof commercialResultsPreset>;
export default config;

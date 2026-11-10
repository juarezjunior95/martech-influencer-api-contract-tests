import { PresetConfig } from "@domain/entities/preset.entity";
declare const priceSegmentsPreset: {
    "price-segments": Record<string, never>;
};
declare const config: PresetConfig<typeof priceSegmentsPreset>;
export default config;

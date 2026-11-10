import { PresetConfig } from "@domain/entities/preset.entity";
import { YtdMonthPresetConfig } from "@domain/config/presets/ytd-month/ytd-month.handler";
declare const ytdMonthPreset: {
    "ytd-month": YtdMonthPresetConfig;
};
declare const config: PresetConfig<typeof ytdMonthPreset>;
export default config;

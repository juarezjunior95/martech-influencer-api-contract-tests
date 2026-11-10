import { PresetConfig } from "@domain/entities/preset.entity";
import { PcTimeFramePresetConfig } from "@domain/config/presets/pc-time-frame-quarters/pc-time-frame-quarters.handler";
declare const pcTimeFramePreset: {
    "pc-time-frame-quarters": PcTimeFramePresetConfig;
};
declare const config: PresetConfig<typeof pcTimeFramePreset>;
export default config;

import { PresetConfig } from "@domain/entities/preset.entity";
import { TimeFramePresetConfig } from "@domain/config/presets/time-frame/time-frame.handler";
declare const timeFramePreset: {
    "time-frame": TimeFramePresetConfig;
};
declare const config: PresetConfig<typeof timeFramePreset>;
export default config;

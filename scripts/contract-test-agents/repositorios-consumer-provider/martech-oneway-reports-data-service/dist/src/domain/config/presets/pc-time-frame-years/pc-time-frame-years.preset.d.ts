import { PresetConfig } from "@domain/entities/preset.entity";
import { PcTimeFrameYearsPresetConfig } from "@domain/config/presets/pc-time-frame-years/pc-time-frame-years.handler";
declare const pcTimeFrameYearsPreset: {
    "pc-time-frame-years": PcTimeFrameYearsPresetConfig;
};
declare const config: PresetConfig<typeof pcTimeFrameYearsPreset>;
export default config;

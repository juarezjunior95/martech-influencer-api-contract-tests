import { PresetConfig } from "@domain/entities/preset.entity";
import {
  pcTimeFrameYearsHandler,
  PcTimeFrameYearsPresetConfig,
} from "@domain/config/presets/pc-time-frame-years/pc-time-frame-years.handler";

/**
 * Volume refresh date comes from the kpi-group Databricks query (`volume`
 * → `time_frame`), with static `kpi_group_time_frame.config.volume` as
 * fallback — see handler `datasets()` + `handle()`.
 */
const pcTimeFrameYearsPreset: {
  "pc-time-frame-years": PcTimeFrameYearsPresetConfig;
} = {
  "pc-time-frame-years": {},
};

const config: PresetConfig<typeof pcTimeFrameYearsPreset> = {
  version: "1.0.0",
  handler: pcTimeFrameYearsHandler,
  preset: pcTimeFrameYearsPreset,
};

export default config;

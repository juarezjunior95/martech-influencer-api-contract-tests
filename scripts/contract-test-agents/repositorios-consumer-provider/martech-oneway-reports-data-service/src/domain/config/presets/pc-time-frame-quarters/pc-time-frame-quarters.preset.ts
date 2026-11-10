import { PresetConfig } from "@domain/entities/preset.entity";
import {
  pcTimeFrameHandler,
  PcTimeFramePresetConfig,
} from "@domain/config/presets/pc-time-frame-quarters/pc-time-frame-quarters.handler";

/**
 * Volume refresh date comes from the kpi-group Databricks query (`volume`
 * → `time_frame`), with static `kpi_group_time_frame.config.volume` as
 * fallback — see handler `datasets()` + `handle()`.
 */
const pcTimeFramePreset: { "pc-time-frame-quarters": PcTimeFramePresetConfig } =
  {
    "pc-time-frame-quarters": {},
  };

const config: PresetConfig<typeof pcTimeFramePreset> = {
  version: "1.0.0",
  handler: pcTimeFrameHandler,
  preset: pcTimeFramePreset,
};

export default config;

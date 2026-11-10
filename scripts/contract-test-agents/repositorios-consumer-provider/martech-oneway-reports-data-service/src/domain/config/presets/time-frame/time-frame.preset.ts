import { PresetConfig } from "@domain/entities/preset.entity";
import {
  timeFrameHandler,
  TimeFramePresetConfig,
} from "@domain/config/presets/time-frame/time-frame.handler";

/**
 * Time-frame preset — volume KPI `ini` / `end` bounds (`YYYY-MM-DD`), aligned
 * with Drupal TimeFrame (volume). Refresh date: kpi-group query (`volume` →
 * `time_frame`), then static `kpi_group_time_frame.config.volume` fallback.
 *
 * Endpoint: `GET /v1/presets/time-frame` (folder name).
 *
 * Response key is `time_frame` (snake_case) for parity with legacy Drupal
 * filter ids — see handler output.
 */
const timeFramePreset: { "time-frame": TimeFramePresetConfig } = {
  "time-frame": {},
};

const config: PresetConfig<typeof timeFramePreset> = {
  version: "1.0.0",
  handler: timeFrameHandler,
  preset: timeFramePreset,
};

export default config;

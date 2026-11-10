import { PresetConfig } from "@domain/entities/preset.entity";
import {
  yearsHandler,
  YearsPresetConfig,
} from "@domain/config/presets/years/years.handler";

/*
 * Legacy Drupal naming inversion (category health years):
 *   `category_health_full_years_start` is the NEWEST year,
 *   `category_health_full_years_end` is the OLDEST.
 * The handler normalizes to chronological order using the same keys from
 * `kpi-group.sql` (via `kpiGroupHandler`), with static
 * `kpi_group_time_frame` as fallback.
 */
const yearsPreset: { years: YearsPresetConfig } = {
  years: {
    noDefault: false,
  },
};

const config: PresetConfig<typeof yearsPreset> = {
  version: "1.0.0",
  handler: yearsHandler,
  preset: yearsPreset,
};

export default config;

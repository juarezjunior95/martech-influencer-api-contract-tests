import { PresetConfig } from "@domain/entities/preset.entity";
import {
  ytdMonthHandler,
  YtdMonthPresetConfig,
} from "@domain/config/presets/ytd-month/ytd-month.handler";

/**
 * `ytd-month` preset — exposes the supported year-to-date / month-to-date
 * codes as a flat selectable list, mirroring the legacy Drupal
 * `getYearToDateMonth()` helper (`YTD` and `MTD`).
 *
 * Endpoint: `GET /v1/presets/ytd-month`.
 *
 * The handler builds the payload entirely from the static registry;
 * no Databricks dataset is declared and no preset/query levers are
 * consumed.
 */
const ytdMonthPreset: { "ytd-month": YtdMonthPresetConfig } = {
  "ytd-month": {},
};

const config: PresetConfig<typeof ytdMonthPreset> = {
  version: "1.0.0",
  handler: ytdMonthHandler,
  preset: ytdMonthPreset,
};

export default config;

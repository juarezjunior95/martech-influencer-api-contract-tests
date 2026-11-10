import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";

/**
 * Single ytd-month row emitted in `values` and `default`.
 *
 * `value` is the canonical short code (`YTD`, `Month`); `label` is
 * the user-facing string (`YTD`, `MTD`); `full` is the longer
 * description.
 */
export interface YtdMonthTuple {
  value: string;
  label: string;
  full: string;
}

export interface YtdMonthPresetValue {
  enabled: boolean;
  default: YtdMonthTuple | Record<string, never>;
  values: YtdMonthTuple[];
}

/**
 * Author-facing config for the `ytd-month` preset.
 *
 * The handler emits a fixed payload — there are no scope, default or
 * permission levers. The interface is kept so the preset file can
 * remain typed and future toggles can be added without breaking
 * callers.
 */
export type YtdMonthPresetConfig = Record<string, never>;

/**
 * Canonical, fixed ytd-month registry. Mirrors the legacy Drupal
 * `getYearToDateMonth()` helper:
 *
 *   ValueLabelTupleDto::constructArray("YTD",   "YTD", "Year to Date (YTD)")
 *   ValueLabelTupleDto::constructArray("Month", "MTD", "Month to Date (MTD)")
 *
 * Order here is the emission order in the response and the first
 * entry is the implicit default.
 */
const ALL_YTD_MONTHS: YtdMonthTuple[] = [
  { value: "YTD", label: "YTD", full: "Year to Date (YTD)" },
  { value: "Month", label: "MTD", full: "Month to Date (MTD)" },
];

/**
 * Ytd-month preset handler.
 *
 * Emits a fully static payload — no Databricks dataset is declared
 * and no preset/query lever is consumed. The first row of
 * {@link ALL_YTD_MONTHS} is always returned as the default.
 */
class YtdMonthPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const values = ALL_YTD_MONTHS.map((tuple) => ({ ...tuple }));

    const ytdMonthValue: YtdMonthPresetValue = {
      values,
      default: { ...values[0] },
      enabled: true,
    };

    return { ...preset, "ytd-month": ytdMonthValue };
  }
}

export const ytdMonthHandler = new YtdMonthPresetHandler();

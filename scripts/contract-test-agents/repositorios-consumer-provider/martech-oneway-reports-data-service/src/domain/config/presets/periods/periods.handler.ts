import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";

/**
 * Single period row emitted in `values` and `default`.
 *
 * `value` is the canonical short code (`QTD`, `YTD`, `R12M`).
 */
export interface PeriodTuple {
  value: string;
  label: string;
  full: string;
}

export interface PeriodPresetValue {
  enabled: boolean;
  default: PeriodTuple | Record<string, never>;
  values: PeriodTuple[];
}

/**
 * Author-facing config for the `periods` preset.
 *
 *   - `scope`: optional single-value allow-list. Only four shapes are
 *     accepted; anything else falls back to the default registry:
 *       - omitted / empty → default (`QTD` + `R12M`)
 *       - `["YTD"]`       → only YTD
 *       - `["QTD"]`       → only QTD
 *       - `["R12M"]`      → only R12M
 *     Multi-id scopes (e.g. `["QTD", "YTD"]`) and unknown ids are
 *     intentionally NOT supported — they collapse to the default.
 *   - `noDefault`: collapse `default` to `{}` (mirrors `years`).
 */
export interface PeriodsPresetConfig {
  scope?: string;
  noDefault?: boolean;
}

/**
 * Every period the `periods` preset knows about. Order here is the
 * canonical emission order whenever multiple periods coexist in the
 * response.
 */
const ALL_PERIODS: PeriodTuple[] = [
  { value: "QTD", label: "QTD", full: "Quarter To Date (QTD)" },
  { value: "R12M", label: "R12M", full: "Rolling 12 Months (R12M)" },
  { value: "YTD", label: "YTD", full: "Year To Date (YTD)" },
];

/**
 * Pre-built scope sets indexed by the canonical scope key. The
 * handler accepts one of these four shapes only:
 *   - omitted / empty / unrecognized → `DEFAULT_PERIODS`.
 *   - `["YTD"]` / `["QTD"]` / `["R12M"]` → matching single-id set.
 */
const DEFAULT_PERIODS = new Set<string>(["QTD", "R12M"]);
const SINGLE_SCOPES: Record<string, ReadonlySet<string>> = {
  YTD: new Set<string>(["YTD"]),
  QTD: new Set<string>(["QTD"]),
  R12M: new Set<string>(["R12M"]),
};

/**
 * Periods preset handler.
 *
 * Builds the response entirely from {@link ALL_PERIODS} — no
 * Databricks dataset is declared. The `scope` filter is the only
 * lever; it can come from the preset config (BFF-side fixed filter)
 * or from the query string (`?periods[scope]=YTD`).
 *
 * Selection rules (see {@link PeriodsPresetConfig.scope}):
 *   - omitted / empty / multi-id / unknown → `DEFAULT_PERIODS`
 *     (QTD + R12M).
 *   - exactly `["YTD"]` / `["QTD"]` / `["R12M"]` → matching
 *     single-id row only.
 *
 * `default` is the first row of the resulting list (or `{}` when
 * `noDefault=true` or `values` is empty).
 */
class PeriodsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const periodsConfig = (preset.periods ?? {}) as PeriodsPresetConfig;
    const values = this.buildValues(periodsConfig.scope);

    const noDefault = periodsConfig.noDefault === true;
    const defaultTuple: PeriodPresetValue["default"] =
      noDefault || values.length === 0 ? {} : { ...values[0] };

    const periodsValue: PeriodPresetValue = {
      values,
      default: defaultTuple,
      enabled: true,
    };

    return { ...preset, periods: periodsValue };
  }

  /**
   * Resolve the scope set, accepting only the four canonical shapes
   * (see {@link PeriodsPresetConfig.scope}). Anything else collapses
   * to {@link DEFAULT_PERIODS}.
   */
  private buildValues(scope: string): PeriodTuple[] {
    const allowed = this.resolveScope(scope);
    return ALL_PERIODS.filter((tuple) => allowed.has(tuple.value)).map(
      (tuple) => ({ ...tuple }),
    );
  }

  private resolveScope(scope: string): ReadonlySet<string> {
    if (!scope) {
      return DEFAULT_PERIODS;
    }
    return SINGLE_SCOPES[scope.toUpperCase()] ?? DEFAULT_PERIODS;
  }
}

export const periodsHandler = new PeriodsPresetHandler();

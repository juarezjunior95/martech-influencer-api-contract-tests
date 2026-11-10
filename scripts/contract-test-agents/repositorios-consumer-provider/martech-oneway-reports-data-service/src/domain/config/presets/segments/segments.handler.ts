import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";

/**
 * Single segment row emitted in `values` and `default`.
 *
 * `value` is the canonical short code; `label` is the user-facing
 * string; `full` is reserved for a longer description and may be
 * empty.
 */
export interface SegmentTuple {
  value: string;
  label: string;
  full: string;
}

export interface SegmentPresetValue {
  enabled: boolean;
  default: SegmentTuple | Record<string, never>;
  values: SegmentTuple[];
}

/**
 * Author-facing config for the `segments` preset.
 *
 *   - `scope`: optional single-value allow-list. Three canonical
 *     shapes are accepted; anything else (unknown id) falls back to
 *     the default registry:
 *       - omitted / empty / unknown → `default` registry.
 *       - `"category_health"`       → category-health segments.
 *       - `"brand_power_book"`      → brand-power-book segments.
 *   - `noDefault`: collapse `default` to `{}` (mirrors `periods`).
 *   - `includeAll`: prepend the synthetic `All` row to `values`.
 *     The `All` row is never used as the implicit default.
 */
export interface SegmentsPresetConfig {
  scope?: string;
  noDefault?: boolean;
  includeAll?: boolean;
}

const ALL_SEGMENT: SegmentTuple = { value: "All", label: "All", full: "" };

/**
 * Pre-built scope sets indexed by the canonical scope key. The order
 * here is the canonical emission order in the response.
 */
const DEFAULT_SEGMENTS: SegmentTuple[] = [
  { value: "Core Superiority", label: "Core Superiority", full: "" },
  { value: "Premiumization", label: "Premium", full: "" },
  { value: "Beyond Beer", label: "Beyond Beer", full: "" },
  { value: "NAB", label: "Non-Alcoholic Beer", full: "" },
];

const CATEGORY_HEALTH_SEGMENTS: SegmentTuple[] = [
  { value: "Beer", label: "Beer", full: "" },
  { value: "Beyond Beer", label: "Beyond Beer", full: "" },
  { value: "Beer + Beyond Beer", label: "Beer + Beyond Beer", full: "" },
];

const BRAND_POWER_BOOK_SEGMENTS: SegmentTuple[] = [
  { value: "Premiumization", label: "Premium", full: "" },
  { value: "Core+", label: "Core+", full: "" },
  { value: "Mainstream", label: "Mainstream", full: "" },
  { value: "Beyond Beer", label: "Beyond Beer", full: "" },
  { value: "Others", label: "Others", full: "" },
];

const AUDIENCE_TARGETING_SEGMENTS: SegmentTuple[] = [
  { value: "Beer", label: "Beer", full: "" },
  { value: "Beyond Beer", label: "Beyond Beer", full: "" },
  { value: "Beer + Beyond Beer", label: "Beer + Beyond Beer", full: "" },
];

const POS_TOOL_OVERVIEW_SEGMENTS: SegmentTuple[] = [
  { value: "Alcohol", label: "Alcohol", full: "Alcohol" },
  {
    value: "Beer + Beyond Beer",
    label: "Beer + BYB",
    full: "Beer + Beyond Beer",
  },
  { value: "Beer", label: "Beer", full: "Beer" },
  { value: "Beyond Beer", label: "Beyond Beer", full: "Beyond Beer" },
  { value: "Spirits", label: "Spirits", full: "Spirits" },
  { value: "Wine", label: "Wine", full: "Wine" },
];

const SCOPED_SEGMENTS: Record<string, ReadonlyArray<SegmentTuple>> = {
  default: DEFAULT_SEGMENTS,
  category_health: CATEGORY_HEALTH_SEGMENTS,
  brand_power_book: BRAND_POWER_BOOK_SEGMENTS,
  audience_targeting: AUDIENCE_TARGETING_SEGMENTS,
  pos_tool_overview: POS_TOOL_OVERVIEW_SEGMENTS,
};

const NO_DEFAULT_SEGMENT: SegmentTuple = { value: "", label: "", full: "" };

/**
 * Segments preset handler.
 *
 * Builds the response entirely from the static segment registries —
 * no Databricks dataset is declared. Selection levers come from the
 * preset config (BFF-side fixed filter) or the query string
 * (`?segments[scope]=category_health`).
 *
 * Selection rules (see {@link SegmentsPresetConfig}):
 *   - `scope` resolves to one of the four registries; unknown ids
 *     collapse to the `default` registry.
 *   - `includeAll=true` prepends the synthetic `All` row.
 *   - `default` is the first non-`All` row of the resulting list, or
 *     `{}` when `noDefault=true` or the list is empty.
 */
class SegmentsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const segmentsConfig = (preset.segments ?? {}) as SegmentsPresetConfig;
    const baseValues = this.buildValues(segmentsConfig.scope);

    const noDefault = this.toBool(segmentsConfig.noDefault);
    const includeAll = this.toBool(segmentsConfig.includeAll);

    let defaultTuple: SegmentPresetValue["default"] =
      noDefault || baseValues.length === 0
        ? {
            ...NO_DEFAULT_SEGMENT,
          }
        : { ...baseValues[0] };

    const values: SegmentTuple[] = includeAll
      ? [{ ...ALL_SEGMENT }, ...baseValues]
      : baseValues;

    if (includeAll && !noDefault) {
      defaultTuple = { ...ALL_SEGMENT };
    }

    const segmentsValue: SegmentPresetValue = {
      values,
      default: defaultTuple,
      enabled: true,
    };

    return { ...preset, segments: segmentsValue };
  }

  /**
   * Resolve the scope list, accepting only the canonical scope keys.
   * Anything else collapses to {@link DEFAULT_SEGMENTS}.
   */
  private buildValues(scope?: string): SegmentTuple[] {
    const registry = this.resolveScope(scope);
    return registry.map((tuple) => ({ ...tuple }));
  }

  private resolveScope(scope?: string): ReadonlyArray<SegmentTuple> {
    if (!scope) {
      return SCOPED_SEGMENTS.default;
    }
    return SCOPED_SEGMENTS[scope.toLowerCase()] ?? SCOPED_SEGMENTS.default;
  }

  /**
   * Coerce booleans coming from query strings (`"true"` / `"false"`)
   * or BFF-side fixed filters (real booleans) into a single boolean.
   */
  private toBool(value: unknown): boolean {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }
    return false;
  }
}

export const segmentsHandler = new SegmentsPresetHandler();

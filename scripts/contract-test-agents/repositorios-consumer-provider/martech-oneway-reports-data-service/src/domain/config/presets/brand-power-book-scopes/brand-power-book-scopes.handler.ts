import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";

/**
 * One Brand Power Book scope row: Drupal value/label tuples plus
 * `full` for parity with portfolio/segment presets.
 */
export interface BrandPowerBookScopeTuple {
  value: string;
  label: string;
  full: string;
}

export interface BrandPowerBookScopesPresetValue {
  enabled: boolean;
  default: BrandPowerBookScopeTuple | Record<string, never>;
  values: BrandPowerBookScopeTuple[];
}

/**
 * Author-facing config for the `brand-power-book-scopes` preset
 * (Drupal `brand_power_book_scopes` filter). The Drupal plugin has no
 * constructor options; the list is static. Extend this type if the
 * filter gains configurable parameters.
 */
export type BrandPowerBookScopesPresetConfig = Record<string, never>;

const EMPTY_DEFAULT: BrandPowerBookScopeTuple = {
  value: "",
  label: "",
  full: "",
};

/**
 * Canonical scopes from Drupal `BrandPowerBookScope::getAll` (order
 * preserved).
 */
const BRAND_POWER_BOOK_SCOPES: ReadonlyArray<BrandPowerBookScopeTuple> = [
  { value: "portfolio", label: "Portfolio", full: "" },
  { value: "global_brands", label: "Global Brands", full: "" },
  { value: "segment", label: "Segment", full: "" },
];

/**
 * Brand Power Book scopes preset handler.
 *
 * Static registry only (no Databricks). Matches Drupal
 * `BrandPowerBookScopes` filter: all scopes as tuples; default is
 * always empty strings (no implicit pre-selection), unlike
 * `portfolio` / `segments`.
 */
class BrandPowerBookScopesPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(preset: PresetDefinition): PresetResponse {
    const values = BRAND_POWER_BOOK_SCOPES.map((row) => ({ ...row }));

    const brandPowerBookScopesValue: BrandPowerBookScopesPresetValue = {
      values,
      default: { ...EMPTY_DEFAULT },
      enabled: true,
    };

    return { ...preset, "brand-power-book-scopes": brandPowerBookScopesValue };
  }
}

export const brandPowerBookScopesHandler =
  new BrandPowerBookScopesPresetHandler();

export const BRAND_COMP_DATASET_ID = "brand-subbrand-comp";
export const BRAND_COMP_DATASET_QUERY = "presets/brand/brand-subbrand-comp";

export const LEVEL_COMP = "COMP";

export interface BrandCompFilterItem {
  type: "brands-comp";
  label?: string;
  shortLabel?: string;
  source: "databricks";
  countries?: string[];
}

export interface BrandCompValueLabel {
  value: string;
  label: string;
  image_url: string;
  image_variants: Record<string, string>;
}

/**
 * Opt-group block: `{ group, values: [{ label, value }] }`. Matches
 * the legacy Drupal `brand_comp` filter shape and mirrors the
 * `GlobalBrandsGroupBlock` structure used by `global-brands`.
 */
export interface BrandCompGroupBlock {
  group: string | number;
  values: BrandCompValueLabel[];
}

export type BrandCompValuesByCountry = Record<string, BrandCompGroupBlock[]>;

/**
 * Shape of `brand_comp`: country-keyed opt-groups. Competitors have
 * no synthetic "All" block and `default` is an empty array.
 */
export interface BrandCompPresetValue {
  values: BrandCompValuesByCountry;
  default: BrandCompValueLabel[];
  enabled: boolean;
}

export function isBrandCompFilterItem(
  value: unknown,
): value is BrandCompFilterItem {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as BrandCompFilterItem).type === "brands-comp"
  );
}

export const BRAND_ABI_DATASET_ID = "brand-subbrand-comp";
export const BRAND_ABI_DATASET_QUERY = "presets/brand/brand-subbrand-comp";

export const LEVEL_ABI = "ABI";

export interface BrandAbiFilterItem {
  type: "brands-abi";
  label?: string;
  shortLabel?: string;
  source: "databricks";
  countries?: string[];
}

export interface BrandAbiValueLabel {
  value: string;
  label: string;
  image_url: string;
  image_variants: Record<string, string>;
}

/**
 * Opt-group block: `{ group, values: [{ label, value }] }`. Matches
 * the legacy Drupal `brand_abi` filter shape and mirrors the
 * `GlobalBrandsGroupBlock` structure used by `global-brands`.
 */
export interface BrandAbiGroupBlock {
  group: string | number;
  values: BrandAbiValueLabel[];
}

export type BrandAbiValuesByCountry = Record<string, BrandAbiGroupBlock[]>;

/**
 * Shape of `brand_abi`: country-keyed opt-groups, a single-object
 * default (`{ value: "All", label: "All" }`).
 */
export interface BrandAbiPresetValue {
  values: BrandAbiValuesByCountry;
  default: BrandAbiValueLabel;
  enabled: boolean;
}

export function isBrandAbiFilterItem(
  value: unknown,
): value is BrandAbiFilterItem {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as BrandAbiFilterItem).type === "brands-abi"
  );
}

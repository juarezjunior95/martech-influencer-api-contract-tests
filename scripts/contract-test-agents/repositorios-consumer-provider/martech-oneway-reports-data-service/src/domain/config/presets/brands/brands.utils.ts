import { BadRequestException } from "@nestjs/common";
import { DataItem } from "@domain/entities/common/base-config.entity";
import {
  BrandCountryEntry,
  BrandEntry,
  BrandFilterItem,
  BrandValueLabel,
  FlatBrandEntry,
} from "@domain/config/presets/brands/brands.types";
import { BRAND_DEFAULT_BY_COUNTRY } from "@domain/config/presets/brands/brands.defaults";
import { getBrandImageFields } from "@common/utils/images/brand-image.utils";

export const ALL = "All";

function brandFields(name: string, brandFamily?: string) {
  return getBrandImageFields(
    name,
    brandFamily ? { brand_family: brandFamily } : undefined,
  );
}

function allSubBrandRow(brandFamily?: string): BrandValueLabel {
  const img = brandFields(ALL, brandFamily);
  return {
    value: ALL,
    label: ALL,
    ...img,
  };
}

export interface BrandRow {
  country: string;
  brand: string;
  subBrand: string;
}

export interface BrandEntryOptions {
  includeSubBrands: boolean;
  includeAllSubBrands: boolean;
  flatten: boolean;
  subFieldLabel?: string;
}

/**
 * Enforce the legacy Drupal `InvalidFilterConfigException` rule:
 * `include_all_sub_brands=true` is incompatible with
 * `include_sub_brands=false`.
 */
export function validateBrandConfig(filter: BrandFilterItem): void {
  if (
    filter.includeAllSubBrands === true &&
    filter.includeSubBrands === false
  ) {
    throw new BadRequestException(
      "It is not possible to use include_all_sub_brands=true and include_sub_brands=false",
    );
  }
}

export function pickString(row: DataItem, keys: string[]): string {
  for (const key of keys) {
    const v = row[key];
    if (typeof v === "string" && v.length > 0) {
      return v;
    }
  }
  return "";
}

export function buildAllBrandEntry(
  includeSubBrands: boolean,
  flatten: boolean,
): BrandEntry {
  const img = brandFields(ALL);
  const entry: BrandEntry = {
    value: ALL,
    label: ALL,
    ...img,
  };
  if (includeSubBrands || flatten) {
    const subBrand = allSubBrandRow();
    entry.sub_brands = [subBrand];
    entry.default = { ...subBrand };
  }
  return entry;
}

export function buildBrandEntry(
  brand: string,
  subBrandSet: Set<string>,
  options: BrandEntryOptions,
): BrandEntry {
  const main = brandFields(brand);
  const entry: BrandEntry = {
    value: brand,
    label: brand,
    ...main,
  };

  if (!options.includeSubBrands && !options.flatten) {
    return entry;
  }

  const subBrands: BrandValueLabel[] = [];

  if (options.subFieldLabel && !options.flatten) {
    const sf = String(options.subFieldLabel);
    subBrands.push({
      value: sf,
      label: sf,
      ...brandFields(sf, brand),
    });
  }

  if (options.includeAllSubBrands || options.flatten) {
    subBrands.push(allSubBrandRow(brand));
  }

  for (const sub of subBrandSet) {
    if (sub.toLowerCase() === ALL.toLowerCase()) {
      continue;
    }
    subBrands.push({
      value: sub,
      label: sub,
      ...brandFields(sub, brand),
    });
  }

  entry.sub_brands = subBrands;
  entry.default = subBrands[0] ?? {
    value: brand,
    label: brand,
    ...brandFields(brand),
  };
  return entry;
}

/**
 * Port of Drupal `flattenBrands`. When a brand has exactly the
 * synthetic "All" row plus a single sub-brand identical to the brand
 * name, collapse it into a single `value_sub_brand: "All"` row.
 * Otherwise emit one row per sub-brand and label the synthetic "All"
 * sub-brand as "<brand> (All)".
 */
export function flattenBrands(entries: BrandEntry[]): FlatBrandEntry[] {
  const flat: FlatBrandEntry[] = [];
  for (const brand of entries) {
    const subs = brand.sub_brands ?? [];
    if (
      subs.length === 2 &&
      subs[0].label === ALL &&
      subs[1].label === brand.label
    ) {
      flat.push({
        value: brand.value,
        value_sub_brand: ALL,
        label: brand.label,
        ...brandFields(brand.value),
      });
      continue;
    }
    for (const sub of subs) {
      const label = sub.label === ALL ? `${brand.label} (All)` : sub.label;
      const isAllSub = sub.value === ALL || sub.label === ALL;
      flat.push({
        value: brand.value,
        value_sub_brand: sub.value,
        label,
        ...(isAllSub
          ? brandFields(brand.value)
          : brandFields(sub.value, brand.value)),
      });
    }
  }
  return flat;
}

export function resolveCountryDefault(
  country: string,
  entries: Array<BrandEntry | FlatBrandEntry>,
  includeSubBrands: boolean,
): BrandCountryEntry["default"] {
  if (entries.length === 0) {
    return {};
  }

  const defaultId = BRAND_DEFAULT_BY_COUNTRY[country];
  const match = defaultId
    ? entries.find((b) => b.value === defaultId)
    : undefined;
  const chosen = match ?? entries[0];

  if ("value_sub_brand" in chosen) {
    return {
      value: chosen.value,
      value_sub_brand: chosen.value_sub_brand,
      label: chosen.label,
      image_url: chosen.image_url,
      image_variants: chosen.image_variants,
    };
  }

  if (!includeSubBrands) {
    return {
      value: chosen.value,
      label: chosen.label,
      ...brandFields(chosen.value),
    };
  }

  const subs = chosen.sub_brands ?? [];
  const def = chosen.default ??
    subs[0] ?? {
      value: chosen.value,
      label: chosen.label,
      ...brandFields(chosen.value),
    };
  return {
    value: chosen.value,
    label: chosen.label,
    image_url: chosen.image_url,
    image_variants: chosen.image_variants,
    sub_brands: subs.map((s) => ({ ...s })),
    default: { ...def },
  };
}

export function cloneABIEntry(): BrandCountryEntry {
  const sub = allSubBrandRow();
  const abiImg = brandFields(ALL);
  const brandBlock: BrandEntry = {
    value: ALL,
    label: ALL,
    ...abiImg,
    sub_brands: [{ ...sub }],
    default: { ...sub },
  };
  return {
    brands: [brandBlock],
    default: {
      value: ALL,
      label: ALL,
      ...abiImg,
      sub_brands: [{ ...sub }],
      default: { ...sub },
    },
  };
}

import { DataItem } from "@domain/entities/common/base-config.entity";
import {
  BrandCompGroupBlock,
  BrandCompValueLabel,
  BrandCompValuesByCountry,
} from "@domain/config/presets/brands-comp/brands-comp.types";
import { getBrandImageFields } from "@common/utils/images/brand-image.utils";

export const ALL = "All";

export interface BrandCompRow {
  country: string;
  level: string;
  brand: string;
  subBrand: string;
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

/**
 * Build one opt-group block:
 *
 *   { group: <brand>, values: [{ label: <sub>, value: <sub> }, ...] }
 *
 * Synthetic `All` sub-brands are dropped; competitor blocks never
 * emit a wildcard entry.
 */
export function buildBrandGroupBlock(
  brand: string,
  subBrandSet: Set<string>,
): BrandCompGroupBlock {
  const values: BrandCompValueLabel[] = [];
  const ordered = Array.from(subBrandSet).sort((a, b) => a.localeCompare(b));

  for (const sub of ordered) {
    if (sub.toLowerCase() === ALL.toLowerCase()) {
      continue;
    }
    values.push({
      value: sub,
      label: sub,
      ...getBrandImageFields(sub, { brand_family: brand }),
    });
  }

  if (values.length === 0) {
    values.push({
      value: brand,
      label: brand,
      ...getBrandImageFields(brand),
    });
  }

  return { group: brand, values };
}

/**
 * Collapse competitor-only rows to a country-keyed opt-group map.
 * No synthetic `All` block is prepended — competitors are always a
 * concrete list.
 */
export function buildCompValuesByCountry(
  rows: BrandCompRow[],
  level: string,
  allowedCountries: Set<string> | null,
): BrandCompValuesByCountry {
  const grouped = new Map<string, Map<string, Set<string>>>();

  for (const row of rows) {
    if (row.level !== level) {
      continue;
    }
    if (allowedCountries && !allowedCountries.has(row.country)) {
      continue;
    }
    let perCountry = grouped.get(row.country);
    if (!perCountry) {
      perCountry = new Map();
      grouped.set(row.country, perCountry);
    }
    let subs = perCountry.get(row.brand);
    if (!subs) {
      subs = new Set();
      perCountry.set(row.brand, subs);
    }
    subs.add(row.subBrand);
  }

  const values: BrandCompValuesByCountry = {};
  const countries = Array.from(grouped.keys()).sort((a, b) =>
    a.localeCompare(b),
  );

  for (const country of countries) {
    const brandsMap = grouped.get(country)!;
    const blocks: BrandCompGroupBlock[] = [];

    const brandNames = Array.from(brandsMap.keys()).sort((a, b) =>
      a.localeCompare(b),
    );
    for (const brandName of brandNames) {
      if (brandName.toLowerCase() === ALL.toLowerCase()) {
        continue;
      }
      blocks.push(buildBrandGroupBlock(brandName, brandsMap.get(brandName)!));
    }

    values[country] = blocks;
  }

  return values;
}

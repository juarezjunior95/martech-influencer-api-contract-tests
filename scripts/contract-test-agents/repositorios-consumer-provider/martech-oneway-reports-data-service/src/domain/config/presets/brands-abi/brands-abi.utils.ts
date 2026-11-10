import { DataItem } from "@domain/entities/common/base-config.entity";
import {
  BrandAbiGroupBlock,
  BrandAbiValueLabel,
  BrandAbiValuesByCountry,
} from "@domain/config/presets/brands-abi/brands-abi.types";
import { getBrandImageFields } from "@common/utils/images/brand-image.utils";

export const ALL = "All";

export function brandAbiAllLabel(): BrandAbiValueLabel {
  return {
    value: ALL,
    label: ALL,
    ...getBrandImageFields(ALL),
  };
}

export interface BrandAbiRow {
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
 * `All` sub-brands are filtered out — they are represented by the
 * synthetic `group: "", values: [{ label: "All", value: "All" }]`
 * block that `brand_abi` prepends elsewhere.
 */
export function buildBrandGroupBlock(
  brand: string,
  subBrandSet: Set<string>,
): BrandAbiGroupBlock {
  const values: BrandAbiValueLabel[] = [];
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
 * Collapse ABI-only rows to a country-keyed opt-group map. Each
 * country block is prepended with the synthetic `All` group that the
 * legacy `brand_abi` filter always emits.
 */
export function buildAbiValuesByCountry(
  rows: BrandAbiRow[],
  level: string,
  allowedCountries: Set<string> | null,
): BrandAbiValuesByCountry {
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

  const values: BrandAbiValuesByCountry = {};
  const countries = Array.from(grouped.keys()).sort((a, b) =>
    a.localeCompare(b),
  );

  for (const country of countries) {
    const brandsMap = grouped.get(country)!;
    const blocks: BrandAbiGroupBlock[] = [
      {
        group: "",
        values: [brandAbiAllLabel()],
      },
    ];

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

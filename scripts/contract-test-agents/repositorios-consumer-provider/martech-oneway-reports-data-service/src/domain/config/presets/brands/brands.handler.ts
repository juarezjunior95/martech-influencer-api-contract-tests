import {
  Dataset,
  DatasetConfig,
} from "@domain/entities/common/base-config.entity";
import {
  PresetDefinition,
  PresetResponse,
  PresetValue,
  trimByCountryAccess,
} from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { UserEntity } from "@domain/entities/user.entity";
import { createDeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import {
  BRAND_DATASET_ID,
  BRAND_DATASET_QUERY,
  BrandEntry,
  BrandFilterItem,
  BrandPresetValue,
  BrandValuesByCountry,
  FlatBrandEntry,
  isBrandFilterItem,
} from "@domain/config/presets/brands/brands.types";
import {
  ALL,
  BrandRow,
  buildAllBrandEntry,
  buildBrandEntry,
  cloneABIEntry,
  flattenBrands,
  pickString,
  resolveCountryDefault,
  validateBrandConfig,
} from "@domain/config/presets/brands/brands.utils";
import { getBrandImageFields } from "@common/utils/images/brand-image.utils";

class BrandFilterHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  /**
   * Declare the brand-subbrands Databricks dataset. `PresetEntity`
   * merges this into `config.datasets` (idempotent by id) so authors
   * never wire SQL by hand for brand-driven presets.
   */
  datasets(): DatasetConfig[] {
    return [
      {
        id: BRAND_DATASET_ID,
        config: createDeltalakeFetchDataConfig({
          query: BRAND_DATASET_QUERY,
        }),
      },
    ];
  }

  handle(
    preset: PresetDefinition,
    datasets?: Dataset[],
    user?: UserEntity,
  ): PresetResponse {
    const rows = this.extractRows(datasets);

    const result: PresetResponse = {};

    for (const [key, value] of Object.entries(preset)) {
      if (!isBrandFilterItem(value)) {
        result[key] = value;
        continue;
      }

      validateBrandConfig(value);

      const grouped = this.buildValues(rows, value);

      const trimmed = user
        ? trimByCountryAccess(grouped, user, { keepKeys: ["ABI"] })
        : grouped;

      const item: BrandPresetValue = {
        values: trimmed,
        default: [],
        enabled: true,
      };

      result[key] = item as PresetValue;
    }

    return result;
  }

  private extractRows(datasets?: Dataset[]): BrandRow[] {
    const dataset = datasets?.find((d) => d.id === BRAND_DATASET_ID);
    if (!dataset?.data?.length) {
      return [];
    }

    const rows: BrandRow[] = [];
    for (const raw of dataset.data) {
      const country = pickString(raw, [
        "country_iso_code_3",
        "COUNTRY_ISO_CODE_3",
      ]);
      const brand = pickString(raw, ["brand_family", "BRAND_FAMILY"]);
      const subBrand = pickString(raw, ["sub_brand", "SUB_BRAND"]);

      if (!country || !brand) {
        continue;
      }

      rows.push({
        country,
        brand,
        subBrand: subBrand || ALL,
      });
    }
    return rows;
  }

  private buildValues(
    rows: BrandRow[],
    filter: BrandFilterItem,
  ): BrandValuesByCountry {
    const includeAllBrands = filter.includeAllBrands ?? true;
    const includeSubBrands = filter.includeSubBrands ?? true;
    const includeAllSubBrands = filter.includeAllSubBrands ?? true;
    const flatten = filter.flatten ?? false;
    const allowedCountries = filter.countries
      ? new Set(filter.countries)
      : null;

    const grouped = new Map<string, Map<string, Set<string>>>();
    for (const row of rows) {
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

    const values: BrandValuesByCountry = {};

    if (filter.includeGlobal === true) {
      values["ABI"] = cloneABIEntry();
    }

    for (const [country, brandsMap] of grouped) {
      const hierarchical: BrandEntry[] = [];

      if (includeAllBrands) {
        hierarchical.push(buildAllBrandEntry(includeSubBrands, flatten));
      }

      for (const [brandName, subBrandSet] of brandsMap) {
        if (brandName === ALL) {
          continue;
        }
        hierarchical.push(
          buildBrandEntry(brandName, subBrandSet, {
            includeSubBrands,
            includeAllSubBrands,
            flatten,
            subFieldLabel: filter.subFieldLabel,
          }),
        );
      }

      let entries: Array<BrandEntry | FlatBrandEntry>;
      if (flatten) {
        entries = flattenBrands(hierarchical);
      } else {
        entries = hierarchical;
      }

      if (filter.fieldLabel) {
        const fl = filter.fieldLabel;
        const img = getBrandImageFields(fl);
        const labeled: BrandEntry | FlatBrandEntry = filter.flatten
          ? { value: fl, label: fl, value_sub_brand: fl, ...img }
          : { value: fl, label: fl, ...img };
        entries = [labeled, ...entries];
      }

      values[country] = {
        brands: entries,
        default: resolveCountryDefault(country, entries, includeSubBrands),
      };
    }

    return values;
  }
}

export const brandsHandler = new BrandFilterHandler();

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
  BRAND_ABI_DATASET_ID,
  BRAND_ABI_DATASET_QUERY,
  BrandAbiPresetValue,
  LEVEL_ABI,
  isBrandAbiFilterItem,
} from "@domain/config/presets/brands-abi/brands-abi.types";
import {
  BrandAbiRow,
  brandAbiAllLabel,
  buildAbiValuesByCountry,
  pickString,
} from "@domain/config/presets/brands-abi/brands-abi.utils";

/**
 * `brand-abi` preset handler.
 *
 * Emits ABI brands (LEVEL_1 = 'ABI') from the shared
 * `brand-subbrand-comp` Databricks query, keyed by country. Each
 * country block is prepended with a synthetic
 * `{ group: "", values: [{ label: "All", value: "All" }] }` and the
 * top-level `default` is `{ value: "All", label: "All" }`.
 */
class BrandAbiFilterHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  datasets(): DatasetConfig[] {
    return [
      {
        id: BRAND_ABI_DATASET_ID,
        config: createDeltalakeFetchDataConfig({
          query: BRAND_ABI_DATASET_QUERY,
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
      if (!isBrandAbiFilterItem(value)) {
        result[key] = value;
        continue;
      }

      const allowedCountries = value.countries
        ? new Set(value.countries)
        : null;

      const abiValues = buildAbiValuesByCountry(
        rows,
        LEVEL_ABI,
        allowedCountries,
      );

      const trimmed = user ? trimByCountryAccess(abiValues, user) : abiValues;

      const item: BrandAbiPresetValue = {
        values: trimmed,
        default: brandAbiAllLabel(),
        enabled: true,
      };

      result[key] = item as PresetValue;
    }

    return result;
  }

  private extractRows(datasets?: Dataset[]): BrandAbiRow[] {
    const dataset = datasets?.find((d) => d.id === BRAND_ABI_DATASET_ID);
    if (!dataset?.data?.length) {
      return [];
    }

    const rows: BrandAbiRow[] = [];
    for (const raw of dataset.data) {
      const country = pickString(raw, [
        "country_iso_code_3",
        "COUNTRY_ISO_CODE_3",
      ]);
      const level = pickString(raw, ["level_1", "LEVEL_1"]);
      const brand = pickString(raw, ["brand_family", "BRAND_FAMILY"]);
      const subBrand = pickString(raw, ["sub_brand", "SUB_BRAND"]);

      if (!country || !level || !brand) {
        continue;
      }

      rows.push({
        country,
        level,
        brand,
        subBrand: subBrand || brand,
      });
    }
    return rows;
  }
}

export const brandAbiHandler = new BrandAbiFilterHandler();

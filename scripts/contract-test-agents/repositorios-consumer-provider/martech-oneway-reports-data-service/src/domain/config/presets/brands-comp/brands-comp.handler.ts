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
  BRAND_COMP_DATASET_ID,
  BRAND_COMP_DATASET_QUERY,
  BrandCompPresetValue,
  LEVEL_COMP,
  isBrandCompFilterItem,
} from "@domain/config/presets/brands-comp/brands-comp.types";
import {
  BrandCompRow,
  buildCompValuesByCountry,
  pickString,
} from "@domain/config/presets/brands-comp/brands-comp.utils";

/**
 * `brand-comp` preset handler.
 *
 * Emits competitor brands (LEVEL_1 = 'COMP') from the shared
 * `brand-subbrand-comp` Databricks query, keyed by country. No
 * synthetic "All" block is prepended and the top-level `default` is
 * an empty array, matching the legacy Drupal `brand_comp` filter.
 */
class BrandCompFilterHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  datasets(): DatasetConfig[] {
    return [
      {
        id: BRAND_COMP_DATASET_ID,
        config: createDeltalakeFetchDataConfig({
          query: BRAND_COMP_DATASET_QUERY,
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
      if (!isBrandCompFilterItem(value)) {
        result[key] = value;
        continue;
      }

      const allowedCountries = value.countries
        ? new Set(value.countries)
        : null;

      const compValues = buildCompValuesByCountry(
        rows,
        LEVEL_COMP,
        allowedCountries,
      );

      const trimmed = user ? trimByCountryAccess(compValues, user) : compValues;

      const item: BrandCompPresetValue = {
        values: trimmed,
        default: [],
        enabled: true,
      };

      result[key] = item as PresetValue;
    }

    return result;
  }

  private extractRows(datasets?: Dataset[]): BrandCompRow[] {
    const dataset = datasets?.find((d) => d.id === BRAND_COMP_DATASET_ID);
    if (!dataset?.data?.length) {
      return [];
    }

    const rows: BrandCompRow[] = [];
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

export const brandCompHandler = new BrandCompFilterHandler();

import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { Dataset } from "@domain/entities/common/base-config.entity";
import {
  PresetDefinition,
  PresetResponse,
  trimByCountryAccess,
} from "@domain/entities/preset.entity";
import { UserEntity } from "@domain/entities/user.entity";
import { AUDIENCE_TARGETING_BRANDS_BY_COUNTRY } from "@domain/config/presets/audience-targeting-brands/audience-targeting-brands.defaults";
import type {
  AudienceTargetingBrandDef,
  AudienceTargetingBrandRow,
  AudienceTargetingBrandsByCountry,
  AudienceTargetingBrandsPresetValue,
  AudienceTargetingBrandsSource,
  AudienceTargetingCompetitor,
} from "@domain/config/presets/audience-targeting-brands/audience-targeting-brands.types";
import { getBrandImageFields } from "@common/utils/images/brand-image.utils";

class AudienceTargetingBrandsPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  handle(
    preset: PresetDefinition,
    _datasets?: Dataset[],
    user?: UserEntity,
  ): PresetResponse {
    const values = this.cloneByCountry(AUDIENCE_TARGETING_BRANDS_BY_COUNTRY);
    const trimmed = user ? trimByCountryAccess(values, user) : values;

    const defaultRows = this.defaultForFirstCountry(trimmed);

    const payload: AudienceTargetingBrandsPresetValue = {
      enabled: true,
      values: trimmed,
      default: defaultRows,
    };

    return { ...preset, "audience-targeting-brands": payload };
  }

  private defaultForFirstCountry(
    map: AudienceTargetingBrandsByCountry,
  ): AudienceTargetingBrandRow[] {
    const firstKey = Object.keys(map)[0];
    if (!firstKey) {
      return [];
    }
    const rows = map[firstKey];
    return rows ? rows.map((row) => this.cloneRow(row)) : [];
  }

  private cloneByCountry(
    source: AudienceTargetingBrandsSource,
  ): AudienceTargetingBrandsByCountry {
    const out: AudienceTargetingBrandsByCountry = {};
    for (const [country, rows] of Object.entries(source)) {
      out[country] = rows.map((row) => this.cloneRow(row));
    }
    return out;
  }

  private cloneRow(row: AudienceTargetingBrandDef): AudienceTargetingBrandRow {
    return {
      value: row.value,
      label: row.label,
      is_sub_brand: row.is_sub_brand,
      ...getBrandImageFields(row.value),
      competitor: row.competitor.map((c) => {
        const copy: AudienceTargetingCompetitor = {
          value: c.value,
          label: c.label,
          ...getBrandImageFields(c.value),
        };
        if (c.is_sub_brand !== undefined) {
          copy.is_sub_brand = c.is_sub_brand;
        }
        return copy;
      }),
    };
  }
}

export const audienceTargetingBrandsHandler =
  new AudienceTargetingBrandsPresetHandler();

import { getBrandImage } from "@common/utils/images/brand-image.utils";
import { getCountryFlag } from "@common/utils/images/country-image.utils";
import { formatDirection } from "@common/utils/direction.utils";
import { formatMonth } from "@common/utils/month.utils";
import { areDatesInSameQuarter } from "@common/utils/period.utils";

/**
 * KPI field names (lowercase)
 * Map new records here as they are added to the source
 */
export type KpiField =
  | "dt_ini"
  | "dt_end"
  | "version_id"
  | "kpi_name"
  | "abi_zone"
  | "country_iso_code_3"
  | "image_key"
  | "raw_geography"
  | "raw_brand"
  | "price_tier"
  | "segment"
  | "maturity"
  | "level_1"
  | "level_2"
  | "level_3"
  | "level_4"
  | "unit_of_measure"
  | "comp_unit_of_measure"
  | "ac"
  | "bu"
  | "ly"
  | "og_ly"
  | "og_bu"
  | "ac_vs_ly"
  | "ac_vs_bu"
  | "bu_vs_ly"
  | "le"
  | "le_ly"
  | "le_vs_ly"
  | "le_vs_bu"
  | "value"
  | "mix"
  | "per_hl_vs_ly";

/**
 * Computed/derived field names for output
 * Map new records here as they are added to the source
 */
export type KpiComputedField =
  | "comp_direction"
  | "date_refresh"
  | "vs_ly_label"
  | "vs_ly_label_suffix";

/**
 * Optional construction-time behavior for {@link KpiEntity}.
 * Omitted options preserve existing defaults (backward compatible).
 */
export interface KpiEntityOptions {
  /**
   * Controls `positiveZero` for variation fields that currently use
   * `formatDirection(..., { positiveZero: true })`.
   * - `true` (default): zero is treated like a positive value (“up”) — historical behavior.
   * - `false`: same as `formatDirection` default — zero maps to “down”.
   */
  variationPositiveZero?: boolean;
}

export class KpiEntity {
  [key: KpiField | KpiComputedField | string]:
    | string
    | number
    | object
    | boolean;

  constructor(
    init?: Partial<Record<KpiField | string, any>>,
    options?: KpiEntityOptions,
  ) {
    const variationPositiveZero = options?.variationPositiveZero ?? true;

    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        // Normalize field names to lowercase
        const normalizedKey = key.toLowerCase();
        this[normalizedKey] = value;
      });
    }

    this.vs_ly_label_suffix = areDatesInSameQuarter(
      this.dt_end as string,
      this.dt_ini as string,
    )
      ? "MTD"
      : "YTD";

    this.comp_direction =
      this.value !== undefined
        ? formatDirection(Number(this.value))
        : undefined;

    this.variationDirectionAc =
      this.ac !== undefined
        ? formatDirection(Number(this.ac), {
            positiveZero: variationPositiveZero,
          })
        : undefined;

    this.variationDirectionVsLy =
      this.ac_vs_ly !== undefined
        ? formatDirection(Number(this.ac_vs_ly), {
            positiveZero: variationPositiveZero,
          })
        : undefined;

    this.variationDirectionPerHl =
      this.per_hl !== undefined
        ? formatDirection(Number(this.per_hl), {
            positiveZero: variationPositiveZero,
          })
        : undefined;

    this.variationDirectionPerHlVsLy =
      this.per_hl_vs_ly !== undefined
        ? formatDirection(Number(this.per_hl_vs_ly), {
            positiveZero: variationPositiveZero,
          })
        : undefined;

    this.variationDirectionVsLe =
      this.le_vs_ly !== undefined
        ? formatDirection(Number(this.le_vs_ly), {
            positiveZero: variationPositiveZero,
          })
        : undefined;

    this.variationDirectionGrowthCont =
      this.growth_contrib !== undefined
        ? formatDirection(Number(this.growth_contrib), {
            positiveZero: variationPositiveZero,
          })
        : undefined;

    this.variationDirectionTooltip =
      this.tooltip !== undefined
        ? formatDirection(Number(this.tooltip), {
            positiveZero: variationPositiveZero,
          })
        : undefined;

    this.variationDirectionContribution =
      this.contribution !== undefined
        ? formatDirection(Number(this.contribution), {
            positiveZero: variationPositiveZero,
          })
        : undefined;

    this.variationDirectionOgVsLy =
      this.og_vs_ly !== undefined
        ? formatDirection(Number(this.og_vs_ly))
        : undefined;

    this.variationDirectionVsBu =
      this.ac_vs_bu !== undefined
        ? formatDirection(Number(this.ac_vs_bu))
        : undefined;

    this.variationDirectionAverageLine =
      this.average_line !== undefined
        ? formatDirection(Number(this.average_line))
        : undefined;

    this.variationDirectionVilcVsLy =
      this.vilc_vs_ly !== undefined
        ? formatDirection(Number(this.vilc_vs_ly), {
            positiveZero: variationPositiveZero,
          })
        : undefined;

    this.variationDirectionNrVsLy =
      this.nr_vs_ly !== undefined
        ? formatDirection(Number(this.nr_vs_ly), {
            positiveZero: variationPositiveZero,
          })
        : undefined;

    this.variationDirectionSmVsLy =
      this.sm_vs_ly !== undefined
        ? formatDirection(Number(this.sm_vs_ly), {
            positiveZero: variationPositiveZero,
          })
        : undefined;

    this.variationDirectionVolVsLy =
      this.vol_vs_ly !== undefined
        ? formatDirection(Number(this.vol_vs_ly), {
            positiveZero: variationPositiveZero,
          })
        : undefined;

    this.variationDirectionMacoVsLy =
      this.maco_vs_ly !== undefined
        ? formatDirection(Number(this.maco_vs_ly), {
            positiveZero: variationPositiveZero,
          })
        : undefined;

    this.contributionMeasure =
      this.contribution_measure_unit?.[
        this.kpi_name as keyof typeof this.contribution_measure_unit
      ] ?? undefined;

    this.variationDirectionDelta =
      this.delta !== undefined
        ? formatDirection(Number(this.delta))
        : undefined;

    this.refreshMonthLabel = formatMonth(this.dt_end as string, {
      includeYear: true,
      yearFormat: "short",
    });

    this.lyMonthLabel = formatMonth(this.dt_end as string, {
      includeYear: true,
      yearFormat: "short",
      usePreviousYear: true,
    });

    if (this.raw_brand !== undefined) {
      this.brand = {
        imageSquare: getBrandImage(this.raw_brand as string, {
          format: "square",
        }),
        imageTable: getBrandImage(this.raw_brand as string, {
          format: "table",
        }),
      };
    }

    if (
      this.image_key !== undefined ||
      this.country_iso_code_3 !== undefined ||
      this.raw_geography !== undefined
    ) {
      const countryCode =
        (this.image_key as string) ||
        (this.country_iso_code_3 as string) ||
        (this.raw_geography as string);
      this.country = {
        imageIcon: getCountryFlag(countryCode, {
          format: "icon",
        }),
        imageWaving: getCountryFlag(countryCode, {
          format: "waving",
        }),
      };
    }
  }
}

/**
 * Same as {@link KpiEntity} but variation fields use `formatDirection` with
 * `positiveZero: false` (zero maps to “down”). Use as `entityClass` on datasources
 * that need strict zero handling; existing datasources keep using {@link KpiEntity}.
 */
export class KpiEntityNegativeZero extends KpiEntity {
  constructor(init?: Partial<Record<KpiField | string, any>>) {
    super(init, { variationPositiveZero: false });
  }
}

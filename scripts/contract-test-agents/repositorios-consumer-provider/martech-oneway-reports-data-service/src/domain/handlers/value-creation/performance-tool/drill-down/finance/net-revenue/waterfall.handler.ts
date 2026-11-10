import { formatDirection } from "@common/utils/direction.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
import { getBrandImage } from "@common/utils/images/brand-image.utils";
import { getCountryFlag } from "@common/utils/images/country-image.utils";

class WaterfallHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    return defaultDataset?.data ? this.processDatasetData(defaultDataset) : [];
  }

  private processDatasetData(dataset: Dataset): DataItem[] {
    const total = dataset.data.length;

    return dataset.data.map((item, index) => {
      const direction = (value?: number) =>
        formatDirection(Number(value), { positiveZero: true });

      const labelValue = this.resolveLabel(item);
      let imageValue = this.resolveImage(item);

      const isFirst = index === 0;
      const isLast = index === total - 1;

      if (isFirst || isLast) {
        imageValue = this.resolveTotalImage(item);
      }

      const acDeltaValue = isFirst || isLast ? item.ac : item.ac_vs_ly;
      const badgeFlag = this.resolveBadgeFlag(item, index, total);

      return {
        dt_end: item.dt_end,
        period: item.step_name,
        label_value: this.resolveLabelValue(labelValue, item, badgeFlag),
        image_value: imageValue,
        waterfall_filter: item.waterfall_filter,
        badgeFlag: badgeFlag,

        unit_of_measure: item.unit_of_measure ?? null,
        comp_unit_of_measure: item.comp_unit_of_measure ?? null,

        ac: item.ac,
        ac_direction: direction(Number(item.ac)),

        ac_delta: acDeltaValue,
        ac_delta_direction: direction(Number(acDeltaValue)),

        nr_vs_ly: item.nr_per_hl_vs_ly,
        nr_vs_ly_direction: direction(Number(item.nr_per_hl_vs_ly)),

        vol_vs_ly: item.vol_vs_ly,
        vol_vs_ly_direction: direction(Number(item.vol_vs_ly)),

        ac_vs_ly: item.ac_vs_ly,
        ac_vs_ly_direction: direction(Number(item.ac_vs_ly)),
      };
    });
  }

  private resolveLabel(item: any): string {
    switch (item.waterfall_filter) {
      case "portfolio":
        return item.portfolio;
      case "brand":
        return item.raw_brand;
      case "beer_price_segment":
      case "sub_brand":
        return item.step_name;
      default:
        return item.country_iso_code_3;
    }
  }

  private resolveImage(item: any) {
    if (item.waterfall_filter === "brand") {
      return getBrandImage(item.raw_brand as string, {
        format: "square",
      });
    }
    if (item.waterfall_filter === "country") {
      return getCountryFlag(item.country_iso_code_3 as string);
    }

    return "";
  }

  private resolveTotalImage(item: any) {
    if (item.waterfall_filter === "sub_brand") {
      return getBrandImage(item.raw_brand as string, {
        format: "square",
      });
    }

    return getCountryFlag(item.country_iso_code_3 as string);
  }

  private resolveLabelValue(
    labelValue: string,
    item: any,
    badgeFlag: any,
  ): string | string[] {
    if (badgeFlag) {
      return [labelValue, item.country_iso_code_3];
    }

    return item.waterfall_filter === "brand" ? [labelValue] : labelValue;
  }

  /**
   * Resolve badgeFlag based on the same logic from contribution-waterfall.jsonata
   * - Returns undefined for: Others, first item, last item, empty country code, or "ABI"
   * - Returns badgeFlag object with src and alt for valid country codes
   */
  private resolveBadgeFlag(
    item: any,
    index: number,
    total: number,
  ): { src: string; alt: string } | undefined {
    const isFirst = index === 0;
    const isLast = index === total - 1;
    const isOthers =
      item.step_name === "Others" || item.label_value === "Others";

    const isCountry = item.waterfall_filter === "country";

    // Extract country code from period if not available directly
    let countryCode = item.country_iso_code_3 || "";
    if (!countryCode && item.period) {
      const periodParts = item.period.split("\n");
      if (periodParts.length > 1) {
        countryCode = periodParts[1];
      }
    }

    // Return undefined if conditions are met
    if (isOthers || isCountry || isFirst || isLast || !countryCode) {
      return undefined;
    }

    // Get country flag image
    const countryImage = getCountryFlag(countryCode);

    // Return badgeFlag if image exists
    return countryImage
      ? {
          src: countryImage,
          alt: countryCode,
        }
      : undefined;
  }
}

export const waterfallHandler = new WaterfallHandler();

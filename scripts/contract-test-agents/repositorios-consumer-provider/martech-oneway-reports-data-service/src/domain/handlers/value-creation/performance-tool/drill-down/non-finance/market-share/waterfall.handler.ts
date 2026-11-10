import { formatDirection } from "@common/utils/direction.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
import { getBrandImage } from "@common/utils/images/brand-image.utils";
import { getCountryFlag } from "@common/utils/images/country-image.utils";

class MarketShareWaterfallHandler extends BaseHandler {
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
        formatDirection(Number(value), {
          positiveZero: true,
        });

      const isFirst = index === 0;
      const isLast = index === total - 1;
      const isTotal = isFirst || isLast;

      const rawBrand = item.raw_brand as string;
      const countryIso = item.country_iso_code_3 as string;
      const filterZone = item.filter_zone as string;

      if (filterZone == "EUR" && item.filter_waterfall_filter == "brand") {
        item.filter_waterfall_filter = "brand_eur";
      }

      return {
        waterfall_type: item.filter_waterfall_filter,
        label_value: item.labels,
        image_value: this.resolveImage(rawBrand, countryIso, isTotal),
        badge_value: this.resolveBadge(item, countryIso, isTotal),
        country_iso_code_3: countryIso,
        vol_vs_ly: item.vol_vs_ly,
        vol_vs_ly_direction: direction(Number(item.vol_vs_ly)),
        vol_weight: item.vol_weight,
        vol_weight_direction: direction(Number(item.vol_weight)),
        ac: item.ac,
        ac_direction: direction(Number(item.ac)),
        delta: item.delta,
        ind_vs_ly: item.ind_vs_ly,
        ind_vs_ly_direction: direction(Number(item.ind_vs_ly)),
        vs_ly: item.vs_ly,
        vs_ly_direction:
          item.vs_ly != null ? direction(Number(item.vs_ly)) : null,
        unit_of_measure: item.unit_of_measure ?? null,
        comp_unit_of_measure: item.comp_unit_of_measure ?? null,
      };
    });
  }

  private resolveImage(
    rawBrand: string,
    countryIso: string,
    isTotal: boolean,
  ): string {
    if (isTotal && countryIso) {
      return getCountryFlag(countryIso);
    }

    if (rawBrand) {
      return getBrandImage(rawBrand, { format: "square" });
    }

    if (countryIso) {
      return getCountryFlag(countryIso);
    }

    return "";
  }

  private resolveBadge(item, countryIso: string, isTotal: boolean): string {
    if (isTotal || item.filter_waterfall_filter == "country") {
      return "";
    }

    if (
      countryIso != "Others" &&
      item.filter_zone == "EUR" &&
      item.filter_country == "ABI"
    ) {
      return getCountryFlag(countryIso);
    }

    return "";
  }
}

export const marketShareWaterfallHandler = new MarketShareWaterfallHandler();

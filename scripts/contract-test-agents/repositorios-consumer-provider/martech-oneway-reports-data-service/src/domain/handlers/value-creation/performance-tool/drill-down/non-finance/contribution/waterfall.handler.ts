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

      let imageValue = this.resolveImage(item);

      const isFirst = index === 0;
      const isLast = index === total - 1;
      const isNotCountry = item.viewtype !== "country";
      const isNotRegion = item.viewtype !== "region";

      if (isNotCountry && isNotRegion && (isFirst || isLast)) {
        imageValue = getCountryFlag(item.country_iso_code_3 as string);
      }

      const acDeltaValue = isFirst || isLast ? item.ac : item.ac_delta;

      return {
        dt_end: item.dt_end,
        period: item.timeframe,
        label_value: item.bar,
        image_value: imageValue,
        waterfall_filter: item.viewtype,

        unit_of_measure: item.unit_of_measure ?? null,
        comp_unit_of_measure: item.comp_unit_of_measure ?? null,

        ac: item.ac,
        ac_direction: direction(Number(item.ac)),

        ac_delta: acDeltaValue,
        ac_delta_direction: direction(Number(acDeltaValue)),

        nr_weight: item.nr_weight,
        nr_weight_direction: direction(Number(item.nr_weight)),

        ac_vs_lq: item.ac_vs_lq,
        ac_vs_lq_direction: direction(Number(item.ac_vs_lq)),

        ac_vs_ly: item.ac_vs_ly,
        ac_vs_ly_direction: direction(Number(item.ac_vs_ly)),
      };
    });
  }

  private resolveImage(item: any) {
    if (item.viewtype === "brand") {
      return getBrandImage(item.bar as string, {
        format: "square",
        brand_family: item.raw_brand,
      });
    }
    if (item.viewtype === "country") {
      return getCountryFlag(item.country_iso_code_3 as string);
    }

    return "";
  }
}

export const waterfallHandler = new WaterfallHandler();

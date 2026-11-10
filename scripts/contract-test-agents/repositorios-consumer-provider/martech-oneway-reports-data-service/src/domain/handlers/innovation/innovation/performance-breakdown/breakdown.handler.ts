import { getBrandImage } from "@common/utils/images/brand-image.utils";
import { formatDirection } from "@common/utils/direction.utils";
import { getCountryFlag } from "@common/utils/images/country-image.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

/**
 * Innovation - Innovation - Performance & Breakdown - Breakdown Handler
 * Handles the raw data from the Innovation - Innovation - Performance & Breakdown - Breakdown SQL query
 */
class BreakdownHandler extends BaseHandler {
  async handle(
    datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    // Use defaultDataset directly as it's already the found dataset
    return this.processDatasetData(defaultDataset);
  }

  /**
   * Private function to process dataset data
   * @param dataset - The dataset to be processed (defaultDataset)
   * @returns Processed dataset data
   */
  private processDatasetData(dataset: Dataset): DataItem[] {
    return dataset.data.map((item) => {
      const leVsLy = this.getValue(item, "LE_VS_LY", "le_vs_ly");
      const leVsBu = this.getValue(item, "LE_VS_BU", "le_vs_bu");
      const growthContrib = this.getValue(
        item,
        "GROWTH_CONTRIB",
        "growth_contrib",
      );
      const rawBrand = this.getValue(item, "RAW_BRAND", "raw_brand") as string;
      const countryIso = this.getValue(
        item,
        "COUNTRY_ISO_CODE_3",
        "country_iso_code_3",
      ) as string;

      const variationDirectionVsLy = formatDirection(Number(leVsLy), {
        positiveZero: true,
      });
      const variationDirectionVsBu = formatDirection(Number(leVsBu), {
        positiveZero: true,
      });
      const variationDirectionGrowthCont = formatDirection(
        Number(growthContrib),
        {
          positiveZero: true,
        },
      );
      const brandImage = getBrandImage(rawBrand, {
        format: "square",
      });
      const countryFlag = getCountryFlag(countryIso, {
        format: "icon",
      });

      return {
        kpi_name: this.getValue(item, "KPI_NAME", "kpi_name"),
        brand: rawBrand,
        brand_image: brandImage,
        country: countryIso,
        country_flag: countryFlag,
        expiration: this.getValue(item, "EXPIRATION", "expiration"),
        baseline: this.getValue(item, "BASELINE", "baseline"),
        dt_ini: this.getValue(item, "DT_INI", "dt_ini"),
        dt_end: this.getValue(item, "DT_END", "dt_end"),

        le: this.getValue(item, "LE", "le"),
        le_total: this.getValue(item, "LE_TOTAL", "le_total"),
        le_ly_total: this.getValue(item, "LE_LY_TOTAL", "le_ly_total"),

        le_vs_ly: leVsLy,
        le_vs_ly_direction: variationDirectionVsLy,
        le_vs_bu: leVsBu,
        le_vs_bu_direction: variationDirectionVsBu,

        growth_cont: growthContrib,
        growth_cont_direction: variationDirectionGrowthCont,
      };
    });
  }

  private getValue(item: DataItem, ...keys: string[]) {
    for (const key of keys) {
      if (item[key] !== undefined) {
        return item[key];
      }
    }

    return undefined;
  }
}

export const breakdownHandler = new BreakdownHandler();

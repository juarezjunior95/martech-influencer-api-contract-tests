import {
  DirectionFormatParams,
  formatDirection,
} from "@common/utils/direction.utils";
import { isReverseDirection, getKpiTitle } from "@common/utils/portfolio.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

/**
 * Value Creation - Brands - PL - Brands Handler
 * Handles the raw data from the Value Creation - Brands Performance - PL - Brands SQL query
 */
class BrandsHandler extends BaseHandler {
  async handle(
    datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    return this.processDatasetData(defaultDataset);
  }

  /**
   * Private function to process dataset data
   * @param dataset - The dataset to be processed (defaultDataset)
   * @returns Processed dataset data
   */
  private processDatasetData(dataset: Dataset): DataItem[] {
    return dataset.data.map((item) => {
      const variationParams: DirectionFormatParams = {
        invert: isReverseDirection(String(item.KPI_NAME)),
      };

      const dir = (field: keyof typeof item) =>
        formatDirection(Number(item[field]), variationParams);

      return {
        kpi_name: item.KPI_NAME,
        subtitle: getKpiTitle(String(item.KPI_NAME)),
        segment: item.SEGMENT,
        brand: item.RAW_BRAND,

        ac: item.AC ?? null,
        ac_direction: dir("AC"),
        ac_vs_ly: item.AC_VS_LY ?? null,
        ac_vs_ly_direction: dir("AC_VS_LY"),

        dt_ini: item.DT_INI ?? null,
        dt_end: item.DT_END ?? null,
      };
    });
  }
}

export const brandsHandler = new BrandsHandler();

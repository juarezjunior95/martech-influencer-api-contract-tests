import {
  DirectionFormatParams,
  formatDirection,
} from "@common/utils/direction.utils";
import { isReverseDirection, getKpiTitle } from "@common/utils/portfolio.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

/**
 * Value Creation - Deep Dive Performance - PL - Deep Dive Handler
 * Handles the raw data from the Value Creation - Deep Dive Performance - PL - Deep Dive SQL query
 */
class DeepDiveHandler extends BaseHandler {
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
        kpi_title: getKpiTitle(String(item.KPI_NAME)),
        ac: item.AC ?? null,
        ly: item.LY ?? null,
        bu: item.BU ?? null,

        og_vs_bu: item.OG_VS_BU ?? null,
        og_vs_bu_comp: item.OG_VS_BU_COMP ?? null,
        og_vs_bu_comp_direction: dir("OG_VS_BU_COMP"),

        og_vs_ly: item.OG_VS_LY ?? null,
        og_vs_ly_comp: item.OG_VS_LY_COMP ?? null,
        og_vs_ly_comp_direction: dir("OG_VS_LY_COMP"),

        dt_ini: item.MAX_INI ?? null,
        dt_end: item.MAX_END ?? null,
      };
    });
  }
}

export const deepDiveHandler = new DeepDiveHandler();

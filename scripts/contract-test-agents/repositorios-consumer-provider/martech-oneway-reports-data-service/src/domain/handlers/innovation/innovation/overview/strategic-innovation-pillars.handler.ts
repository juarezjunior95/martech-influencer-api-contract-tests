import { formatDirection } from "@common/utils/direction.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

/**
 * Innovation - Innovation - Overview - Strategic Innovation Pillars Handler
 * Handles the raw data from the Innovation - Innovation - Overview - Strategic Innovation Pillars SQL query
 */
class StrategicInnovationPillarsHandler extends BaseHandler {
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
      const averageLineValue =
        item.AVERAGE_LINE !== undefined ? item.AVERAGE_LINE : item.average_line;
      const variationDirectionAverageLine = formatDirection(
        Number(averageLineValue),
        {
          positiveZero: true,
        },
      );

      return {
        ...item,
        country: item.COUNTRY_ISO_CODE_3 ?? item.country_iso_code_3,
        dt_ini: item.DT_INI ?? item.dt_ini,
        dt_end: item.DT_END ?? item.dt_end,
        kpi_name: item.KPI_NAME ?? item.kpi_name,
        ac: item.AC ?? item.ac,
        ac_vs_ly: item.AC_VS_LY !== undefined ? item.AC_VS_LY : item.ac_vs_ly,
        level_1: item.LEVEL_1 ?? item.level_1,
        average_line: averageLineValue,
        average_line_direction: variationDirectionAverageLine,
        year: item.YEAR_INI ?? item.year,
        max_year: item.MAX_YEAR ?? item.max_year,
      };
    });
  }
}

export const strategicInnovationPillarsHandler =
  new StrategicInnovationPillarsHandler();

import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

/**
 * Innovation - Innovation - Overview - Big Numbers Handler
 * Handles the raw data from the Innovation - Innovation - Overview - Big Numbers SQL query
 */
class BigNumbersHandler extends BaseHandler {
  private readonly MEASURE_KPIS = {
    innovation_volume: {
      measure: "%",
      secondary_measure: null,
    },
    innovation_volume_mix: {
      measure: "pp",
      secondary_measure: "%",
    },
    innovation_nr: {
      measure: "%",
      secondary_measure: null,
    },
    innovation_maco: {
      measure: "%",
      secondary_measure: null,
    },
  };

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
      const kpi_measures = this.MEASURE_KPIS[
        item.kpi_name as keyof typeof this.MEASURE_KPIS
      ] ?? { measure: null, secondary_measure: null };

      return {
        ...item,
        country: item.country_iso_code_3,
        comp_ac_vs_ly_direction: item.variationDirectionVsLy,
        comp_le_vs_ly_direction: item.variationDirectionVsLe,
        measure: kpi_measures.measure,
        secondary_measure: kpi_measures.secondary_measure,
      };
    });
  }
}

export const bigNumbersHandler = new BigNumbersHandler();

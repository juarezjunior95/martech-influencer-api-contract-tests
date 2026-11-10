import { formatDirection } from "@common/utils/direction.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

/**
 * Value Creation - Performance Tool - Drill Down - Finance - Volume - Overtime Performance Handler
 * Handles the data from KpiEntity and overrides variationDirectionVsLy and variationDirectionVsBu to treat 0 as negative
 */
class OvertimePerformanceHandler extends BaseHandler {
  async handle(
    datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    return this.processDatasetData(defaultDataset);
  }

  private processDatasetData(dataset: Dataset): DataItem[] {
    return dataset.data.map((item) => {
      const variationDirectionVsLy = formatDirection(Number(item.ac_vs_ly), {
        positiveZero: false,
      });

      const variationDirectionVsBu = formatDirection(Number(item.ac_vs_bu), {
        positiveZero: false,
      });

      return {
        ...item,
        variationDirectionVsLy,
        variationDirectionVsBu,
      };
    });
  }
}

export const overtimePerformanceHandler = new OvertimePerformanceHandler();

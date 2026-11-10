import { BaseHandler } from "@domain/handlers/handler.base";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";

/**
 * Brand Power Book Trend By Trend Over Time Power Mix Handler
 * Handles the raw data from the brand power book Trend By Trend Over Time Power Mix SQL query
 */
class ByTrendOverTimePowerMixHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      return {
        value: item.AC,
        dt_ini: item.DT_INI,
      };
    });
  }
}

export const byTrendOverTimePowerMixHandler =
  new ByTrendOverTimePowerMixHandler();

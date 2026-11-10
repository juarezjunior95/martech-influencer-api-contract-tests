import { BaseHandler } from "@domain/handlers/handler.base";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";

/**
 * Brand Power Book Trend By Year Power Ac Power Mix Handler
 * Handles the raw data from the brand power book Trend By Year Power Ac Power Mix SQL query
 */
class YearByYearPowerAcPowerMixHandler extends BaseHandler {
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

export const yearByYearPowerAcPowerMixHandler =
  new YearByYearPowerAcPowerMixHandler();

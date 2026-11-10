import { BaseHandler } from "@domain/handlers/handler.base";
import { formatDirection } from "@common/utils/direction.utils";
import { formatPeriod } from "@common/utils/period.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";

/**
 * Brand Power Book Trend By Trend Over Time Handler
 * Handles the raw data from the brand power book Trend By Trend Over Time SQL query
 */
class ByTrendOverTimeHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const label = formatPeriod(item.DT_INI as string, item.DT_END as string, {
        includeYear: true,
        yearFormat: "short",
      });

      const variation_direction = formatDirection(Number(item.AC_VS_LY));

      return {
        value: item.AC,
        variation: item.AC_VS_LY,
        variation_direction,
        label,
      };
    });
  }
}

export const byTrendOverTimeHandler = new ByTrendOverTimeHandler();

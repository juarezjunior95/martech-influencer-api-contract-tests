import { BaseHandler } from "@domain/handlers/handler.base";
import { formatDirection } from "@common/utils/direction.utils";
import { formatPeriod } from "@common/utils/period.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";

/**
 * Brand Power Book Trend By Year Power Ac Handler
 * Handles the raw data from the brand power book Trend By Year Power Ac SQL query
 */
class ByYearPowerAcHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const label = formatPeriod(item.DT_INI as string, item.DT_END as string, {
        useCumulativeQuarter: true,
        includeYear: true,
        yearFormat: "short",
      });

      const variation_direction = formatDirection(Number(item.AC_VS_LY));

      return {
        value: item.AC,
        variation: item.AC_VS_PREVIOUS_YEAR,
        variation_direction,
        label,
      };
    });
  }
}

export const byYearPowerAcHandler = new ByYearPowerAcHandler();

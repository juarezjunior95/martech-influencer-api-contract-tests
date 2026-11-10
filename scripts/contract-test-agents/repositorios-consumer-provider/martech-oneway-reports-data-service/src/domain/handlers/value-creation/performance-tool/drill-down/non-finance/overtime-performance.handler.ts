import { formatDirection } from "@common/utils/direction.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

class OvertimePerformanceHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const variationDirectionVsLy = formatDirection(Number(item.AC_VS_LY));

      return {
        period_type: item.PERIOD,
        value: item.AC,
        value_measure: item.UNIT_OF_MEASURE,
        variation_vs_ly: item.AC_VS_LY,
        comp_unit_of_measure: item.COMP_UNIT_OF_MEASURE,
        variation_direction_vs_ly: variationDirectionVsLy,
        dt_ini: item.DT_INI,
        dt_end: item.DT_END,
      };
    });
  }
}

export const overtimePerformanceHandler = new OvertimePerformanceHandler();

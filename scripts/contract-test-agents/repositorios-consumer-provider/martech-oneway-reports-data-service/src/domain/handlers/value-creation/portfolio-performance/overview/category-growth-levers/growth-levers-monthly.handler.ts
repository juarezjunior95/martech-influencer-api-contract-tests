import { BaseHandler } from "@domain/handlers/handler.base";
import { formatDirection } from "@common/utils/direction.utils";
import { labelVsLyMonth } from "@common/utils/label.utils";
import { formatMonth } from "@common/utils/month.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";

/**
 * Value Creation - Overview - Category Growth Levers - Monthly Handler
 * Handles the raw data from the Value Creation - Overview - Category Growth Levers - Monthly SQL query
 */
class GrowthLeversMonthlyHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const refreshDateLabel = formatMonth(item.DT_END as string, {
        includeYear: true,
        yearFormat: "short",
      });

      const vsLyLabelSuffix =
        item.DT_END.toLocaleString() === item.DT_INI.toLocaleString()
          ? "MTD"
          : "YTD";

      const labelVsLyValue = labelVsLyMonth({
        dtEnd: item.DT_END as string,
        dtIni: item.DT_INI as string,
        yearFormat: "short",
      });

      const variationDirectionVsLy = formatDirection(Number(item.VALUE));

      return {
        comp_direction: variationDirectionVsLy,
        date_refresh: refreshDateLabel,
        vs_ly_label: labelVsLyValue,
        vs_ly_label_suffix: vsLyLabelSuffix,
        dt_ini: item.DT_INI,
        dt_end: item.DT_END,
        value: item.VALUE,
        ac: item.AC,
        mix: item.MIX,
        kpi_name: item.KPI_NAME,
      };
    });
  }
}

export const growthLeversMonthlyHandler = new GrowthLeversMonthlyHandler();

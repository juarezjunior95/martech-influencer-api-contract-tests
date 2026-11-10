import { BaseHandler } from "@domain/handlers/handler.base";
import { formatDirection } from "@common/utils/direction.utils";
import { labelVsLy } from "@common/utils/label.utils";
import {
  formatPeriod,
  areDatesInSameQuarter,
} from "@common/utils/period.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";

/**
 * Value Creation - Overview - Category Growth Levers - Quarterly Handler
 * Handles the raw data from the Value Creation - Overview - Category Growth Levers - Quarterly SQL query
 */
class GrowthLeversQuarterlyHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const refreshDateLabel = formatPeriod(
        item.DT_INI as string,
        item.DT_END as string,
        {
          yearFormat: "short",
          includeYear: true,
          alwaysUseQuarter: true,
        },
      );

      const vsLyLabelSuffix = areDatesInSameQuarter(
        item.DT_END as string,
        item.DT_INI as string,
      )
        ? "MTD"
        : "YTD";

      const labelVsLyValue = labelVsLy({
        dtIni: item.DT_INI as string,
        dtEnd: item.DT_END as string,
        yearFormat: "short",
        periodFormatParams: {
          alwaysUseQuarter: true,
        },
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

export const growthLeversQuarterlyHandler = new GrowthLeversQuarterlyHandler();

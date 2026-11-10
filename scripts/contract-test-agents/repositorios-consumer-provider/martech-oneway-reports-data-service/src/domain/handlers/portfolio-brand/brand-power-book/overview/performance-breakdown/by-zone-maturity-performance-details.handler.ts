import { BaseHandler } from "@domain/handlers/handler.base";
import { formatDirection } from "@common/utils/direction.utils";
import { labelVsLq, labelVsLy } from "@common/utils/label.utils";
import { formatPeriod } from "@common/utils/period.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";

/**
 * Brand Power Book Performance Breakdown By Zone Maturity Performance Details Handler
 * Handles the raw data from the brand power book Performance Breakdown By Zone Maturity Performance Details SQL query
 */
class ByZoneMaturityPerformanceDetailsHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const period = formatPeriod(
        item.DT_INI as string,
        item.DT_END as string,
        {
          includeYear: true,
          yearFormat: "short",
        },
      );
      const labelFormattedAc = `AC - ${period}`;

      const labelVsLqValue = labelVsLq({
        dtIni: item.DT_INI as string,
        dtEnd: item.DT_END as string,
        yearFormat: "short",
      });
      const labelLq = `LQ - ${labelVsLqValue}`;
      const labelFormattedLq = labelLq.replace("vs ", "");

      const labelVsLyValue = labelVsLy({
        dtIni: item.DT_INI as string,
        dtEnd: item.DT_END as string,
        yearFormat: "short",
      });
      const labelLy = `LY - ${labelVsLyValue}`;
      const labelFormattedLy = labelLy.replace("vs ", "");

      const variationDirectionVsLy = formatDirection(Number(item.AC_VS_LY));
      const variationDirectionVsLq = formatDirection(Number(item.AC_VS_LQ));

      return {
        country: item.COUNTRY_ISO_CODE_3,
        label_ac: labelFormattedAc,
        ac: item.AC,
        label_ly: labelFormattedLy,
        ac_vs_ly: item.AC_VS_LY,
        variation_direction_ly: variationDirectionVsLy,
        label_lq: labelFormattedLq,
        ac_vs_lq: item.AC_VS_LQ,
        variation_direction_lq: variationDirectionVsLq,
        level_1: item.LEVEL_1,
      };
    });
  }
}

export const byZoneMaturityPerformanceDetailsHandler =
  new ByZoneMaturityPerformanceDetailsHandler();

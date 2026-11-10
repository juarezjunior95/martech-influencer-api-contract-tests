import { BaseHandler } from "@domain/handlers/handler.base";
import { formatDirection } from "@common/utils/direction.utils";
import { labelVsLy } from "@common/utils/label.utils";
import { formatPeriod } from "@common/utils/period.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";

/**
 * Brand Power Book Summary Power By Segment Performance Handler
 * Handles the raw data from the brand power book Summary Power By Segment Performance SQL query
 */
class BySegmentPerformanceHandler extends BaseHandler {
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

      const labelVsLyValue = labelVsLy({
        dtIni: item.DT_INI as string,
        dtEnd: item.DT_END as string,
        yearFormat: "short",
      });
      const labelLy = `LY - ${labelVsLyValue}`;
      const labelFormattedLy = labelLy.replace("vs ", "");

      const variationDirectionVsLy = formatDirection(Number(item.AC_VS_LY));

      return {
        price_tier: item.PRICE_TIER,
        segment: item.LEVEL_1,
        label_ac: labelFormattedAc,
        ac: item.AC,
        label_ly: labelFormattedLy,
        ac_vs_ly: item.AC_VS_LY,
        variation_direction_ly: variationDirectionVsLy,
        level_1: item.LEVEL_1,
      };
    });
  }
}

export const bySegmentPerformanceHandler = new BySegmentPerformanceHandler();

import { BaseHandler } from "@domain/handlers/handler.base";
import { formatDirection } from "@common/utils/direction.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";

/**
 * Performance Overtime Trends Handler
 * Handles aggregated KPI data grouped by period (Year / Quarter)
 */
class PerformanceToolByOverTimeTrendsHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const variationDirectionAc = formatDirection(Number(item.AC));
      const variationDirectionVsLy = formatDirection(Number(item.AC_VS_LY));

      let year: number | null = null;
      let quarter: string | null = null;

      if (typeof item.PERIOD === "string") {
        const [yearStr, quarterStr] = item.PERIOD.split(" ");
        year = Number(yearStr);
        quarter = quarterStr ?? null;
      }

      return {
        period: item.PERIOD ?? null,
        year,
        quarter,

        country_iso_code_3: item.COUNTRY_ISO_CODE_3 ?? null,
        segment: item.SEGMENT ?? null,
        unit_of_measure: item.UNIT_OF_MEASURE ?? null,
        comp_unit_of_measure: item.COMP_UNIT_OF_MEASURE ?? null,

        ac: item.AC ?? null,
        variation_direction_ac: variationDirectionAc,

        ac_vs_ly: item.AC_VS_LY ?? null,
        variation_direction_ly: variationDirectionVsLy,
      };
    });
  }
}

export const performanceToolByOverTimeTrendsHandler =
  new PerformanceToolByOverTimeTrendsHandler();

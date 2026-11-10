import { formatMonth } from "@common/utils/month.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

/**
 * Value Creation - Breakdowns - Category Chart Handler
 * Maps the raw UPPER_CASE columns returned by Drupal statements
 * `owr_value-creation_breakdown_category-view_{segments,portfolio}_volume-only_st`
 * (volume-only chart queries) to the snake_case contract consumed by the BFF
 * JSONata formatter.
 *
 * AS-IS migration: preserves the Drupal production output including
 * `NAB` price tier label (no client-side rewrite).
 */
class BreakdownsCategoryChartHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const refreshMonthLabel = formatMonth(item.DT_END as string, {
        includeYear: true,
        yearFormat: "short",
      });

      const lyMonthLabel = formatMonth(item.DT_END as string, {
        includeYear: true,
        yearFormat: "short",
        usePreviousYear: true,
      });

      const segment = item.SEGMENT ?? item.PRICE_TIER;

      return {
        period_type: item.PERIOD_TYPE,
        dt_ini: item.DT_INI,
        dt_end: item.DT_END,
        segment: segment,
        price_tier: item.PRICE_TIER,
        zone: item.ABI_ZONE,
        country: item.COUNTRY_ISO_CODE_3,
        version_id: item.VERSION_ID,
        kpi_name: item.KPI_NAME,
        value: item.OG_VS_LY,
        ac: item.AC,
        ly: item.LY,
        order_value: item.ORDER_VALUE,
        current_month_label: refreshMonthLabel,
        ly_month_label: lyMonthLabel,
      };
    });
  }
}

export const breakdownsCategoryChartHandler =
  new BreakdownsCategoryChartHandler();

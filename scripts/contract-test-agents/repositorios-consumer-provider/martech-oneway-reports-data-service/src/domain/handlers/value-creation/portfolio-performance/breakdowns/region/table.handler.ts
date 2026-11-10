import { formatDirection } from "@common/utils/direction.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

/**
 * Value Creation - Breakdowns - Region Table Handler
 * Maps the raw UPPER_CASE columns returned by Drupal statement
 * `owr_value-creation_breakdown_region-view_st` to the snake_case contract
 * consumed by the BFF JSONata formatter.
 */
class RegionTableHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const variationDirectionAcVsLy = formatDirection(Number(item.AC_VS_LY));
      const variationDirectionOgVsLy = formatDirection(Number(item.OG_VS_LY));

      return {
        period_type: item.PERIOD_TYPE,
        dt_ini: item.DT_INI,
        dt_end: item.DT_END,
        zone: item.ABI_ZONE,
        country: item.COUNTRY_ISO_CODE_3,
        version_id: item.VERSION_ID,
        kpi_name: item.KPI_NAME,
        og_vs_ly: item.OG_VS_LY,
        comp_og_vs_ly_direction: variationDirectionOgVsLy,
        ac: item.AC,
        ac_vs_ly: item.AC_VS_LY,
        comp_ac_vs_ly_direction: variationDirectionAcVsLy,
        ly: item.LY,
        order_value: item.ORDER_VALUE,
        index_value: item.INDEX_VALUE,
      };
    });
  }
}

export const regionTableHandler = new RegionTableHandler();

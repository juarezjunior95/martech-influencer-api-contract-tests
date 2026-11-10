import { formatDirection } from "@common/utils/direction.utils";
import { formatMonth } from "@common/utils/month.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

class RegionHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const type = this.getValue(item, "type", "TYPE");
      const typeOrder = this.getValue(item, "type_order", "TYPE_ORDER");
      const region = this.getValue(item, "region", "REGION");
      const countryName = this.getValue(item, "country_name", "COUNTRY_NAME");
      const dtEnd = this.getValue(item, "dt_end", "DT_END");
      const acVsLy = this.getValue(item, "ac_vs_ly", "AC_VS_LY");
      const delta = this.getValue(item, "delta", "DELTA", "og_vs_ly");

      return {
        type,
        type_order: typeOrder,
        period_type: this.getValue(item, "period_type", "PERIOD_TYPE"),
        dt_ini: this.getValue(item, "dt_ini", "DT_INI"),
        dt_end: dtEnd,
        region,
        country: region,
        country_name: countryName,
        kpi_name: type === "VOLUME ONLY" ? "volume" : type,
        ac: this.getValue(item, "ac", "AC"),
        ly: this.getValue(item, "ly", "LY"),
        ac_vs_ly: acVsLy,
        comp_ac_vs_ly_direction: this.getDirection(
          item,
          acVsLy,
          "variationDirectionVsLy",
        ),
        og_vs_ly: delta,
        value: delta,
        comp_og_vs_ly_direction: this.getDirection(
          item,
          delta,
          "variationDirectionDelta",
        ),
        kpi_ac_per_hl: this.getValue(item, "kpi_ac_per_hl", "KPI_AC_PER_HL"),
        kpi_og_ly_per_hl: this.getValue(
          item,
          "kpi_og_ly_per_hl",
          "KPI_OG_LY_PER_HL",
        ),
        weight: this.getValue(item, "weight", "WEIGHT"),
        index: this.getValue(
          item,
          "index_value",
          "INDEX_VALUE",
          "index",
          "INDEX",
        ),
        rank: this.getValue(item, "rnk", "RNK", "rank", "RANK"),
        current_month_label:
          this.getValue(item, "refreshMonthLabel") ??
          this.formatMonthLabel(dtEnd),
        ly_month_label:
          this.getValue(item, "lyMonthLabel") ??
          this.formatMonthLabel(dtEnd, true),
      };
    });
  }

  private getValue(item: DataItem, ...keys: string[]) {
    for (const key of keys) {
      if (item[key] !== undefined) {
        return item[key];
      }
    }

    return null;
  }

  private getDirection(item: DataItem, value: unknown, computedKey: string) {
    const computedDirection = this.getValue(item, computedKey);

    if (computedDirection !== null) {
      return computedDirection;
    }

    return formatDirection(Number(value));
  }

  private formatMonthLabel(value: unknown, usePreviousYear = false) {
    if (!value) {
      return null;
    }

    return formatMonth(String(value), {
      includeYear: true,
      yearFormat: "short",
      usePreviousYear,
    });
  }
}

export const regionHandler = new RegionHandler();

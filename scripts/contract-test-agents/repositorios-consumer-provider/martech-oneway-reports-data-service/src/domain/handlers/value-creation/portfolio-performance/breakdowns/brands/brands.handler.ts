import { formatDirection } from "@common/utils/direction.utils";
import { formatMonth } from "@common/utils/month.utils";
import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";

class BreakdownsBrandsHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset || !defaultDataset.data) {
      return [];
    }

    return defaultDataset.data.map((item) => {
      const type = this.getValue(item, "TYPE", "type");
      const typeOrder = this.getValue(item, "TYPE_ORDER", "type_order");
      const rawBrand = this.getValue(item, "RAW_BRAND", "raw_brand");
      const portfolio = this.getValue(item, "PORTFOLIO", "portfolio");
      const dtEnd = this.getValue(item, "DT_END", "dt_end");
      const acVsLy = this.getValue(item, "AC_VS_LY", "ac_vs_ly");
      const delta = this.getValue(item, "DELTA", "delta", "OG_VS_LY");

      return {
        type,
        type_order: typeOrder,
        period_type: this.getValue(item, "PERIOD_TYPE", "period_type"),
        dt_ini: this.getValue(item, "DT_INI", "dt_ini"),
        dt_end: dtEnd,
        raw_brand: rawBrand,
        brand: rawBrand,
        portfolio,
        segment: portfolio,
        kpi_name: type === "VOLUME ONLY" ? "volume" : type,
        ac: this.getValue(item, "AC", "ac"),
        ly: this.getValue(item, "LY", "ly"),
        ac_vs_ly: acVsLy,
        comp_ac_vs_ly_direction: formatDirection(Number(acVsLy)),
        og_vs_ly: delta,
        value: delta,
        comp_og_vs_ly_direction: formatDirection(Number(delta)),
        kpi_ac_per_hl: this.getValue(item, "KPI_AC_PER_HL", "kpi_ac_per_hl"),
        kpi_og_ly_per_hl: this.getValue(
          item,
          "KPI_OG_LY_PER_HL",
          "kpi_og_ly_per_hl",
        ),
        weight: this.getValue(item, "WEIGHT", "weight"),
        index: this.getValue(
          item,
          "INDEX_VALUE",
          "index_value",
          "INDEX",
          "index",
        ),
        rank: this.getValue(item, "RNK", "rnk", "RANK", "rank"),
        current_month_label: this.formatMonthLabel(dtEnd),
        ly_month_label: this.formatMonthLabel(dtEnd, true),
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

export const breakdownsBrandsHandler = new BreakdownsBrandsHandler();

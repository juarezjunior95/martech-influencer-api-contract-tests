import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
import {
  hasInvalidOvertimeKpiRows,
  normalizeMonth,
  pickField,
  toNumber,
  variationDirection,
} from "@domain/handlers/innovation/innovation-hub/performance-breakdown/overtime-performance.utils";

/**
 * Innovation Hub - Performance & Breakdown - Overtime Line Chart Handler
 * Maps lake rows from owr_innovation_performance_breakdown_overtime_line_chart_fn
 * to the snake_case contract consumed by the BFF formatter.
 */
class OvertimeLineChartHandler extends BaseHandler {
  async handle(
    _datasets: Dataset[],
    defaultDataset?: Dataset,
  ): Promise<DataItem[]> {
    if (!defaultDataset?.data?.length) {
      return [];
    }

    if (hasInvalidOvertimeKpiRows(defaultDataset.data)) {
      return [];
    }

    const mappedRows = defaultDataset.data
      .map((item) => this.mapRow(item as Record<string, unknown>))
      .filter((row) => row.month !== undefined);

    if (mappedRows.length === 0) {
      return [];
    }

    return mappedRows.sort(
      (firstRow, secondRow) => Number(firstRow.month) - Number(secondRow.month),
    );
  }

  private mapRow(record: Record<string, unknown>): DataItem {
    const ac = toNumber(pickField(record, "ac", "AC"));
    const acLy = toNumber(pickField(record, "ac_ly", "AC_LY"));
    const bu = toNumber(pickField(record, "bu", "BU"));
    const le = toNumber(pickField(record, "le", "LE"));
    const acVsBu = toNumber(pickField(record, "ac_vs_bu", "AC_VS_BU"));
    const acVsLy = toNumber(pickField(record, "ac_vs_ly", "AC_VS_LY"));

    return {
      kpi_name: pickField(record, "kpi_name", "KPI_NAME") as string | undefined,
      month: normalizeMonth(pickField(record, "month", "MONTH")),
      country: pickField(
        record,
        "country_iso_code_3",
        "COUNTRY_ISO_CODE_3",
        "country",
        "COUNTRY",
      ) as string | undefined,
      ac,
      ac_ly: acLy,
      bu,
      le,
      ac_vs_bu: acVsBu,
      ac_vs_ly: acVsLy,
      comp_unit_of_measure: pickField(
        record,
        "comp_unit_of_measure",
        "COMP_UNIT_OF_MEASURE",
      ) as string | undefined,
      variation_direction_vs_bu: variationDirection(acVsBu),
      variation_direction_vs_ly: variationDirection(acVsLy),
    };
  }
}

export const overtimeLineChartHandler = new OvertimeLineChartHandler();

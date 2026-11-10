import { Dataset, DataItem } from "@domain/entities/datasource.entity";
import { BaseHandler } from "@domain/handlers/handler.base";
import {
  hasInvalidOvertimeKpiRows,
  pickField,
  toNumber,
  variationDirection,
} from "@domain/handlers/innovation/innovation-hub/performance-breakdown/overtime-performance.utils";

/**
 * Innovation Hub - Performance & Breakdown - Overtime Bar Chart Handler
 * Maps lake rows from owr_innovation_performance_breakdown_overtime_bar_chart_fn
 * to the snake_case contract consumed by the BFF formatter.
 */
class OvertimeBarChartHandler extends BaseHandler {
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
      .filter((row) => row.bar_order !== undefined);

    if (mappedRows.length === 0) {
      return [];
    }

    return mappedRows.sort(
      (firstRow, secondRow) =>
        Number(firstRow.bar_order) - Number(secondRow.bar_order),
    );
  }

  private mapRow(record: Record<string, unknown>): DataItem {
    const metricValue = toNumber(
      pickField(record, "metric_value", "METRIC_VALUE"),
    );
    const vsBu = toNumber(pickField(record, "vs_bu", "VS_BU"));
    const vsLy = toNumber(pickField(record, "vs_ly", "VS_LY"));

    return {
      kpi_name: pickField(record, "kpi_name", "KPI_NAME") as string | undefined,
      bar_order: toNumber(pickField(record, "bar_order", "BAR_ORDER")),
      period_label: pickField(record, "period_label", "PERIOD_LABEL") as
        | string
        | undefined,
      country: pickField(
        record,
        "country_iso_code_3",
        "COUNTRY_ISO_CODE_3",
        "country",
        "COUNTRY",
      ) as string | undefined,
      metric_value: metricValue,
      vs_bu: vsBu,
      vs_ly: vsLy,
      comp_unit_of_measure: pickField(
        record,
        "comp_unit_of_measure",
        "COMP_UNIT_OF_MEASURE",
      ) as string | undefined,
      variation_direction_vs_bu: variationDirection(vsBu),
      variation_direction_vs_ly: variationDirection(vsLy),
    };
  }
}

export const overtimeBarChartHandler = new OvertimeBarChartHandler();

import overtimeLineChart from "@domain/config/datasources/innovation/innovation-hub/performance-breakdown/overtime-line-chart.datasource";
import {
  INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_LINE_CHART_DATASET_ID,
  INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_LINE_CHART_SP_NAME,
} from "@domain/config/datasources/innovation/innovation-hub/performance-breakdown/overtime-line-chart.datasource";
import { overtimeLineChartHandler } from "@domain/handlers/innovation/innovation-hub/performance-breakdown/overtime-line-chart.handler";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("InnovationHubPerformanceBreakdownOvertimeLineChart datasource config", () => {
  const config: DatasourceConfig = overtimeLineChart;

  it("should define a single overtime-line-chart dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(
      INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_LINE_CHART_DATASET_ID,
    );
  });

  it("should call owr_result_query_sp with the overtime line chart function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      INNOVATION_HUB_PERFORMANCE_BREAKDOWN_OVERTIME_LINE_CHART_SP_NAME,
    );
  });

  it("should require kpi, country and dt_end filters", () => {
    expect(config.filters?.map((filter) => filter.name)).toEqual([
      "kpi",
      "country",
      "dt_end",
    ]);
    expect(config.filters?.every((filter) => filter.required)).toBe(true);
  });

  it("should use the overtime line chart handler", () => {
    expect(config.handler).toBe(overtimeLineChartHandler);
  });

  it("should use deltalake procedure execution", () => {
    expect(config.datasets[0].config.type).toBe(RepositoryType.deltalake);
    expect(config.datasets[0].config.executionType).toBe(
      DeltalakeExecutionType.procedure,
    );
  });

  it("should forward all request parameters in the procedure JSON payload", () => {
    const procedure = config.datasets[0].config.procedure ?? "";

    expect(procedure).toContain('"kpi": :kpi');
    expect(procedure).toContain('"country": :country');
    expect(procedure).toContain('"dt_end": :dt_end');
  });
});

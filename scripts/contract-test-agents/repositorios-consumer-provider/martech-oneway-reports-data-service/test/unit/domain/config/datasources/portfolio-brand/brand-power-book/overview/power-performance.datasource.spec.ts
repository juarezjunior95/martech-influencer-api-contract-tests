import powerPerformance from "@domain/config/datasources/portfolio-brand/brand-power-book/overview/power-performance.datasource";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

const expectedFilters = [
  { name: "dt_end", required: true },
  { name: "visual", required: true },
  { name: "period_type", required: false },
  { name: "viewtype", required: false },
  { name: "page_filter", required: false },
  { name: "country", required: false },
];

describe("Brand Power Book power-performance datasource", () => {
  const datasetConfig = powerPerformance.datasets[0].config;

  it("should expose dataset and filter definitions", () => {
    expect(powerPerformance.datasets).toHaveLength(1);
    expect(powerPerformance.datasets[0].id).toBe("power_performance");
    expect(powerPerformance.filters).toEqual(expectedFilters);
    expect(powerPerformance.entityClass).toBe(KpiEntity);
    expect(powerPerformance.handler).toBeUndefined();
  });

  it("should execute the stored procedure with the right metadata", () => {
    expect(datasetConfig.executionType).toBe(DeltalakeExecutionType.procedure);
    expect(datasetConfig.type).toBe(RepositoryType.deltalake);
    expect(datasetConfig.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(datasetConfig.procedure).toContain(
      "3_portfolio_brand_power-book_overview_performance-breakdown",
    );
    expectedFilters.forEach((filter) => {
      expect(datasetConfig.procedure).toContain(`:${filter.name}`);
    });
  });
});

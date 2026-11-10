import byGranularity from "@domain/config/datasources/value-creation/performance-tool/drill-down/non-finance/overtime-trends/by-granularity.datasource";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import { performanceToolByOverTimeTrendsHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/non-finance/overtime-trends/overtime-trends.handler";

const FILTER_NAMES = [
  "viewtype",
  "page_filter",
  "brand",
  "country",
  "region",
  "dt_end",
] as const;

describe("BrandPowerLineChart overtime-trends by-granularity datasource config", () => {
  const config: DatasourceConfig = byGranularity;

  it("should define a single by-granularity dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(
      "non-finance-overtime-trends-by-granularity",
    );
  });

  it("should call owr_result_query_sp with the brand-power line-chart function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      "7_value_creation_brand-power_line-chart",
    );
  });

  it("should contain all required inline parameter markers in the procedure", () => {
    FILTER_NAMES.forEach((name) => {
      expect(config.datasets[0].config.procedure).toContain(`:${name}`);
    });
    expect(config.datasets[0].config.parameters).toBeUndefined();
  });

  it("should require viewtype, page_filter, brand, country, region and dt_end filters", () => {
    expect(config.filters?.map((filter) => filter.name)).toEqual([
      ...FILTER_NAMES,
    ]);
    expect(config.filters?.every((filter) => filter.required)).toBe(true);
  });

  it("should use performanceToolByOverTimeTrendsHandler without KpiEntity", () => {
    expect(config.handler).toBe(performanceToolByOverTimeTrendsHandler);
    expect(config.entityClass).toBeUndefined();
  });

  it("should use deltalake procedure execution", () => {
    expect(config.datasets[0].config.type).toBe(RepositoryType.deltalake);
    expect(config.datasets[0].config.executionType).toBe(
      DeltalakeExecutionType.procedure,
    );
  });

  it("should have version 1.0.0", () => {
    expect(config.version).toBe("1.0.0");
  });
});

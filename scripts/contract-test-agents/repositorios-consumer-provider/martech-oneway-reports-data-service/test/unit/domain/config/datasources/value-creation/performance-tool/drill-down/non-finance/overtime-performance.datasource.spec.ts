import overtimePerformance from "@domain/config/datasources/value-creation/performance-tool/drill-down/non-finance/overtime-performance.datasource";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import { overtimePerformanceHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/non-finance/overtime-performance.handler";

const FILTER_NAMES = [
  "viewtype",
  "page_filter",
  "brand",
  "country",
  "region",
  "dt_end",
] as const;

describe("BrandPowerBigNumbers overtime-performance datasource config", () => {
  const config: DatasourceConfig = overtimePerformance;

  it("should define a single big-numbers dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe("big-numbers-st");
  });

  it("should call owr_result_query_sp with the brand-power big-numbers function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      "7_value_creation_brand-power_big-numbers",
    );
  });

  it("should contain all required inline parameter markers in the procedure", () => {
    FILTER_NAMES.forEach((name) => {
      expect(config.datasets[0].config.procedure).toContain(`:${name}`);
    });
    expect(config.datasets[0].config.parameters).toBeUndefined();
  });

  it("should declare viewtype, page_filter, brand, country, region and dt_end filters", () => {
    expect(config.filters?.map((filter) => filter.name)).toEqual([
      ...FILTER_NAMES,
    ]);
  });

  it("should require viewtype, page_filter, brand, country and dt_end filters", () => {
    const requiredFilters = config.filters?.filter((filter) => filter.required);

    expect(requiredFilters?.map((filter) => filter.name)).toEqual([
      "viewtype",
      "page_filter",
      "brand",
      "country",
      "dt_end",
    ]);
  });

  it("should treat region as optional", () => {
    const regionFilter = config.filters?.find(
      (filter) => filter.name === "region",
    );

    expect(regionFilter?.required).toBe(false);
  });

  it("should use overtimePerformanceHandler without KpiEntity", () => {
    expect(config.handler).toBe(overtimePerformanceHandler);
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

import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import {
  PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_DATASET_ID,
  PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_SP_NAME,
} from "@domain/config/presets/performance-tool/performance-tool.types";

describe("PerformanceToolMarketShareUpdateStatus datasource config", () => {
  let config: DatasourceConfig;

  beforeAll(async () => {
    const module =
      await import("@domain/config/datasources/value-creation/performance-tool/drill-down/non-finance/market-share/update-status.datasource");
    config = module.default;
  });

  it("should have at least one dataset defined", () => {
    expect(config.datasets).toBeDefined();
    expect(Array.isArray(config.datasets)).toBe(true);
    expect(config.datasets.length).toBeGreaterThan(0);
  });

  it("should use deltalake repository type with procedure execution", () => {
    config.datasets.forEach((dataset) => {
      expect(dataset.config.type).toBe(RepositoryType.deltalake);
      expect(dataset.config.executionType).toBe(
        DeltalakeExecutionType.procedure,
      );
    });
  });

  it("should call owr_result_query_sp with the market-share update-status function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_SP_NAME,
    );
  });

  it("should use KpiEntity as entityClass", () => {
    expect(config.entityClass).toBe(KpiEntity);
  });

  it("should not require request filters", () => {
    expect(config.filters).toBeUndefined();
  });

  it("should call the stored procedure without dynamic filter parameters", () => {
    const procedure = config.datasets[0].config.procedure ?? "";

    expect(procedure).not.toContain(":country");
    expect(procedure).not.toContain(":dt_end");
    expect(procedure).not.toContain(":period_type");
    expect(procedure).not.toContain(":viewtype");
    expect(procedure).not.toContain(":page_filter");
  });

  it("should have the expected dataset id", () => {
    expect(config.datasets[0].id).toBe(
      PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_DATASET_ID,
    );
  });

  it("should not define a handler", () => {
    expect(config.handler).toBeUndefined();
  });
});

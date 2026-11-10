import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import {
  PERFORMANCE_TOOL_BASE_FILTER_NAMES,
  PERFORMANCE_TOOL_MARKET_SHARE_OFFICIAL_BIG_NUMBERS_DATASET_ID,
  PERFORMANCE_TOOL_MARKET_SHARE_OFFICIAL_BIG_NUMBERS_SP_NAME,
  PERFORMANCE_TOOL_MARKET_SHARE_EXTRA_FILTER_NAMES,
} from "@domain/config/presets/performance-tool/performance-tool.types";

const EXPECTED_FILTER_NAMES = [
  ...PERFORMANCE_TOOL_BASE_FILTER_NAMES,
  ...PERFORMANCE_TOOL_MARKET_SHARE_EXTRA_FILTER_NAMES,
];

describe("PerformanceToolMarketShareBigNumbers datasource config", () => {
  let config: DatasourceConfig;

  beforeAll(async () => {
    const module =
      await import("@domain/config/datasources/value-creation/performance-tool/drill-down/non-finance/market-share/big-numbers.datasource");
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

  it("should call owr_result_query_sp with the market-share big-numbers function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      PERFORMANCE_TOOL_MARKET_SHARE_OFFICIAL_BIG_NUMBERS_SP_NAME,
    );
  });

  it("should use KpiEntity as entityClass", () => {
    expect(config.entityClass).toBe(KpiEntity);
  });

  it("should expose filters aligned with the market-share line-chart preset", () => {
    expect(config.filters).toBeDefined();
    const requiredFilters = config.filters?.filter((f) => f.required) ?? [];
    const requiredFilterNames = requiredFilters.map((f) => f.name);

    expect(requiredFilters).toHaveLength(EXPECTED_FILTER_NAMES.length);
    expect(requiredFilterNames).toEqual([...EXPECTED_FILTER_NAMES]);
    expect(requiredFilterNames).toContain("dt_end");
    expect(requiredFilterNames).toContain("period_type");
    expect(requiredFilterNames).toContain("weight_type");
  });

  it("should have the expected dataset id", () => {
    expect(config.datasets[0].id).toBe(
      PERFORMANCE_TOOL_MARKET_SHARE_OFFICIAL_BIG_NUMBERS_DATASET_ID,
    );
  });

  it("should not define a handler", () => {
    expect(config.handler).toBeUndefined();
  });
});

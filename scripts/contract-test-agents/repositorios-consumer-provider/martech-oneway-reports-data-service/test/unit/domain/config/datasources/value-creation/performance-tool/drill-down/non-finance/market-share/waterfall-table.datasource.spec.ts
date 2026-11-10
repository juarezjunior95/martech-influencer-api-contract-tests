import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { marketShareWaterfallTableHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/non-finance/market-share/waterfall-table.handler";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import {
  PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_DATASET_ID,
  PERFORMANCE_TOOL_MARKET_SHARE_BIG_NUMBERS_FILTER_NAMES,
  PERFORMANCE_TOOL_WATERFALL_EXTRA_FILTER_NAMES,
  PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_SP_NAME,
} from "@domain/config/presets/performance-tool/performance-tool.types";

describe("PerformanceToolMarketShareWaterfall datasource config", () => {
  let config: DatasourceConfig;

  beforeAll(async () => {
    const module =
      await import("@domain/config/datasources/value-creation/performance-tool/drill-down/non-finance/market-share/waterfall-table.datasource");
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

  it("should call owr_result_query_sp with the market-share waterfall function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_SP_NAME,
    );
  });

  it("should run the handler before KpiEntity enrichment", () => {
    expect(config.handler).toBe(marketShareWaterfallTableHandler);
    expect(config.entityClass).toBe(KpiEntity);
    expect(config.entityClassAfterHandler).toBe(true);
  });

  it("should expose filters aligned with market-share waterfall preset", () => {
    expect(config.filters).toBeDefined();
    const requiredFilters = config.filters?.filter((f) => f.required) ?? [];
    const requiredFilterNames = requiredFilters.map((f) => f.name);

    const expectedFilterCount =
      PERFORMANCE_TOOL_MARKET_SHARE_BIG_NUMBERS_FILTER_NAMES.length +
      PERFORMANCE_TOOL_WATERFALL_EXTRA_FILTER_NAMES.length;

    expect(requiredFilters).toHaveLength(expectedFilterCount);
    expect(requiredFilterNames).toContain("dt_end");
    expect(requiredFilterNames).toContain("country");
    expect(requiredFilterNames).toContain("period_type");
    expect(requiredFilterNames).toContain("page_filter");
    expect(requiredFilterNames).toContain("max_ranked");
    expect(requiredFilterNames).toContain("weight_bu");
  });

  it("should have the expected dataset id", () => {
    expect(config.datasets[0].id).toBe(
      PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_DATASET_ID,
    );
  });
});

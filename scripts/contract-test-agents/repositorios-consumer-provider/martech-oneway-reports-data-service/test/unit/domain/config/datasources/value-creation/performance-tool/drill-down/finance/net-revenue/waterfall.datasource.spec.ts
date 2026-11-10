import { waterfallHandler } from "@domain/handlers/value-creation/performance-tool/drill-down/finance/net-revenue/waterfall.handler";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import {
  PERFORMANCE_TOOL_FINANCE_FILTER_NAMES,
  PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_DATASET_ID,
  PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_SP_NAME,
  PERFORMANCE_TOOL_VOLUME_WATERFALL_DATASET_ID,
  PERFORMANCE_TOOL_VOLUME_WATERFALL_SP_NAME,
  PERFORMANCE_TOOL_WATERFALL_EXTRA_FILTER_NAMES,
} from "@domain/config/presets/performance-tool/performance-tool.types";
import config from "@domain/config/datasources/value-creation/performance-tool/drill-down/finance/net-revenue/waterfall.datasource";

describe("Performance Tool Net Revenue waterfall datasource config", () => {
  it("uses the dedicated Net Revenue waterfall function and dataset", () => {
    expect(PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_SP_NAME).toBe(
      "7_value_creation_performance-tool_net-revenue_waterfall",
    );
    expect(PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_SP_NAME).not.toBe(
      PERFORMANCE_TOOL_VOLUME_WATERFALL_SP_NAME,
    );
    expect(PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_DATASET_ID).toBe(
      "performance_tool_finance_nr_waterfall",
    );
    expect(PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_DATASET_ID).not.toBe(
      PERFORMANCE_TOOL_VOLUME_WATERFALL_DATASET_ID,
    );

    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(
      PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_DATASET_ID,
    );
    expect(config.datasets[0].config).toMatchObject({
      type: RepositoryType.deltalake,
      executionType: DeltalakeExecutionType.procedure,
    });
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_SP_NAME,
    );
  });

  it("keeps KpiEntity enrichment and the NR compatibility handler", () => {
    expect(config.entityClass).toBe(KpiEntity);
    expect(config.handler).toBe(waterfallHandler);
  });

  it("composes the shared finance and waterfall filter contracts", () => {
    const expectedFilterNames = [
      ...PERFORMANCE_TOOL_FINANCE_FILTER_NAMES,
      ...PERFORMANCE_TOOL_WATERFALL_EXTRA_FILTER_NAMES,
    ];

    expect(config.filters).toEqual(
      expectedFilterNames.map((name) => ({ name, required: true })),
    );

    for (const filterName of expectedFilterNames) {
      expect(config.datasets[0].config.procedure).toContain(
        `"${filterName}": :${filterName}`,
      );
    }
  });
});

import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import {
  PERFORMANCE_TOOL_CORES_BIG_NUMBERS_SP_NAME,
  PERFORMANCE_TOOL_FINANCE_BIG_NUMBERS_DATASET_ID,
  PERFORMANCE_TOOL_FINANCE_FILTER_NAMES,
} from "@domain/config/presets/performance-tool/performance-tool.types";

describe("PerformanceToolCoresOvertimePerformance datasource config", () => {
  let config: DatasourceConfig;

  beforeAll(async () => {
    const module =
      await import("@domain/config/datasources/value-creation/performance-tool/drill-down/finance/cores/overtime-performance.datasource");
    config = module.default;
  });

  it("calls the shared finance big-numbers function through owr_result_query_sp", () => {
    const dataset = config.datasets[0];

    expect(dataset.id).toBe(PERFORMANCE_TOOL_FINANCE_BIG_NUMBERS_DATASET_ID);
    expect(dataset.config.type).toBe(RepositoryType.deltalake);
    expect(dataset.config.executionType).toBe(DeltalakeExecutionType.procedure);
    expect(dataset.config.query).toBeUndefined();
    expect(dataset.config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(dataset.config.procedure).toContain(
      PERFORMANCE_TOOL_CORES_BIG_NUMBERS_SP_NAME,
    );
  });

  it("uses the shared finance filter contract without duplicates", () => {
    const requiredFilterNames = (config.filters ?? [])
      .filter((filter) => filter.required)
      .map((filter) => filter.name);

    expect(requiredFilterNames).toEqual([
      ...PERFORMANCE_TOOL_FINANCE_FILTER_NAMES,
    ]);
    expect(new Set(requiredFilterNames).size).toBe(requiredFilterNames.length);
    expect(requiredFilterNames).toEqual(
      expect.arrayContaining(["kpi", "period_type", "dt_end"]),
    );
  });

  it("forwards every declared filter to the procedure payload", () => {
    const procedure = config.datasets[0].config.procedure ?? "";

    for (const filterName of PERFORMANCE_TOOL_FINANCE_FILTER_NAMES) {
      expect(procedure).toContain(`"${filterName}": :${filterName}`);
    }
  });

  it("uses KpiEntity and does not define a handler", () => {
    expect(config.version).toBe("1.0.0");
    expect(config.entityClass).toBe(KpiEntity);
    expect(config.handler).toBeUndefined();
  });
});

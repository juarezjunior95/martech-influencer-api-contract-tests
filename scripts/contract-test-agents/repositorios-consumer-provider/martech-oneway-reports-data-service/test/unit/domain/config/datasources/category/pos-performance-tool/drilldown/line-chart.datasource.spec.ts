import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

const EXPECTED_FILTER_NAMES = [
  "country",
  "category",
  "timeframe",
  "dt_end",
  "kpi",
  "manufacturer",
  "brand",
  "brand_segments",
  "region",
  "cohort",
];

const LINE_CHART_SP_NAME = "1_category_pos-tool_drill-down_line-chart";
const LINE_CHART_DATASET_ID = "owr_category_pos_tool_drill_down_line_chart_fn";

describe("PosPerformanceToolDrilldownLineChart datasource config", () => {
  let config: DatasourceConfig;

  beforeAll(async () => {
    const module =
      await import("@domain/config/datasources/category/pos-performance-tool/drilldown/line-chart.datasource");
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

  it("should call owr_result_query_sp with the line-chart function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(LINE_CHART_SP_NAME);
  });

  it("should use KpiEntity as entityClass", () => {
    expect(config.entityClass).toBe(KpiEntity);
  });

  it("should expose required filters matching the SP payload", () => {
    expect(config.filters).toBeDefined();
    const requiredFilters = config.filters?.filter((f) => f.required) ?? [];
    const requiredFilterNames = requiredFilters.map((f) => f.name);

    expect(requiredFilters).toHaveLength(EXPECTED_FILTER_NAMES.length);
    expect(requiredFilterNames).toEqual(EXPECTED_FILTER_NAMES);
    expect(requiredFilterNames).toContain("kpi");
    expect(requiredFilterNames).toContain("brand_segments");
  });

  it("should have dataset id following naming convention", () => {
    const datasetIdPattern = /^[a-z][a-z0-9_]*$/;

    config.datasets.forEach((dataset) => {
      expect(dataset.id).toMatch(datasetIdPattern);
    });
    expect(config.datasets[0].id).toBe(LINE_CHART_DATASET_ID);
  });

  it("should not define a handler", () => {
    expect(config.handler).toBeUndefined();
  });
});

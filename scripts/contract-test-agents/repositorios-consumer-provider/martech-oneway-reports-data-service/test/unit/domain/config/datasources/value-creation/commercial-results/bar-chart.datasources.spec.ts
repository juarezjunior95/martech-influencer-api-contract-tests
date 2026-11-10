import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import {
  COMMERCIAL_RESULTS_COMMON_FILTER_NAMES,
  COMMERCIAL_RESULTS_VOLUME_BAR_CHART_DATASET_ID,
  COMMERCIAL_RESULTS_VOLUME_BAR_CHART_SP_NAME,
} from "@domain/config/presets/commercial-results/commercial-results.types";

describe("CommercialResultsBarChart datasource config", () => {
  let config: DatasourceConfig;

  beforeAll(async () => {
    const module =
      await import("@domain/config/datasources/value-creation/commercial-results/bar-chart.datasource");
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

  it("should call owr_result_query_sp with the bar-chart function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      COMMERCIAL_RESULTS_VOLUME_BAR_CHART_SP_NAME,
    );
  });

  it("should use KpiEntity as entityClass", () => {
    expect(config.entityClass).toBe(KpiEntity);
  });

  it("should contain all required inline parameter markers in the procedure", () => {
    COMMERCIAL_RESULTS_COMMON_FILTER_NAMES.forEach((name) => {
      expect(config.datasets[0].config.procedure).toContain(`:${name}`);
    });
    expect(config.datasets[0].config.parameters).toBeUndefined();
  });

  it("should expose filters aligned with the commercial-results preset", () => {
    expect(config.filters).toBeDefined();
    const requiredFilters = config.filters?.filter((f) => f.required) ?? [];
    const requiredFilterNames = requiredFilters.map((f) => f.name);

    expect(requiredFilters).toHaveLength(
      COMMERCIAL_RESULTS_COMMON_FILTER_NAMES.length,
    );
    expect(requiredFilterNames).toEqual([
      ...COMMERCIAL_RESULTS_COMMON_FILTER_NAMES,
    ]);
    expect(requiredFilterNames).toContain("zone");
    expect(requiredFilterNames).toContain("dt_end");
    expect(requiredFilterNames).toContain("country");
  });

  it("should have dataset id following naming convention", () => {
    const datasetIdPattern = /^[a-z][a-z0-9-]*$/;

    config.datasets.forEach((dataset) => {
      expect(dataset.id).toMatch(datasetIdPattern);
    });
    expect(config.datasets[0].id).toBe(
      COMMERCIAL_RESULTS_VOLUME_BAR_CHART_DATASET_ID,
    );
  });

  it("should not define a handler", () => {
    expect(config.handler).toBeUndefined();
  });
});

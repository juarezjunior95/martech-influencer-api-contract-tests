import overtimePerformance from "@domain/config/datasources/innovation/home/overtime-performance.datasource";
import {
  INNOVATION_HOME_OVERTIME_PERFORMANCE_DATASET_ID,
  INNOVATION_HOME_OVERTIME_PERFORMANCE_SP_NAME,
} from "@domain/config/datasources/innovation/home/overtime-performance.datasource";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("InnovationHomeOvertimePerformance datasource config", () => {
  const config: DatasourceConfig = overtimePerformance;

  it("should define a single overtime-performance dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(
      INNOVATION_HOME_OVERTIME_PERFORMANCE_DATASET_ID,
    );
  });

  it("should call owr_result_query_sp with the overtime-performance function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      INNOVATION_HOME_OVERTIME_PERFORMANCE_SP_NAME,
    );
  });

  it("should require viewtype, country and dt_end filters", () => {
    expect(config.filters?.map((filter) => filter.name)).toEqual([
      "viewtype",
      "country",
      "dt_end",
    ]);
    expect(config.filters?.every((filter) => filter.required)).toBe(true);
  });

  it("should use KpiEntity without a custom handler", () => {
    expect(config.entityClass).toBe(KpiEntity);
    expect(config.handler).toBeUndefined();
  });

  it("should use deltalake procedure execution", () => {
    expect(config.datasets[0].config.type).toBe(RepositoryType.deltalake);
    expect(config.datasets[0].config.executionType).toBe(
      DeltalakeExecutionType.procedure,
    );
  });
});

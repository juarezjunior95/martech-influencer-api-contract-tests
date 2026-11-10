import superLeague from "@domain/config/datasources/value-creation/growth-league/rankings/super-league.datasource";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

describe("GrowthLeague rankings super-league datasource config", () => {
  const config: DatasourceConfig = superLeague;

  it("should define a single super-league dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe("super-league");
  });

  it("should call owr_result_query_sp with the ranking-breakdown function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      "7_value_creation_growth-league_ranking-breakdown_breakdown",
    );
  });

  it("should inline the dt_end marker and the super league static param", () => {
    expect(config.datasets[0].config.procedure).toContain(":dt_end");
    expect(config.datasets[0].config.procedure).toContain('"league": "super"');
    expect(config.datasets[0].config.parameters).toBeUndefined();
  });

  it("should require only the dt_end filter", () => {
    expect(config.filters?.map((filter) => filter.name)).toEqual(["dt_end"]);
    expect(config.filters?.every((filter) => filter.required)).toBe(true);
  });

  it("should use KpiEntity without a handler", () => {
    expect(config.entityClass).toBe(KpiEntity);
    expect(config.handler).toBeUndefined();
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

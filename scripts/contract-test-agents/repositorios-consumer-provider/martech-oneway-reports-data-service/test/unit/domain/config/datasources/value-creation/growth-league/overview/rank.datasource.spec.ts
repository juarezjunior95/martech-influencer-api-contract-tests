import rank from "@domain/config/datasources/value-creation/growth-league/overview/rank.datasource";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import { KpiEntity } from "@domain/entities/kpi.entity";

describe("GrowthLeague overview rank datasource config", () => {
  const config: DatasourceConfig = rank;

  it("should define a single rank dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe("rank");
  });

  it("should call owr_result_query_sp with the leaderboard function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      "7_value_creation_growth-league_overview_leaderboard",
    );
  });

  it("should inline the dt_end marker without a league param", () => {
    expect(config.datasets[0].config.procedure).toContain(":dt_end");
    expect(config.datasets[0].config.procedure).not.toContain('"league"');
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
});

import portfolioBigNumbers from "@domain/config/datasources/innovation/innovation-hub/overview/portfolio-big-numbers.datasource";
import {
  INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_DATASET_ID,
  INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_SP_NAME,
} from "@domain/config/datasources/innovation/innovation-hub/overview/portfolio-big-numbers.datasource";
import { portfolioBigNumbersHandler } from "@domain/handlers/innovation/innovation-hub/overview/portfolio-big-numbers.handler";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("InnovationHubOverviewPortfolioBigNumbers datasource config", () => {
  const config: DatasourceConfig = portfolioBigNumbers;

  it("should define a single portfolio-big-numbers dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(
      INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_DATASET_ID,
    );
  });

  it("should call owr_result_query_sp with the inno-portfolio-big-numbers function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_SP_NAME,
    );
  });

  it("should require country and dt_end filters", () => {
    expect(config.filters?.map((filter) => filter.name)).toEqual([
      "country",
      "dt_end",
    ]);
    expect(config.filters?.every((filter) => filter.required)).toBe(true);
  });

  it("should pass static kpi=all to the lake SP without requiring kpi filter", () => {
    expect(config.datasets[0].config.procedure).toContain('"kpi": "all"');
    expect(config.datasets[0].config.procedure).not.toContain('"kpi": :kpi');
  });

  it("should use KpiEntity with the portfolio big numbers handler", () => {
    expect(config.entityClass).toBe(KpiEntity);
    expect(config.handler).toBe(portfolioBigNumbersHandler);
  });

  it("should use deltalake procedure execution", () => {
    expect(config.datasets[0].config.type).toBe(RepositoryType.deltalake);
    expect(config.datasets[0].config.executionType).toBe(
      DeltalakeExecutionType.procedure,
    );
  });
});

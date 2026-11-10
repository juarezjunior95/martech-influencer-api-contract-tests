import portfolioPieCharts from "@domain/config/datasources/innovation/innovation-hub/overview/portfolio-pie-charts.datasource";
import {
  INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_DATASET_ID,
  INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_SP_NAME,
} from "@domain/config/datasources/innovation/innovation-hub/overview/portfolio-pie-charts.datasource";
import { portfolioPieChartsHandler } from "@domain/handlers/innovation/innovation-hub/overview/portfolio-pie-charts.handler";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("InnovationHubOverviewPortfolioPieCharts datasource config", () => {
  const config: DatasourceConfig = portfolioPieCharts;

  it("should define a single portfolio-pie-charts dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(
      INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_DATASET_ID,
    );
  });

  it("should call owr_result_query_sp with the donut-chart function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_SP_NAME,
    );
  });

  it("should require viewtype, zone, country, dt_end and period_type filters", () => {
    expect(config.filters?.map((filter) => filter.name)).toEqual([
      "viewtype",
      "zone",
      "country",
      "dt_end",
      "period_type",
    ]);
    expect(config.filters?.every((filter) => filter.required)).toBe(true);
  });

  it("should use KpiEntity with the portfolio pie charts handler", () => {
    expect(config.entityClass).toBe(KpiEntity);
    expect(config.handler).toBe(portfolioPieChartsHandler);
  });

  it("should set staticParams viewtype to all", () => {
    expect(config.datasets[0].config.procedure).toContain('"viewtype": "all"');
  });

  it("should use deltalake procedure execution", () => {
    expect(config.datasets[0].config.type).toBe(RepositoryType.deltalake);
    expect(config.datasets[0].config.executionType).toBe(
      DeltalakeExecutionType.procedure,
    );
  });
});

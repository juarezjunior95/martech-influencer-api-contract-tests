import mainCards from "@domain/config/datasources/innovation/innovation-hub/overview/main-cards.datasource";
import {
  INNOVATION_HUB_OVERVIEW_MAIN_CARDS_DATASET_ID,
  INNOVATION_HUB_OVERVIEW_MAIN_CARDS_SP_NAME,
} from "@domain/config/datasources/innovation/innovation-hub/overview/main-cards.datasource";
import { mainCardsHandler } from "@domain/handlers/innovation/innovation-hub/overview/main-cards.handler";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("InnovationHubOverviewMainCards datasource config", () => {
  const config: DatasourceConfig = mainCards;

  it("should define a single main-cards dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(
      INNOVATION_HUB_OVERVIEW_MAIN_CARDS_DATASET_ID,
    );
  });

  it("should call owr_result_query_sp with the global-total-innovation-performance function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      INNOVATION_HUB_OVERVIEW_MAIN_CARDS_SP_NAME,
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

  it("should use KpiEntity with the main cards handler", () => {
    expect(config.entityClass).toBe(KpiEntity);
    expect(config.handler).toBe(mainCardsHandler);
  });

  it("should use deltalake procedure execution", () => {
    expect(config.datasets[0].config.type).toBe(RepositoryType.deltalake);
    expect(config.datasets[0].config.executionType).toBe(
      DeltalakeExecutionType.procedure,
    );
  });

  it("should forward all five request parameters in the procedure JSON payload", () => {
    const procedure = config.datasets[0].config.procedure ?? "";

    expect(procedure).toContain('"viewtype": :viewtype');
    expect(procedure).toContain('"zone": :zone');
    expect(procedure).toContain('"country": :country');
    expect(procedure).toContain('"dt_end": :dt_end');
    expect(procedure).toContain('"period_type": :period_type');
  });
});

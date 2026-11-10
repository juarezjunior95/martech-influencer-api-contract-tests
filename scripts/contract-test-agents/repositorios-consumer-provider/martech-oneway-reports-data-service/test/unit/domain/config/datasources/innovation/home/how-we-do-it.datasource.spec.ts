import howWeDoIt from "@domain/config/datasources/innovation/home/how-we-do-it.datasource";
import {
  INNOVATION_HOME_HOW_WE_DO_IT_DATASET_ID,
  INNOVATION_HOME_HOW_WE_DO_IT_SP_NAME,
} from "@domain/config/datasources/innovation/home/how-we-do-it.datasource";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("InnovationHomeHowWeDoIt datasource config", () => {
  const config: DatasourceConfig = howWeDoIt;

  it("should define a single how-we-do-it dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(INNOVATION_HOME_HOW_WE_DO_IT_DATASET_ID);
  });

  it("should call owr_result_query_sp with the how-we-do-it function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      INNOVATION_HOME_HOW_WE_DO_IT_SP_NAME,
    );
  });

  it("should require viewtype, country, zone, dt_end and period_type filters", () => {
    expect(config.filters?.map((filter) => filter.name)).toEqual([
      "viewtype",
      "country",
      "zone",
      "dt_end",
      "period_type",
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

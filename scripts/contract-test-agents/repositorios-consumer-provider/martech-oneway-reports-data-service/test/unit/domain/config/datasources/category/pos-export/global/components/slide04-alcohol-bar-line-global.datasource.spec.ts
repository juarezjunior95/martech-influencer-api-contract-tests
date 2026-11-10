import slide04AlcoholBarLineGlobal from "@domain/config/datasources/category/pos-export/global/components/slide04-alcohol-bar-line-global.datasource";
import { POS_EXPORT_SLIDE04_ALCOHOL_BAR_LINE_GLOBAL_DATASET_ID } from "@domain/config/datasources/category/pos-export/global/components/slide04-alcohol-bar-line-global.datasource";
import { POS_EXPORT_LINE_CHART_SP_NAME } from "@domain/config/datasources/category/pos-export/country/components/slide03-alcohol-bar-line.datasource";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("PosExportSlide04AlcoholBarLineGlobal datasource config", () => {
  const config: DatasourceConfig = slide04AlcoholBarLineGlobal;

  it("should define a single slide04-alcohol-bar-line-global dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(
      POS_EXPORT_SLIDE04_ALCOHOL_BAR_LINE_GLOBAL_DATASET_ID,
    );
  });

  it("should call owr_result_query_sp with the shared line-chart function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      POS_EXPORT_LINE_CHART_SP_NAME,
    );
  });

  it("should inline the Alcohol scope without dynamic manufacturer", () => {
    expect(config.datasets[0].config.procedure).toContain(
      '"category": "Alcohol"',
    );
    expect(config.datasets[0].config.procedure).not.toContain(":category");
    expect(config.datasets[0].config.procedure).not.toContain(":manufacturer");
    expect(config.filters?.map((filter) => filter.name)).not.toContain(
      "manufacturer",
    );
  });

  it("should require country and dt_end filters", () => {
    expect(config.filters?.map((filter) => filter.name)).toEqual([
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

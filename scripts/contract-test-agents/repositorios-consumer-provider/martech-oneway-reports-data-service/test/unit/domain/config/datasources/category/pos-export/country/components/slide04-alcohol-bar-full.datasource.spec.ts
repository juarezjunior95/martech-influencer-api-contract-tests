import slide04AlcoholBarFull from "@domain/config/datasources/category/pos-export/country/components/slide04-alcohol-bar-full.datasource";
import {
  POS_EXPORT_SLIDE04_ALCOHOL_BAR_FULL_DATASET_ID,
  POS_EXPORT_SLIDE04_ALCOHOL_BAR_FULL_SP_NAME,
} from "@domain/config/datasources/category/pos-export/country/components/slide04-alcohol-bar-full.datasource";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("PosExportSlide04AlcoholBarFull datasource config", () => {
  const config: DatasourceConfig = slide04AlcoholBarFull;

  it("should define a single slide04-alcohol-bar-full dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(
      POS_EXPORT_SLIDE04_ALCOHOL_BAR_FULL_DATASET_ID,
    );
  });

  it("should call owr_result_query_sp with the alcohol export function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      POS_EXPORT_SLIDE04_ALCOHOL_BAR_FULL_SP_NAME,
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

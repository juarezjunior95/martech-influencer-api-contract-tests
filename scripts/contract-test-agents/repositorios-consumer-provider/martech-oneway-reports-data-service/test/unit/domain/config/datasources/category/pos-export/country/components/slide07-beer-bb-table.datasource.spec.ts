import slide07BeerBbTable from "@domain/config/datasources/category/pos-export/country/components/slide07-beer-bb-table.datasource";
import {
  POS_EXPORT_SLIDE07_BEER_BB_TABLE_DATASET_ID,
  POS_EXPORT_SLIDE07_BEER_BB_TABLE_SP_NAME,
} from "@domain/config/datasources/category/pos-export/country/components/slide07-beer-bb-table.datasource";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("PosExportSlide07BeerBbTable datasource config", () => {
  const config: DatasourceConfig = slide07BeerBbTable;

  it("should define a single slide07-beer-bb-table dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(
      POS_EXPORT_SLIDE07_BEER_BB_TABLE_DATASET_ID,
    );
  });

  it("should call owr_result_query_sp with the cohort export function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      POS_EXPORT_SLIDE07_BEER_BB_TABLE_SP_NAME,
    );
  });

  it("should require country and dt_end filters", () => {
    expect(config.filters?.map((filter) => filter.name)).toEqual([
      "country",
      "dt_end",
    ]);
    expect(config.filters?.every((filter) => filter.required)).toBe(true);
  });

  it("should inline viewtype as a static param so the request filter cannot override it", () => {
    // A `viewtype` filter (country/global) already travels with every request;
    // as a dynamic parameter it would win over the value this slide needs.
    expect(config.datasets[0].config.procedure).toContain('"viewtype"');
    expect(config.datasets[0].config.procedure).toContain('"category"');
    expect(config.datasets[0].config.procedure).not.toContain(":viewtype");
    expect(config.filters?.map((filter) => filter.name)).not.toContain(
      "viewtype",
    );
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

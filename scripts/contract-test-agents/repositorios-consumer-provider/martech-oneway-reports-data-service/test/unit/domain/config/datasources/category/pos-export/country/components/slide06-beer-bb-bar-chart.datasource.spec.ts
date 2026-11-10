import slide06BeerBbBarChart, {
  POS_EXPORT_SLIDE06_BEER_BB_BAR_CHART_DATASET_ID,
} from "@domain/config/datasources/category/pos-export/country/components/slide06-beer-bb-bar-chart.datasource";
import { POS_EXPORT_BAR_CHART_SP_NAME } from "@domain/config/datasources/category/pos-export/country/components/slide03-alcohol-bar-chart.datasource";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("PosExportSlide06BeerBbBarChart datasource config", () => {
  const config: DatasourceConfig = slide06BeerBbBarChart;

  it("should define a single slide06-beer-bb-bar-chart dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(
      POS_EXPORT_SLIDE06_BEER_BB_BAR_CHART_DATASET_ID,
    );
  });

  it("should call owr_result_query_sp with the bar-chart function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      POS_EXPORT_BAR_CHART_SP_NAME,
    );
  });

  it("should inline the Beer + Beyond Beer category instead of exposing it as a filter", () => {
    expect(config.datasets[0].config.procedure).toContain(
      '"category": "Beer + Beyond Beer"',
    );
    expect(config.datasets[0].config.procedure).not.toContain(":category");
    expect(config.filters?.map((filter) => filter.name)).not.toContain(
      "category",
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

import slide08AbiBarLine from "@domain/config/datasources/category/pos-export/country/components/slide08-abi-bar-line.datasource";
import { POS_EXPORT_SLIDE08_ABI_BAR_LINE_DATASET_ID } from "@domain/config/datasources/category/pos-export/country/components/slide08-abi-bar-line.datasource";
import { POS_EXPORT_LINE_CHART_SP_NAME } from "@domain/config/datasources/category/pos-export/country/components/slide03-alcohol-bar-line.datasource";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("PosExportSlide08AbiBarLine datasource config", () => {
  const config: DatasourceConfig = slide08AbiBarLine;

  it("should define a single slide08-abi-bar-line dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(
      POS_EXPORT_SLIDE08_ABI_BAR_LINE_DATASET_ID,
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

  it("should inline the ABI Beer + Beyond Beer scope without dynamic manufacturer", () => {
    expect(config.datasets[0].config.procedure).toContain(
      '"category": "Beer + Beyond Beer"',
    );
    expect(config.datasets[0].config.procedure).toContain(
      '"manufacturer": "ABI"',
    );
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

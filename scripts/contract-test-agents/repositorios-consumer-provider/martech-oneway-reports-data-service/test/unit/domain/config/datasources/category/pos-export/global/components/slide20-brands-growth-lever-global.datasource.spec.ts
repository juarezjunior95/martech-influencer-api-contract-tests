import slide20BrandsGrowthLever, {
  POS_EXPORT_SLIDE20_BRANDS_GROWTH_LEVER_GLOBAL_DATASET_ID,
  POS_EXPORT_RANKING_GROWTH_LEVERS_SP_NAME,
} from "@domain/config/datasources/category/pos-export/global/components/slide20-brands-growth-lever-global.datasource";
import rankingBrandsHandler from "@domain/handlers/category/pos-export/ranking-brands.handler";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("PosExportSlide20BrandsGrowthLeverGlobal datasource config", () => {
  const config: DatasourceConfig = slide20BrandsGrowthLever;

  it("should define a single slide20-brands-growth-lever-global dataset", () => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(
      POS_EXPORT_SLIDE20_BRANDS_GROWTH_LEVER_GLOBAL_DATASET_ID,
    );
  });

  it("should call owr_result_query_sp with the ranking growth levers function id", () => {
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      POS_EXPORT_RANKING_GROWTH_LEVERS_SP_NAME,
    );
  });

  it("should require only dt_end, since the procedure always covers the Top 12", () => {
    expect(config.filters?.map((filter) => filter.name)).toEqual(["dt_end"]);
    expect(config.filters?.every((filter) => filter.required)).toBe(true);
    expect(config.datasets[0].config.procedure).not.toContain(":country");
  });

  it("should run the ranking brands handler before the entity", () => {
    expect(config.handler).toBe(rankingBrandsHandler);
    expect(config.entityClass).toBe(KpiEntity);
    expect(config.entityClassAfterHandler).toBe(true);
  });

  it("should use deltalake procedure execution", () => {
    expect(config.datasets[0].config.type).toBe(RepositoryType.deltalake);
    expect(config.datasets[0].config.executionType).toBe(
      DeltalakeExecutionType.procedure,
    );
  });
});

import perYearFullDatasource from "@domain/config/datasources/portfolio-brand/brand-analysis/brand-power/per-year-full.datasource";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("Brand Power per-year-full datasource", () => {
  it("should call the brand-power-drivers full-year procedure", () => {
    expect(perYearFullDatasource.datasets).toHaveLength(1);
    expect(perYearFullDatasource.datasets[0].id).toBe("per-year-full");
    expect(perYearFullDatasource.datasets[0].config).toMatchObject({
      executionType: DeltalakeExecutionType.procedure,
      type: RepositoryType.deltalake,
    });
    expect(perYearFullDatasource.datasets[0].config.query).toBeUndefined();
    expect(perYearFullDatasource.datasets[0].config.procedure).toContain(
      "3_portfolio_brand_brand-power-drivers_power_full-year",
    );
    expect(perYearFullDatasource.entityClass).toBe(KpiEntity);
    expect(perYearFullDatasource.filters).toEqual([
      { name: "country", required: true },
      { name: "zone", required: true },
      { name: "viewtype", required: true },
      { name: "sub_brand", required: true },
      { name: "sub_brand_comp", required: true },
      { name: "dt_end", required: true },
    ]);
  });
});

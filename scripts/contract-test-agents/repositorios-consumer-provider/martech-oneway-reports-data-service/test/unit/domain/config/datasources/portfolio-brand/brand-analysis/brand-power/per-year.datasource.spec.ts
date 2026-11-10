import perYearDatasource from "@domain/config/datasources/portfolio-brand/brand-analysis/brand-power/per-year.datasource";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("Brand Power per-year datasource", () => {
  it("should call the brand-power-drivers ytd procedure", () => {
    expect(perYearDatasource.datasets).toHaveLength(1);
    expect(perYearDatasource.datasets[0].id).toBe("per-year");
    expect(perYearDatasource.datasets[0].config).toMatchObject({
      executionType: DeltalakeExecutionType.procedure,
      type: RepositoryType.deltalake,
    });
    expect(perYearDatasource.datasets[0].config.query).toBeUndefined();
    expect(perYearDatasource.datasets[0].config.procedure).toContain(
      "3_portfolio_brand_brand-power-drivers_power_brand-power-per-year",
    );
    expect(perYearDatasource.entityClass).toBe(KpiEntity);
    expect(perYearDatasource.filters).toEqual([
      { name: "country", required: true },
      { name: "zone", required: true },
      { name: "viewtype", required: true },
      { name: "sub_brand", required: true },
      { name: "sub_brand_comp", required: true },
      { name: "dt_end", required: true },
    ]);
  });
});

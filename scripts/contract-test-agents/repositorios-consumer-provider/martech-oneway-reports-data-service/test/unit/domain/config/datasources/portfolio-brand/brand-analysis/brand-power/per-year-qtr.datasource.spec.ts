import perYearQtrDatasource from "@domain/config/datasources/portfolio-brand/brand-analysis/brand-power/per-year-qtr.datasource";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("Brand Power per-year-qtr datasource", () => {
  it("should call the brand-power-drivers qtr procedure", () => {
    expect(perYearQtrDatasource.datasets).toHaveLength(1);
    expect(perYearQtrDatasource.datasets[0].id).toBe("per-year-qtr");
    expect(perYearQtrDatasource.datasets[0].config).toMatchObject({
      executionType: DeltalakeExecutionType.procedure,
      type: RepositoryType.deltalake,
    });
    expect(perYearQtrDatasource.datasets[0].config.query).toBeUndefined();
    expect(perYearQtrDatasource.datasets[0].config.procedure).toContain(
      "3_portfolio_brand_brand-power-drivers_power_qtr",
    );
    expect(perYearQtrDatasource.entityClass).toBe(KpiEntity);
    expect(perYearQtrDatasource.filters).toEqual([
      { name: "country", required: true },
      { name: "zone", required: true },
      { name: "viewtype", required: true },
      { name: "sub_brand", required: true },
      { name: "sub_brand_comp", required: true },
      { name: "dt_end", required: true },
    ]);
  });
});

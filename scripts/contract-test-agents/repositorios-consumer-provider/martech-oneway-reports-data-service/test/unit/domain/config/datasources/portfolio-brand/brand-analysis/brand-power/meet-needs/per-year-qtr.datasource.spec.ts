import perYearQtrDatasource from "@domain/config/datasources/portfolio-brand/brand-analysis/brand-power/meet-needs/per-year-qtr.datasource";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("Meet Needs per-year-qtr datasource", () => {
  it("should call the meet-needs per-year-qtr procedure", () => {
    expect(perYearQtrDatasource.datasets).toHaveLength(1);
    expect(perYearQtrDatasource.datasets[0].id).toBe("per-year-qtr");
    expect(perYearQtrDatasource.datasets[0].config).toMatchObject({
      executionType: DeltalakeExecutionType.procedure,
      type: RepositoryType.deltalake,
    });
    expect(perYearQtrDatasource.datasets[0].config.query).toBeUndefined();
    expect(perYearQtrDatasource.datasets[0].config.procedure).toContain(
      "3_portfolio_brand_brand-power-drivers_meet-needs_meet-needs-per-year-qtr",
    );
    expect(perYearQtrDatasource.datasets[0].config.procedure).toContain(
      '"country": :country',
    );
    expect(perYearQtrDatasource.datasets[0].config.procedure).toContain(
      '"sub_brand": :sub_brand',
    );
    expect(perYearQtrDatasource.datasets[0].config.procedure).toContain(
      '"sub_brand_comp": :sub_brand_comp',
    );
    expect(perYearQtrDatasource.datasets[0].config.procedure).toContain(
      '"dt_end": :dt_end',
    );
    expect(perYearQtrDatasource.entityClass).toBe(KpiEntity);
    expect(perYearQtrDatasource.filters).toEqual([
      { name: "country", required: true },
      { name: "sub_brand", required: true },
      { name: "sub_brand_comp", required: true },
      { name: "dt_end", required: true },
    ]);
  });
});

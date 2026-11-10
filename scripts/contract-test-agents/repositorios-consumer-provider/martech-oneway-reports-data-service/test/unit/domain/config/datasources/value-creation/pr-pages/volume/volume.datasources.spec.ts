import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

import topBottomBrands from "@domain/config/datasources/value-creation/pr-pages/volume/top-bottom-brands.datasource";
import divByBrands from "@domain/config/datasources/value-creation/pr-pages/volume/div-by-brands.datasource";

describe("PR Pages volume datasource configs", () => {
  it("top-bottom-brands", () => {
    expect(topBottomBrands.datasets).toHaveLength(1);
    expect(topBottomBrands.datasets[0].id).toBe("top-bottom-brands");

    const dsConfig = topBottomBrands.datasets[0].config;
    expect(dsConfig.query).toBe(
      "value-creation/pr-pages/volume/top-bottom-brands",
    );
    expect(dsConfig.executionType).toBe(DeltalakeExecutionType.query);
    expect(dsConfig.type).toBe(RepositoryType.deltalake);
    expect(topBottomBrands.filters?.map((filter) => filter.name)).toEqual([
      "kpi",
      "dt_end",
      "page_type",
      "period",
      "growth_lever",
      "view_level",
      "country",
      "reporttype",
    ]);
    topBottomBrands.filters?.forEach((filter) => {
      expect(filter.required).toBe(true);
    });
    expect(topBottomBrands.entityClass).toBe(KpiEntity);
  });

  it("div-by-brands injects procedure environment by default", () => {
    expect(divByBrands.datasets).toHaveLength(1);
    expect(divByBrands.datasets[0].id).toBe("div-by-brands");

    const dsConfig = divByBrands.datasets[0].config;
    expect(dsConfig.query).toBe("value-creation/pr-pages/volume/div-by-brands");
    expect(dsConfig.executionType).toBe(DeltalakeExecutionType.query);
    expect(dsConfig.type).toBe(RepositoryType.deltalake);
    expect(dsConfig.injectProcedureEnvironment).toBe(true);
    expect(divByBrands.filters?.map((filter) => filter.name)).toEqual([
      "dt_end",
      "country",
      "period_type",
      "filter_type",
    ]);
    divByBrands.filters?.forEach((filter) => {
      expect(filter.required).toBe(true);
    });
    expect(divByBrands.entityClass).toBe(KpiEntity);
  });
});

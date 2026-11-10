import byZoneMaturityPerformanceDetails from "@domain/config/datasources/portfolio-brand/brand-power-book/overview/performance-breakdown/by-zone-maturity-performance-details.datasource";
import byBrandBreakdown from "@domain/config/datasources/portfolio-brand/brand-power-book/overview/summary-power/by-brand-breakdown.datasource";
import { BRAND_POWER_RESULTS_PERFORMANCE_BREAKDOWN_FUNCTION } from "@domain/config/datasources/portfolio-brand/brand-power-book/overview/performance-breakdown-and-summary-power/performance-breakdown-and-summary-power.datasource";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

describe("Brand Power Book performance breakdown and summary power datasources", () => {
  const assertProcedureConfig = (
    config: DatasourceConfig,
    datasetId: string,
    visual: string,
  ) => {
    expect(config.datasets).toHaveLength(1);
    expect(config.datasets[0].id).toBe(datasetId);
    expect(config.datasets[0].config).toMatchObject({
      executionType: DeltalakeExecutionType.procedure,
      type: RepositoryType.deltalake,
    });
    expect(config.datasets[0].config.query).toBeUndefined();
    expect(config.datasets[0].config.procedure).toContain(
      "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
    );
    expect(config.datasets[0].config.procedure).toContain(
      BRAND_POWER_RESULTS_PERFORMANCE_BREAKDOWN_FUNCTION,
    );
    expect(config.datasets[0].config.procedure).toContain(
      `"visual": "${visual}"`,
    );
    expect(config.entityClass).toBe(KpiEntity);
    expect(config.handler).toBeUndefined();
  };

  it("should call the calibrated result-query function for zone maturity details", () => {
    assertProcedureConfig(
      byZoneMaturityPerformanceDetails,
      "zone_maturity_power_details",
      "COUNTRY",
    );
    expect(byZoneMaturityPerformanceDetails.filters).toEqual([
      { name: "dt_end", required: true },
      { name: "page_filter", required: true },
      { name: "viewtype", required: true },
      { name: "zone_maturity", required: true },
      { name: "period_type", required: false },
    ]);
    expect(
      byZoneMaturityPerformanceDetails.datasets[0].config.procedure,
    ).toContain(`"zone_maturity": :zone_maturity`);
  });

  it("should call the calibrated result-query function for brand breakdown", () => {
    assertProcedureConfig(
      byBrandBreakdown,
      "summary_power_brand_breakdown",
      "BRAND",
    );
    expect(byBrandBreakdown.filters).toEqual([
      { name: "page_filter", required: true },
      { name: "country", required: true },
      { name: "dt_end", required: true },
      { name: "period_type", required: false },
    ]);
    expect(byBrandBreakdown.datasets[0].config.procedure).toContain(
      `"country": :country`,
    );
  });
});

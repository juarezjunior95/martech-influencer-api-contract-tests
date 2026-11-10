import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import {
  DeltalakeExecutionType,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";

interface BreakdownDatasourceVariant {
  modulePath: string;
  spName: string;
  datasetId: string;
  filterNames?: string[];
}

const CANONICAL_FILTER_NAMES = [
  "country",
  "category",
  "timeframe",
  "dt_end",
  "kpi",
  "view_by",
  "manufacturer",
  "brand",
  "brand_segments",
  "region",
  "cohort",
];

const BREAKDOWN_DATASOURCE_VARIANTS: BreakdownDatasourceVariant[] = [
  {
    modulePath:
      "@domain/config/datasources/category/pos-performance-tool/drilldown/breakdown.datasource",
    spName: "1_category_pos-tool_drill-down_breakdown",
    datasetId: "owr_category_pos_tool_drill_down_breakdown_fn",
  },
  {
    modulePath:
      "@domain/config/datasources/category/pos-performance-tool/drilldown/breakdown-brand.datasource",
    spName: "1_category_pos-tool_drill-down_breakdown-brand",
    datasetId: "owr_category_pos_tool_drill_down_breakdown_brand_fn",
  },
  {
    modulePath:
      "@domain/config/datasources/category/pos-performance-tool/drilldown/breakdown-category.datasource",
    spName: "1_category_pos-tool_drill-down_breakdown-category",
    datasetId: "owr_category_pos_tool_drill_down_breakdown_category_fn",
  },
  {
    modulePath:
      "@domain/config/datasources/category/pos-performance-tool/drilldown/breakdown-cohorts.datasource",
    spName: "1_category_pos-tool_drill-down_breakdown-cohorts",
    datasetId: "owr_category_pos_tool_drill_down_breakdown_cohorts_fn",
  },
  {
    modulePath:
      "@domain/config/datasources/category/pos-performance-tool/drilldown/breakdown-country.datasource",
    spName: "1_category_pos-tool_drill-down_breakdown-country",
    datasetId: "owr_category_pos_tool_drill_down_breakdown_country_fn",
  },
  {
    modulePath:
      "@domain/config/datasources/category/pos-performance-tool/drilldown/breakdown-growth-levers.datasource",
    spName: "1_category_pos-tool_drill-down_breakdown-growth-levers",
    datasetId: "owr_category_pos_tool_drill_down_breakdown_growth_levers_fn",
  },
  {
    modulePath:
      "@domain/config/datasources/category/pos-performance-tool/drilldown/breakdown-manufacturer.datasource",
    spName: "1_category_pos-tool_drill-down_breakdown-manufacturer",
    datasetId: "owr_category_pos_tool_drill_down_breakdown_manufacturer_fn",
  },
  {
    modulePath:
      "@domain/config/datasources/category/pos-performance-tool/drilldown/breakdown-portfolio.datasource",
    spName: "1_category_pos-tool_drill-down_breakdown-portfolio",
    datasetId: "owr_category_pos_tool_drill_down_breakdown_portfolio_fn",
  },
  {
    modulePath:
      "@domain/config/datasources/category/pos-performance-tool/drilldown/breakdown-region.datasource",
    spName: "1_category_pos-tool_drill-down_breakdown-region",
    datasetId: "owr_category_pos_tool_drill_down_breakdown_region_fn",
  },
];

describe.each(BREAKDOWN_DATASOURCE_VARIANTS)(
  "PosPerformanceToolDrilldownBreakdown datasource config ($spName)",
  ({ modulePath, spName, datasetId, filterNames = CANONICAL_FILTER_NAMES }) => {
    let config: DatasourceConfig;

    beforeAll(async () => {
      const module = await import(modulePath);
      config = module.default;
    });

    it("should have at least one dataset defined", () => {
      expect(config.datasets).toBeDefined();
      expect(Array.isArray(config.datasets)).toBe(true);
      expect(config.datasets.length).toBeGreaterThan(0);
    });

    it("should use deltalake repository type with procedure execution", () => {
      config.datasets.forEach((dataset) => {
        expect(dataset.config.type).toBe(RepositoryType.deltalake);
        expect(dataset.config.executionType).toBe(
          DeltalakeExecutionType.procedure,
        );
      });
    });

    it("should call owr_result_query_sp with the breakdown function id", () => {
      expect(config.datasets[0].config.procedure).toContain(
        "{{DATABRICKS_SCHEMA}}.owr_result_query_sp",
      );
      expect(config.datasets[0].config.procedure).toContain(spName);
    });

    it("should use KpiEntity as entityClass", () => {
      expect(config.entityClass).toBe(KpiEntity);
    });

    it("should expose required filters matching the SP payload", () => {
      expect(config.filters).toBeDefined();
      const requiredFilters = config.filters?.filter((f) => f.required) ?? [];
      const requiredFilterNames = requiredFilters.map((f) => f.name);

      expect(requiredFilters).toHaveLength(filterNames.length);
      expect(requiredFilterNames).toEqual(filterNames);
      expect(requiredFilterNames).toContain("view_by");
      if (filterNames.includes("brand_segments")) {
        expect(requiredFilterNames).toContain("brand_segments");
      }
    });

    it("should have dataset id following naming convention", () => {
      const datasetIdPattern = /^[a-z][a-z0-9_]*$/;

      config.datasets.forEach((dataset) => {
        expect(dataset.id).toMatch(datasetIdPattern);
      });
      expect(config.datasets[0].id).toBe(datasetId);
    });

    it("should not define a handler", () => {
      expect(config.handler).toBeUndefined();
    });
  },
);

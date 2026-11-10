import { KpiEntity } from "@domain/entities/kpi.entity";

import { buildFilterNames } from "@domain/config/common/filter-config.helpers";
import waterfallConfig from "@domain/config/datasources/value-creation/commercial-results/waterfall.datasource";
import {
  COMMERCIAL_RESULTS_COMMON_FILTER_NAMES,
  COMMERCIAL_RESULTS_WATERFALL_FILTER_NAMES,
} from "@domain/config/presets/commercial-results/commercial-results.types";

const EXPECTED_FILTER_NAMES = buildFilterNames(
  COMMERCIAL_RESULTS_COMMON_FILTER_NAMES.filter((name) => name !== "zone"),
  COMMERCIAL_RESULTS_WATERFALL_FILTER_NAMES,
);

describe("commercial-results waterfall datasource config", () => {
  it("should export a valid DatasourceConfig object", () => {
    expect(waterfallConfig).toBeDefined();
    expect(typeof waterfallConfig).toBe("object");
  });

  describe("datasets", () => {
    it("should contain the correct function name in the procedure string", () => {
      const procedure = waterfallConfig.datasets[0].config.procedure as string;
      expect(procedure).toContain(
        "7_value_creation_commercial-results_volume_waterfall",
      );
    });

    it("should contain all required inline parameter markers in the procedure", () => {
      const procedure = waterfallConfig.datasets[0].config.procedure as string;
      EXPECTED_FILTER_NAMES.forEach((name) => {
        expect(procedure).toContain(`:${name}`);
      });
      expect(procedure).not.toContain(`:"zone"`);
      expect(procedure).not.toContain(`:zone`);
    });

    it("should contain waterfall-specific parameter markers in the procedure", () => {
      const procedure = waterfallConfig.datasets[0].config.procedure as string;
      COMMERCIAL_RESULTS_WATERFALL_FILTER_NAMES.forEach((name) => {
        expect(procedure).toContain(`:${name}`);
      });
    });

    it("should call the standard owr_result_query_sp wrapper", () => {
      const procedure = waterfallConfig.datasets[0].config.procedure as string;
      expect(procedure).toContain("owr_result_query_sp");
    });
  });

  describe("entityClass", () => {
    it("should use KpiEntity as entityClass", () => {
      expect(waterfallConfig.entityClass).toBe(KpiEntity);
    });
    it("should not use handler", () => {
      expect(waterfallConfig.handler).toBeUndefined();
    });
  });

  describe("filters", () => {
    it("should expose filters aligned with commercial-results common filters (minus zone) plus waterfall-specific filters", () => {
      expect(waterfallConfig.filters).toHaveLength(
        EXPECTED_FILTER_NAMES.length,
      );
      expect(waterfallConfig.filters?.map((f) => f.name)).toEqual(
        EXPECTED_FILTER_NAMES,
      );
    });

    it("should not include zone", () => {
      const filterNames =
        waterfallConfig.filters?.map((filter) => filter.name) ?? [];
      expect(filterNames).not.toContain("zone");
    });

    it("should mark all filters as required", () => {
      waterfallConfig.filters?.forEach((filter) => {
        expect(filter.required).toBe(true);
      });
    });

    it.each(EXPECTED_FILTER_NAMES)(
      'filter "%s" should exist and be required',
      (filterName) => {
        const filter = waterfallConfig.filters?.find(
          (f) => f.name === filterName,
        );
        expect(filter).toBeDefined();
        expect(filter?.required).toBe(true);
      },
    );
  });
});

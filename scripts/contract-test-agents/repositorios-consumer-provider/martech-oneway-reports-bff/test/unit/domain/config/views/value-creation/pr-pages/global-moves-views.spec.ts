import globalMovesConfig from "@domain/config/views/value-creation/pr-pages/global-moves.view";

describe("Global Moves view config", () => {
  it("should have correct version and cache configuration", () => {
    expect(globalMovesConfig.version).toBe("1.0.0");
    expect(globalMovesConfig.cache).toEqual({
      enabled: true,
      tags: ["default"],
    });
  });

  it("should have default filters with dt_end", () => {
    expect(globalMovesConfig.filters?.default).toBeDefined();
    expect(
      globalMovesConfig.filters?.default.map((filter) => filter.name),
    ).toContain("dt_end");
  });

  it("should have exactly 36 components (6 brands × 6 charts each)", () => {
    expect(globalMovesConfig.components).toBeDefined();
    expect(globalMovesConfig.components.length).toBe(36);
  });

  it("should have unique component IDs", () => {
    const componentIds = globalMovesConfig.components.map((comp) => comp.id);
    const uniqueIds = new Set(componentIds);

    expect(componentIds.length).toBe(uniqueIds.size);
  });

  it("should use consistent formatter paths", () => {
    const expectedFormatters = [
      "value-creation/pr-pages/volume/big-numbers",
      "value-creation/pr-pages/volume/brands-by-segments/line-chart",
      "value-creation/pr-pages/volume/brands-by-segments/bar-chart",
      "value-creation/pr-pages/volume/brands-by-segments/top-15-countries",
      "value-creation/pr-pages/volume/must-win-markets",
    ];

    globalMovesConfig.components.forEach((component) => {
      expect(expectedFormatters).toContain(component.formatter);
    });
  });

  it("should use consistent datasource names", () => {
    const expectedDatasources = [
      "value-creation_performance-tool_drill-down_finance_volume_overtime-performance",
      "value-creation_pr-pages_volume_line-chart",
      "value-creation_pr-pages_volume_brands-by-segments_bar-chart",
      "value-creation_pr-pages_volume_brands-by-segments_top-15-countries",
      "value-creation_pr-pages_volume_must-win-markets",
    ];

    globalMovesConfig.components.forEach((component) => {
      component.datasources.forEach((datasource) => {
        expect(expectedDatasources).toContain(datasource.name);
      });
    });
  });

  it("should have exactly one datasource per component", () => {
    globalMovesConfig.components.forEach((component) => {
      expect(component.datasources.length).toBe(1);
    });
  });

  it("should have correct filters on each datasource type", () => {
    globalMovesConfig.components.forEach((component) => {
      component.datasources.forEach((datasource) => {
        expect(datasource.filters).toBeDefined();
        const filters = datasource.filters ?? [];
        expect(filters.length).toBeGreaterThanOrEqual(1);

        if (
          datasource.name ===
          "value-creation_performance-tool_drill-down_finance_volume_overtime-performance"
        ) {
          expect(filters[0].name).toBe("growth_lever");
          expect(filters[0].defaultValue).toBeDefined();
        } else if (
          datasource.name ===
          "value-creation_pr-pages_volume_brands-by-segments_bar-chart"
        ) {
          expect(filters.length).toBe(3);
          expect(filters[0].name).toBe("page_filter");
          expect(filters[1]).toEqual({
            name: "period_type",
            defaultValue: "YTD",
          });
          expect(filters[2].name).toBe("kpi");
        } else if (
          datasource.name === "value-creation_pr-pages_volume_must-win-markets"
        ) {
          expect(filters.length).toBe(3);
          expect(filters[0].name).toBe("page_type");
          expect(filters[1]).toEqual({ name: "country", defaultValue: "WIN" });
          expect(filters[2].name).toBe("kpi");
        } else if (
          datasource.name ===
          "value-creation_pr-pages_volume_brands-by-segments_top-15-countries"
        ) {
          expect(filters.length).toBe(3);
          expect(filters[0].name).toBe("page_type");
          expect(filters[1].name).toBe("period");
          expect(["YTD", "MTD"]).toContain(filters[1].defaultValue);
          expect(filters[2].name).toBe("kpi");
        } else if (
          datasource.name === "value-creation_pr-pages_volume_line-chart"
        ) {
          expect(filters.length).toBe(10);
          expect(filters[0].name).toBe("page_type");
          expect(filters[1]).toEqual({ name: "country", defaultValue: "ABI" });
        } else {
          expect(filters.length).toBe(1);
          expect(filters[0].name).toBe("page_type");
        }
      });
    });
  });

  it("should follow naming convention for component IDs", () => {
    const expectedPatterns = [
      /^big-numbers-(corona|corona-cero|budweiser|stella|michelob|flying-fish)$/,
      /^line-chart-(corona|corona-cero|budweiser|stella|michelob|flying-fish)$/,
      /^bar-chart-(corona|corona-cero|budweiser|stella|michelob|flying-fish)$/,
      /^must-win-markets-(corona|corona-cero|budweiser|stella|michelob|flying-fish)$/,
      /^waterfall-(corona|corona-cero|budweiser|stella|michelob|flying-fish)-(YTD|MTD)$/,
    ];

    globalMovesConfig.components.forEach((component) => {
      const matchesPattern = expectedPatterns.some((pattern) =>
        pattern.test(component.id),
      );
      expect(matchesPattern).toBe(true);
    });
  });
});

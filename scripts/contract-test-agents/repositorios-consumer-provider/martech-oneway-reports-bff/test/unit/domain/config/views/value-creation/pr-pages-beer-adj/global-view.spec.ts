import globalViewConfig from "@domain/config/views/value-creation/pr-pages-beer-adj/global.view";

describe("PR Pages Beer Adj — Global view config", () => {
  it("should have correct version, cache, and default filters", () => {
    expect(globalViewConfig.version).toBe("1.0.0");
    expect(globalViewConfig.cache).toEqual({
      enabled: true,
      tags: ["default"],
    });
    expect(globalViewConfig.filters?.default?.map((f) => f.name)).toContain(
      "dt_end",
    );
  });

  it("should define 11 components with unique ids", () => {
    expect(globalViewConfig.components).toHaveLength(11);
    const ids = globalViewConfig.components.map((c) => c.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it("should wire portfolio to beer-adj formatter and volume-beer-adj datasource", () => {
    const portfolio = globalViewConfig.components.find(
      (c) => c.id === "portfolio",
    );
    expect(portfolio?.formatter).toBe(
      "value-creation/pr-pages-beer-adj/portfolio",
    );
    expect(portfolio?.datasources[0].name).toBe(
      "value-creation_pr-pages_volume-beer-adj_portfolio",
    );
  });

  it("should only use volume-beer-adj datasource names for volume widgets", () => {
    const expectedVolumeAdjNames = [
      "value-creation_pr-pages_volume-beer-adj_big-numbers",
      "value-creation_pr-pages_volume-beer-adj_line-chart",
      "value-creation_pr-pages_volume-beer-adj_portfolio",
      "value-creation_pr-pages_volume-beer-adj_growth-levers",
      "value-creation_pr-pages_volume-beer-adj_must-win-markets",
      "value-creation_pr-pages_volume-beer-adj_segments-gb_mtd-by-country",
      "value-creation_pr-pages_volume-beer-adj_top-bottom-brands",
    ];

    globalViewConfig.components.forEach((component) => {
      component.datasources.forEach((ds) => {
        expect(expectedVolumeAdjNames).toContain(ds.name);
      });
    });
  });

  it("should have exactly one datasource per component", () => {
    globalViewConfig.components.forEach((component) => {
      expect(component.datasources).toHaveLength(1);
    });
  });
});

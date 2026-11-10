import countryViewConfig from "@domain/config/views/value-creation/pr-pages-beer-adj/country.view";

describe("PR Pages Beer Adj — country.view (volume country page)", () => {
  it("should have version, cache, and filter sets", () => {
    expect(countryViewConfig.version).toBe("1.0.0");
    expect(countryViewConfig.cache).toEqual({
      enabled: true,
      tags: ["default"],
    });
    expect(countryViewConfig.filters?.default?.map((f) => f.name)).toEqual([
      "dt_end",
      "dt_ini",
      "country",
      "zone",
      "page_type",
    ]);
    expect(countryViewConfig.filters?.bigNumbers?.map((f) => f.name)).toEqual([
      "dt_end",
      "zone",
      "country",
    ]);
  });

  it("should define six components with unique ids", () => {
    expect(countryViewConfig.components).toHaveLength(6);
    const ids = countryViewConfig.components.map((c) => c.id);
    expect(ids).toEqual([
      "big-numbers",
      "line-chart",
      "growth-levers",
      "portfolio",
      "brands-volume-MTD",
      "brands-volume-YTD",
    ]);
    expect(new Set(ids).size).toBe(6);
  });

  it("should use volume-beer-adj datasources for all widgets", () => {
    const names = countryViewConfig.components.flatMap((c) =>
      c.datasources.map((d) => d.name),
    );
    names.forEach((n) => {
      expect(n).toContain("volume-beer-adj");
    });
    expect(names).toEqual([
      "value-creation_pr-pages_volume-beer-adj_big-numbers",
      "value-creation_pr-pages_volume-beer-adj_line-chart",
      "value-creation_pr-pages_volume-beer-adj_growth-levers",
      "value-creation_pr-pages_volume-beer-adj_portfolio",
      "value-creation_pr-pages_volume-beer-adj_div-by-brands",
      "value-creation_pr-pages_volume-beer-adj_div-by-brands",
    ]);
  });

  it("should wire portfolio to beer-adj formatter with country portfolio filters", () => {
    const portfolio = countryViewConfig.components.find(
      (c) => c.id === "portfolio",
    );
    expect(portfolio?.formatter).toBe(
      "value-creation/pr-pages-beer-adj/portfolio",
    );
    expect(portfolio?.datasources).toHaveLength(1);
    expect(portfolio?.datasources[0].filters).toEqual([
      { name: "page_type", defaultValue: "Country - Portfolio" },
      { name: "kpi" },
    ]);
  });

  it("should set big-numbers filterSet and waterfall_filter for country context", () => {
    const big = countryViewConfig.components.find(
      (c) => c.id === "big-numbers",
    );
    expect(big?.datasources[0].filterSet).toBe("bigNumbers");
    const wf = big?.datasources[0].filters?.find(
      (f) => f.name === "waterfall_filter",
    );
    expect(wf).toEqual({ name: "waterfall_filter", defaultValue: "country" });
  });

  it("should configure line-chart for Country page with MTD period", () => {
    const line = countryViewConfig.components.find(
      (c) => c.id === "line-chart",
    );
    expect(line?.formatter).toBe(
      "value-creation/pr-pages/volume/brands-by-segments/line-chart",
    );
    const filters = line?.datasources[0].filters ?? [];
    expect(filters.find((f) => f.name === "page_type")).toEqual({
      name: "page_type",
      defaultValue: "Country",
    });
    expect(filters.find((f) => f.name === "period_type")).toEqual({
      name: "period_type",
      defaultValue: "MTD",
    });
    expect(filters).toHaveLength(10);
  });

  it("should configure growth-levers for country viewtype", () => {
    const gl = countryViewConfig.components.find(
      (c) => c.id === "growth-levers",
    );
    expect(gl?.datasources[0].filters).toEqual([
      { name: "page_type", defaultValue: "Growth Levers Country" },
      { name: "viewtype", defaultValue: "country" },
      { name: "country", defaultValue: "ABI" },
    ]);
  });

  it("should split brands volume by MTD vs YTD on div-by-brands", () => {
    const mtd = countryViewConfig.components.find(
      (c) => c.id === "brands-volume-MTD",
    );
    const ytd = countryViewConfig.components.find(
      (c) => c.id === "brands-volume-YTD",
    );
    expect(mtd?.datasources[0].filters).toEqual([
      { name: "period_type", defaultValue: "MTD" },
    ]);
    expect(ytd?.datasources[0].filters).toEqual([
      { name: "period_type", defaultValue: "YTD" },
    ]);
    expect(mtd?.formatter).toBe("value-creation/pr-pages/volume/div-by-brands");
    expect(ytd?.formatter).toBe("value-creation/pr-pages/volume/div-by-brands");
  });

  it("should have exactly one datasource per component", () => {
    countryViewConfig.components.forEach((c) => {
      expect(c.datasources).toHaveLength(1);
    });
  });
});

import segmentsGbPage from "@domain/config/views/value-creation/pr-pages-beer-adj/segments-gb.view";
import portfolioSegment from "@domain/config/views/value-creation/pr-pages-beer-adj/segments-gb/portfolio.view";
import tableSegment from "@domain/config/views/value-creation/pr-pages-beer-adj/segments-gb/table.view";

describe("PR Pages Beer Adj — Segments GB page view", () => {
  it("should expose filter sets and nine components", () => {
    expect(segmentsGbPage.version).toBe("1.0.0");
    expect(segmentsGbPage.filters?.default).toBeDefined();
    expect(segmentsGbPage.filters?.bigNumbers).toBeDefined();
    expect(segmentsGbPage.filters?.topBottomBrands).toBeDefined();
    expect(segmentsGbPage.components).toHaveLength(9);
  });

  it("should use volume-beer-adj datasources for all components", () => {
    segmentsGbPage.components.forEach((c) => {
      c.datasources.forEach((ds) => {
        expect(ds.name).toContain("volume-beer-adj");
      });
    });
  });
});

describe("PR Pages Beer Adj — Segments GB portfolio view", () => {
  it("should map portfolio formatter to beer-adj volume portfolio datasource", () => {
    expect(portfolioSegment.components).toHaveLength(1);
    expect(portfolioSegment.components[0].id).toBe("portfolio");
    expect(portfolioSegment.components[0].formatter).toBe(
      "value-creation/pr-pages-beer-adj/portfolio",
    );
    expect(portfolioSegment.components[0].datasources[0].name).toBe(
      "value-creation_pr-pages-beer-adj_volume_portfolio",
    );
  });
});

describe("PR Pages Beer Adj — Segments GB table view", () => {
  it("should define segments table with GB formatter", () => {
    expect(tableSegment.components).toHaveLength(1);
    expect(tableSegment.components[0].formatter).toBe(
      "value-creation/pr-pages/volume/segments-gb/segments-table",
    );
    expect(tableSegment.components[0].datasources[0].name).toBe(
      "value-creation_pr-pages_volume-beer-adj_segments-gb_table",
    );
  });
});

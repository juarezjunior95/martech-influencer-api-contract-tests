import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "../../../../../../src/infrastructure/repositories/helpers";

describe("value-creation growth-league rankings megabrands-dashboard-country formatter", () => {
  const mockInput = {
    datasources: {
      "value-creation_growth-league_rankings_megabrands-dashboard-country": [
        {
          country_iso_code_3: "USA",
          country_ranking: 1,
          country: {
            imageIcon: "https://example.com/flags/usa.png",
            imageWaving: "",
          },
          kpi_variation: "overall_result",
          score: 93.2,
          raw_brand: "Budweiser",
          brand: { imageTable: "https://example.com/brands/brand1.png" },
          dt_end: "2025-11-30T00:00:00.000Z",
        },
        {
          country_iso_code_3: "USA",
          country_ranking: 1,
          country: {
            imageIcon: "https://example.com/flags/usa.png",
            imageWaving: "",
          },
          kpi_variation: "volume",
          score: 87.5,
          raw_brand: "Budweiser",
          brand: { imageTable: "https://example.com/brands/brand1.png" },
          dt_end: "2025-11-30T00:00:00.000Z",
        },
        {
          country_iso_code_3: "BRA",
          country_ranking: 2,
          country: {
            imageIcon: "https://example.com/flags/bra.png",
            imageWaving: "",
          },
          kpi_variation: "overall_result",
          score: 88.1,
          raw_brand: "Corona",
          brand: { imageTable: "https://example.com/brands/brand2.png" },
          dt_end: "2025-11-30T00:00:00.000Z",
        },
        {
          country_iso_code_3: "BRA",
          country_ranking: 2,
          country: {
            imageIcon: "https://example.com/flags/bra.png",
            imageWaving: "",
          },
          kpi_variation: "brand_power",
          score: 81.8,
          raw_brand: "Corona",
          brand: { imageTable: "https://example.com/brands/brand2.png" },
          dt_end: "2025-09-30T00:00:00.000Z",
        },
      ],
    },
  };

  let result: any;

  beforeAll(async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/rankings/megabrands-dashboard-country.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
    result = await compiledExpression.evaluate(mockInput);
  });

  it("should output a table structure", () => {
    expect(result).toHaveProperty("table");
    expect(result.table).toHaveProperty("rows");
    expect(result.table).toHaveProperty("header");
    expect(result.table).toHaveProperty("splits");
  });

  it("should not include legacy datasources or config keys", () => {
    expect(result).not.toHaveProperty("datasources");
    expect(result).not.toHaveProperty("config");
  });

  it("should have correct header groups", () => {
    const headers = result.table.header;
    expect(headers.length).toBe(2);
    expect(headers[0].title).toBe("Leaderboard");
    expect(headers[0].children.length).toBe(2);
    expect(headers[1].title).toBe("Megabrands Dashboard");
    expect(headers[1].children.length).toBe(7);
  });

  it("should resolve header subtitles using registered helpers", () => {
    const headers = result.table.header;
    const megabrands = headers.find(
      (h: { title: string }) => h.title === "Megabrands Dashboard",
    );

    const overallResults = megabrands.children.find(
      (c: { id: string }) => c.id === "overall_results",
    );
    expect(overallResults.subtitle).toBe("Nov'25");

    const brandPower = megabrands.children.find(
      (c: { id: string }) => c.id === "brand_power",
    );
    expect(brandPower.subtitle).toBe("Q3'25");
  });

  it("should map rows correctly with pivoted KPI values", () => {
    const rows = [].concat(...result.table.rows);
    expect(rows.length).toBe(2);

    const firstRow = rows[0];
    expect(firstRow.rank).toEqual({ value: "1" });
    expect(firstRow.country.value).toBe("USA");
    expect(firstRow.country.img).toBe("https://example.com/flags/usa.png");
    expect(firstRow.brand.value).toBe("Budweiser");
    expect(firstRow.brand.img).toBe("https://example.com/brands/brand1.png");
    expect(firstRow.overall_results).toEqual({ unitMeasure: "%", value: 93.2 });
    expect(firstRow.volume).toEqual({ unitMeasure: "%", value: 87.5 });
  });

  it("should default missing KPI values to zero", () => {
    const rows = [].concat(...result.table.rows);
    const firstRow = rows[0];
    expect(firstRow.brand_power).toEqual({ value: "-" });
    expect(firstRow.net_revenue).toEqual({ value: "-" });
    expect(firstRow.market_share).toEqual({ value: "-" });
    expect(firstRow.cores).toEqual({ value: "-" });
    expect(firstRow.participation).toEqual({ value: "-" });
  });

  it("should include correct splits", () => {
    expect(result.table.splits).toEqual([
      ["leaderboard"],
      ["megabrands_dashboard"],
    ]);
  });

  it("should order rows by country_ranking", () => {
    const rows = [].concat(...result.table.rows);
    expect(rows[0].rank.value).toBe("1");
    expect(rows[0].country.value).toBe("USA");
    expect(rows[1].rank.value).toBe("2");
    expect(rows[1].country.value).toBe("BRA");
  });
});

import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "../../../../../../src/infrastructure/repositories/helpers";

describe("value-creation growth-league rankings megabrands-dashboard-brand formatter", () => {
  const mockInput = {
    datasources: {
      "value-creation_growth-league_rankings_megabrands-dashboard-brand": [
        {
          country_iso_code_3: "USA",
          country_ranking: 1,
          country: {
            imageIcon: "https://example.com/flags/usa.png",
            imageWaving: "",
          },
          kpi_variation: "overall_result",
          score: 95.5,
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
          score: 88.3,
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
          score: 90.2,
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
          score: 82.1,
          raw_brand: "Corona",
          brand: { imageTable: "https://example.com/brands/brand2.png" },
          dt_end: "2025-11-30T00:00:00.000Z",
        },
      ],
    },
  };

  let result: any;

  beforeAll(async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/rankings/megabrands-dashboard-brand.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
    result = await compiledExpression.evaluate(mockInput);
  });

  it("should output a structure with header, rows and splits", () => {
    expect(result).toHaveProperty("header");
    expect(result).toHaveProperty("rows");
    expect(result).toHaveProperty("splits");
    const rows = [].concat(...result.rows);
    expect(rows.length).toBe(2);
  });

  it("should not include legacy datasources or config keys", () => {
    expect(result).not.toHaveProperty("datasources");
    expect(result).not.toHaveProperty("config");
  });

  it("should include rank, country, and brand in each row", () => {
    const rows = [].concat(...result.rows);
    const firstRow = rows[0];
    expect(firstRow.rank).toEqual({ value: "1" });
    expect(firstRow.country.value).toBe("USA");
    expect(firstRow.country.img).toBe("https://example.com/flags/usa.png");
    expect(firstRow.brand.value).toBe("Budweiser");
    expect(firstRow.brand.img).toBe("https://example.com/brands/brand1.png");
  });

  it("should pivot KPI values correctly", () => {
    const rows = [].concat(...result.rows);
    const firstRow = rows[0];
    expect(firstRow.overall_results).toEqual({ unitMeasure: "%", value: 95.5 });
    expect(firstRow.volume).toEqual({ unitMeasure: "%", value: 88.3 });
  });

  it("should default missing KPI values to zero", () => {
    const rows = [].concat(...result.rows);
    const firstRow = rows[0];
    expect(firstRow.brand_power).toEqual({ value: "-" });
    expect(firstRow.net_revenue).toEqual({ value: "-" });
    expect(firstRow.market_share).toEqual({ value: "-" });
    expect(firstRow.cores).toEqual({ value: "-" });
    expect(firstRow.participation).toEqual({ value: "-" });
  });

  it("should order rows by country_ranking", () => {
    const rows = [].concat(...result.rows);
    expect(rows[0].rank.value).toBe("1");
    expect(rows[0].country.value).toBe("USA");
    expect(rows[1].rank.value).toBe("2");
    expect(rows[1].country.value).toBe("BRA");
  });
});

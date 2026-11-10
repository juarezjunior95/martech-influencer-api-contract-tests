import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "../../../../../../src/infrastructure/repositories/helpers";

describe("value-creation growth-league rankings ka-dashboard-league-b formatter", () => {
  const mockInput = {
    datasources: {
      "value-creation_growth-league_rankings_ka-dashboard-league-b": [
        {
          country_iso_code_3: "COL",
          country_ranking: 1,
          country: {
            imageIcon: "https://example.com/flags/col.png",
            imageWaving: "",
          },
          kpi_variation: "overall_results",
          score: 91.2,
          dt_end: "2025-11-30T00:00:00.000Z",
        },
        {
          country_iso_code_3: "COL",
          country_ranking: 1,
          country: {
            imageIcon: "https://example.com/flags/col.png",
            imageWaving: "",
          },
          kpi_variation: "service_level",
          score: 85.7,
          dt_end: "2025-11-30T00:00:00.000Z",
        },
        {
          country_iso_code_3: "ARG",
          country_ranking: 2,
          country: {
            imageIcon: "https://example.com/flags/arg.png",
            imageWaving: "",
          },
          kpi_variation: "total_achievement",
          score: 88.4,
          dt_end: "2025-11-30T00:00:00.000Z",
        },
        {
          country_iso_code_3: "ARG",
          country_ranking: 2,
          country: {
            imageIcon: "https://example.com/flags/arg.png",
            imageWaving: "",
          },
          kpi_variation: "maco_hl",
          score: 79.4,
          dt_end: "2025-11-30T00:00:00.000Z",
        },
      ],
    },
  };

  let result: any;

  beforeAll(async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/rankings/ka-dashboard-league-b.jsonata",
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
    expect(headers[1].title).toBe("KA Dashboard");
    expect(headers[1].children.length).toBe(6);
  });

  it("should map rows correctly with pivoted KPI values", () => {
    const rows = [].concat(...result.table.rows);
    expect(rows.length).toBe(2);

    const firstRow = rows[0];
    expect(firstRow.rank).toEqual({ value: "1" });
    expect(firstRow.country.value).toBe("COL");
    expect(firstRow.country.img).toBe("https://example.com/flags/col.png");
    expect(firstRow.overall_results).toEqual({ unitMeasure: "%", value: 91.2 });
    expect(firstRow.service_level).toEqual({ unitMeasure: "%", value: 85.7 });
  });

  it("should default missing KPI values to zero", () => {
    const rows = [].concat(...result.table.rows);
    const firstRow = rows[0];
    expect(firstRow.maco_hl).toEqual({ value: "-" });
    expect(firstRow.share_of_shelf_cooler).toEqual({
      value: "-",
    });
    expect(firstRow.market_share).toEqual({
      value: "-",
    });
    expect(firstRow.advantage).toEqual({ value: "-" });
  });

  it("should include correct splits", () => {
    expect(result.table.splits).toEqual([["leaderboard"], ["ka_dashboard"]]);
  });

  it("should order rows by country_ranking", () => {
    const rows = [].concat(...result.table.rows);
    expect(rows[0].rank.value).toBe("1");
    expect(rows[0].country.value).toBe("COL");
    expect(rows[1].rank.value).toBe("2");
    expect(rows[1].country.value).toBe("ARG");
  });
});

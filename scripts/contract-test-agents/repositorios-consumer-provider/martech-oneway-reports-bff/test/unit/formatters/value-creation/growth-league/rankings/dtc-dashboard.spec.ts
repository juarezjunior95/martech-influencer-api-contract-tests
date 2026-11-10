import { loadCompiledJsonata } from "../../../../../helpers/jsonata";

describe("value-creation growth-league rankings dtc-dashboard formatter", () => {
  const jsonataPath =
    "src/infrastructure/formatters/value-creation/growth-league/rankings/dtc-dashboard.jsonata";
  let compiledExpression: ReturnType<typeof loadCompiledJsonata>;

  beforeAll(() => {
    compiledExpression = loadCompiledJsonata(jsonataPath);
  });

  const mockInput = {
    datasources: {
      "value-creation_growth-league_rankings_dtc-dashboard": [
        {
          raw_geography: "USA",
          country_ranking: "1",
          country: {
            imageIcon: "https://example.com/flags/usa.png",
            imageWaving: "",
          },
          dt_end: "2025-11-30T00:00:00.000Z",
          kpi_variation: "overall_result",
          cup: "dtc_cup",
          cup_breakdown: "tier_1",
          score: 95.5,
        },
        {
          raw_geography: "USA",
          country_ranking: "1",
          country: {
            imageIcon: "https://example.com/flags/usa.png",
            imageWaving: "",
          },
          dt_end: "2025-11-30T00:00:00.000Z",
          kpi_variation: "dtc_gmv",
          cup: "dtc_cup",
          cup_breakdown: "tier_1",
          score: 80.2,
        },
        {
          raw_geography: "BRA",
          country_ranking: "2",
          country: {
            imageIcon: "https://example.com/flags/bra.png",
            imageWaving: "",
          },
          dt_end: "2025-11-30T00:00:00.000Z",
          kpi_variation: "overall_result",
          cup: "dtc_cup",
          cup_breakdown: "tier_1",
          score: 90.2,
        },
      ],
    },
  };

  it("should transform data correctly with header, rows and splits", async () => {
    const result = await compiledExpression.evaluate(mockInput);

    expect(result).toHaveProperty("header");
    expect(result).toHaveProperty("rows");
    expect(result).toHaveProperty("splits");
    expect(Array.isArray(result.header)).toBe(true);
    expect(Array.isArray(result.rows)).toBe(true);
    expect(Array.isArray(result.splits)).toBe(true);
  });

  it("should have correct header structure", async () => {
    const result = await compiledExpression.evaluate(mockInput);

    const leaderboard = result.header[0];
    expect(leaderboard.title).toBe("Leaderboard");
    expect(leaderboard.children.length).toBe(2);

    const dtcDashboard = result.header[1];
    expect(dtcDashboard.title).toBe("DTC Dashboard");
    expect(dtcDashboard.children.length).toBe(5);
  });

  it("should map rows correctly with pivoted KPI values", async () => {
    const result = await compiledExpression.evaluate(mockInput);

    const rows = [].concat(...result.rows);
    expect(rows.length).toBe(2);

    const firstRow = rows[0];
    expect(firstRow.rank.value).toBe("1");
    expect(firstRow.country.value).toBe("USA");
    expect(firstRow.country.img).toBe("https://example.com/flags/usa.png");
    expect(firstRow.overall_result.value).toBe(95.5);
    expect(firstRow.dtc_gmv.value).toBe(80.2);
    expect(firstRow.digital_orders.value).toBe("-");
    expect(firstRow.consumer_nps.value).toBe("-");
  });

  it("should resolve header subtitles using $formatDateToMonth", async () => {
    const result = await compiledExpression.evaluate(mockInput);

    const dtcDashboard = result.header[1];
    dtcDashboard.children.forEach((child: { subtitle: string }) => {
      expect(child.subtitle).toBe("Nov'25");
    });
  });

  it("should include correct splits configuration", async () => {
    const result = await compiledExpression.evaluate(mockInput);

    expect(result.splits).toEqual([["Leaderboard"], ["DTC Dashboard"]]);
  });

  it("should add borderGroupBottom to the last row", async () => {
    const result = await compiledExpression.evaluate(mockInput);

    const rows = [].concat(...result.rows);
    const lastRow = rows[rows.length - 1];
    expect(lastRow.rank.borderGroupBottom).toBe(true);
    expect(lastRow.country.borderGroupBottom).toBe(true);
    expect(lastRow.overall_result.borderGroupBottom).toBe(true);
  });
});

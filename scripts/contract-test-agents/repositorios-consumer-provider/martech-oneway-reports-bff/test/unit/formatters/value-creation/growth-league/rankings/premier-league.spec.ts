import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "../../../../../../src/infrastructure/repositories/helpers";

describe("value-creation growth-league rankings premier-league formatter", () => {
  const kpis = [
    "overall_result",
    "cashflow",
    "total_abi_volume",
    "beer_share",
    "brand_power",
    "mega_brands_dashboard",
    "nps",
    "channel_dashboard",
    "corona_volume",
    "non_alc_beer_volume",
    "participation",
    "core_sos",
    "premium_sos",
    "beyond_beer_volume",
    "bees_dashboard",
    "dtc_dashboard",
    "portfolio_health_index",
    "engagement",
  ];

  const kpiDates: Record<string, string> = {
    brand_power: "2025-09-30",
    participation: "2025-09-30",
    beer_share: "2025-10-31",
  };
  const defaultDate = "2025-11-30";

  const makeRow = (
    country: string,
    ranking: number,
    kpi: string,
    score: number,
  ) => ({
    country_iso_code_3: country,
    country_ranking: ranking,
    kpi_variation: kpi,
    score,
    dt_ini: "2025-01-01",
    dt_end: kpiDates[kpi] ?? defaultDate,
    version_id: 105,
    league_name: "Premier League",
    country_images: {
      imageIcon: `https://example.com/flags/${country.toLowerCase()}.png`,
    },
  });

  const mockInput = {
    datasources: {
      "value-creation_growth-league_rankings_premier-league": [
        ...kpis.map((kpi, i) => makeRow("COL", 1, kpi, 90 + i)),
        ...kpis.map((kpi, i) => makeRow("ARG", 2, kpi, 80 + i)),
      ],
    },
  };

  let result: any;

  beforeAll(async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/rankings/premier-league.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
    result = await compiledExpression.evaluate(mockInput);
  });

  it("should output kpiData.table structure", () => {
    expect(result).toHaveProperty("kpiData");
    expect(result.kpiData).toHaveProperty("table");
    expect(result.kpiData.table).toHaveProperty("header");
    expect(result.kpiData.table).toHaveProperty("rows");
    expect(result.kpiData.table).toHaveProperty("splits");
  });

  it("should not include legacy datasources or config keys", () => {
    expect(result).not.toHaveProperty("datasources");
    expect(result).not.toHaveProperty("config");
  });

  it("should have correct header groups", () => {
    const titles = result.kpiData.table.header.map(
      (h: { title: string }) => h.title,
    );
    expect(titles).toEqual([
      "Leaderboard",
      "Total",
      "Hero",
      "Enabler",
      "Performance",
    ]);
  });

  it("should resolve header subtitles from kpi_variation dt_end", () => {
    const overallResults = result.kpiData.table.header.find(
      (h: { title: string }) => h.title === "Hero",
    );
    expect(overallResults.children[0].subtitle).toBe("Nov'25");

    const brandPower = overallResults.children.find(
      (c: { id: string }) => c.id === "brand_power",
    );
    expect(brandPower.subtitle).toBe("Q3'25");

    const beerShare = overallResults.children.find(
      (c: { id: string }) => c.id === "beer_share",
    );
    expect(beerShare.subtitle).toBe("Oct'25");
  });

  it("should have rows as a flat array with correct country count", () => {
    const rows = [].concat(...result.kpiData.table.rows);
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBe(2);
  });

  it("should include rank and country in each row", () => {
    const rows = [].concat(...result.kpiData.table.rows);
    const firstRow = rows[0];
    expect(firstRow.rank).toEqual({ value: "1" });
    expect(firstRow.country.value).toBe("COL");
    expect(firstRow.country.img).toBe("https://example.com/flags/col.png");
  });

  it("should order rows by country_ranking", () => {
    const rows = [].concat(...result.kpiData.table.rows);
    expect(rows[0].rank.value).toBe("1");
    expect(rows[0].country.value).toBe("COL");
    expect(rows[1].rank.value).toBe("2");
    expect(rows[1].country.value).toBe("ARG");
  });

  it("should pivot KPI values from long-format data into row cells", () => {
    const rows = [].concat(...result.kpiData.table.rows);
    const firstRow = rows[0];

    kpis.forEach((kpi, i) => {
      expect(firstRow).toHaveProperty(kpi);
      expect(firstRow[kpi]).toEqual({ unitMeasure: "%", value: 90 + i });
    });
  });

  it("should include correct splits", () => {
    expect(result.kpiData.table.splits).toEqual([
      ["Leaderboard"],
      ["Total"],
      ["Hero"],
      ["Enabler"],
      ["Performance"],
    ]);
  });

  it("should include every header KPI key on each row, filling missing values with dash", async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/rankings/premier-league.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);

    const sparseInput = {
      datasources: {
        "value-creation_growth-league_rankings_premier-league": [
          {
            country_iso_code_3: "COL",
            country_ranking: 1,
            kpi_variation: "cashflow",
            score: 42,
            dt_end: "2025-11-30T00:00:00.000Z",
            country_images: { imageIcon: "https://example.com/flags/col.png" },
          },
        ],
      },
    };

    const sparseResult = await compiledExpression.evaluate(sparseInput);
    const row = [].concat(...sparseResult.kpiData.table.rows)[0] as Record<
      string,
      { unitMeasure: string; value: number | string }
    >;

    const headerKpiIds = sparseResult.kpiData.table.header
      .filter((h: { title: string }) => h.title !== "Leaderboard")
      .flatMap((h: { children: { id: string }[] }) =>
        h.children.map((c: { id: string }) => c.id),
      );

    expect(headerKpiIds.length).toBeGreaterThan(0);
    headerKpiIds.forEach((id: string) => {
      expect(row).toHaveProperty(id);
    });
    expect(row.cashflow).toEqual({ unitMeasure: "%", value: 42 });
    expect(row.overall_result).toEqual({ unitMeasure: "", value: "-" });
  });
});

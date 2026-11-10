import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "../../../../../../src/infrastructure/repositories/helpers";

describe("value-creation growth-league rankings bees-dashboard-maturity-index formatter", () => {
  const mockInput = {
    datasources: {
      "value-creation_growth-league_rankings_bees-dashboard-maturity-index": [
        {
          country_iso_code_3: "USA",
          country_ranking: 1,
          country: {
            imageIcon: "https://example.com/flags/usa.png",
            imageWaving: "",
          },
          kpi_variation: "overall_result",
          score: 95.5,
          dt_end: "2025-11-30T00:00:00.000Z",
        },
        {
          country_iso_code_3: "USA",
          country_ranking: 1,
          country: {
            imageIcon: "https://example.com/flags/usa.png",
            imageWaving: "",
          },
          kpi_variation: "personalization",
          score: 88.3,
          dt_end: "2025-11-30T00:00:00.000Z",
        },
        {
          country_iso_code_3: "USA",
          country_ranking: 1,
          country: {
            imageIcon: "https://example.com/flags/usa.png",
            imageWaving: "",
          },
          kpi_variation: "incremental_conversion",
          score: 92.1,
          dt_end: "2025-11-30T00:00:00.000Z",
        },
        {
          country_iso_code_3: "USA",
          country_ranking: 1,
          country: {
            imageIcon: "https://example.com/flags/usa.png",
            imageWaving: "",
          },
          kpi_variation: "monetization_ebitda",
          score: 83.2,
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
          dt_end: "2025-11-30T00:00:00.000Z",
        },
      ],
    },
  };

  it("should transform data correctly with columnDefs, rowData and splits", async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/rankings/bees-dashboard-maturity-index.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);

    const result = await compiledExpression.evaluate(mockInput);

    // Validate structure
    expect(result).toHaveProperty("columnDefs");
    expect(result).toHaveProperty("rowData");
    expect(result).toHaveProperty("splits");
    expect(Array.isArray(result.columnDefs)).toBe(true);
    expect(Array.isArray(result.rowData)).toBe(true);
    expect(Array.isArray(result.splits)).toBe(true);
  });

  it("should have correct column definitions structure", async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/rankings/bees-dashboard-maturity-index.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);

    const result = await compiledExpression.evaluate(mockInput);

    // Check Leaderboard group
    const leaderboardGroup = result.columnDefs.find(
      (col: { headerName: string }) => col.headerName === "Leaderboard",
    );
    expect(leaderboardGroup).toBeDefined();
    expect(leaderboardGroup.children).toBeDefined();
    expect(leaderboardGroup.children.length).toBe(2);

    // Check BEES Dashboard group
    const beesGroup = result.columnDefs.find(
      (col: { headerName: string }) => col.headerName === "BEES Dashboard",
    );
    expect(beesGroup).toBeDefined();
    expect(beesGroup.children).toBeDefined();
    expect(beesGroup.children.length).toBeGreaterThan(0);
  });

  it("should map rowData correctly with country_config and flag", async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/rankings/bees-dashboard-maturity-index.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.rowData.length).toBe(2);

    const firstRow = result.rowData[0];
    expect(firstRow.rank).toBe("1");
    expect(firstRow.country).toBe("USA");
    expect(firstRow.country_config).toBeDefined();
    expect(firstRow.country_config.leftImg).toBe(
      "https://example.com/flags/usa.png",
    );
  });

  it("should resolve header subtitles from dt_end on the first row whose kpi_variation matches each column field", async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/rankings/bees-dashboard-maturity-index.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);

    const result = await compiledExpression.evaluate(mockInput);

    const beesGroup = result.columnDefs.find(
      (col: { headerName: string }) => col.headerName === "BEES Dashboard",
    );
    const expectedSubtitle = "Nov'25";
    const fieldsWithMockKpiRow = new Set([
      "overall_result",
      "personalization",
      "incremental_conversion",
    ]);

    beesGroup.children.forEach(
      (child: {
        field: string;
        headerComponentParams?: { subtitle?: string };
      }) => {
        if (fieldsWithMockKpiRow.has(child.field)) {
          expect(child.headerComponentParams?.subtitle).toBe(expectedSubtitle);
        } else {
          expect(child.headerComponentParams?.subtitle).toBeUndefined();
        }
      },
    );
  });

  it("should omit column subtitles when every row for that KPI has a null score", async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/rankings/bees-dashboard-maturity-index.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);

    const nullOnlyScoreInput = {
      datasources: {
        "value-creation_growth-league_rankings_bees-dashboard-maturity-index": [
          {
            country_iso_code_3: "USA",
            country_ranking: 1,
            country: {
              imageIcon: "https://example.com/flags/usa.png",
              imageWaving: "",
            },
            kpi_variation: "overall_result",
            score: null,
            dt_end: "2025-11-30T00:00:00.000Z",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(nullOnlyScoreInput);
    const beesGroup = result.columnDefs.find(
      (col: { headerName: string }) => col.headerName === "BEES Dashboard",
    );
    const totalCol = beesGroup.children.find(
      (c: { field: string }) => c.field === "overall_result",
    );
    expect(totalCol.headerComponentParams?.subtitle).toBeUndefined();
  });

  it("should include correct splits configuration", async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/rankings/bees-dashboard-maturity-index.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.splits).toEqual([["Leaderboard"], ["BEES Dashboard"]]);
  });

  it("should preserve all original data fields in rowData", async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/growth-league/rankings/bees-dashboard-maturity-index.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);

    const result = await compiledExpression.evaluate(mockInput);

    const firstRow = result.rowData[0];
    expect(firstRow.overall_result).toBe(95.5);
    expect(firstRow.personalization).toBe(88.3);
    expect(firstRow.incremental_conversion).toBe(92.1);
    expect(firstRow.monetization_ebitda).toBe(83.2);
  });
});

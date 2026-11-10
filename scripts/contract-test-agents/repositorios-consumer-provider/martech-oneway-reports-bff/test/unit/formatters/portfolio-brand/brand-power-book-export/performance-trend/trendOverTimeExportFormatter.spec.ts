import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("trendOverTimeExportFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book-export/performance-trend/trendOverTimeExportFormatter.jsonata",
  );

  const DS_KEY =
    "portfolio-brand_brand-power-book_overview_power-performance-trend_by-trend-over-time";

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiledExpression);
  });

  const evaluate = (data: any[]) =>
    compiledExpression.evaluate({ datasources: { [DS_KEY]: data } });

  const buildRow = (overrides: Record<string, any> = {}) => ({
    dt_ini: "2024-01-01T00:00:00.000Z",
    ac: 52,
    ac_vs_ly: 0.5,
    variationDirectionVsLy: "up",
    ...overrides,
  });

  it("should return empty flag when datasource is empty", async () => {
    const result = await evaluate([]);
    expect(result).toEqual({ empty: true });
  });

  it("should return empty flag when datasource key is missing", async () => {
    const result = await compiledExpression.evaluate({ datasources: {} });
    expect(result).toEqual({ empty: true });
  });

  it("should format quarterly labels as QN'YY", async () => {
    const rows = [
      buildRow({ dt_ini: "2025-01-01T00:00:00.000Z", ac: 53.0 }),
      buildRow({ dt_ini: "2025-04-01T00:00:00.000Z", ac: 53.1 }),
      buildRow({ dt_ini: "2025-07-01T00:00:00.000Z", ac: 53.2 }),
      buildRow({ dt_ini: "2025-10-01T00:00:00.000Z", ac: 53.4 }),
    ];

    const result: any = await evaluate(rows);

    expect(result.labels).toEqual(["Q1'25", "Q2'25", "Q3'25", "Q4'25"]);
  });

  it("should sort rows by dt_ini ascending", async () => {
    const rows = [
      buildRow({ dt_ini: "2025-10-01T00:00:00.000Z", ac: 53.4 }),
      buildRow({ dt_ini: "2025-01-01T00:00:00.000Z", ac: 53.0 }),
      buildRow({ dt_ini: "2025-07-01T00:00:00.000Z", ac: 53.2 }),
    ];

    const result: any = await evaluate(rows);

    expect(result.values).toEqual([53.0, 53.2, 53.4]);
    expect(result.labels).toEqual(["Q1'25", "Q3'25", "Q4'25"]);
  });

  it("should apply DR threshold color for years <= 2021", async () => {
    const rows = [
      buildRow({ dt_ini: "2020-01-01T00:00:00.000Z", ac: 49.0 }),
      buildRow({ dt_ini: "2021-04-01T00:00:00.000Z", ac: 49.5 }),
      buildRow({ dt_ini: "2022-01-01T00:00:00.000Z", ac: 51.0 }),
      buildRow({ dt_ini: "2023-01-01T00:00:00.000Z", ac: 52.0 }),
    ];

    const result: any = await evaluate(rows);

    expect(result.backgroundColor).toEqual([
      "#D3E3EE", // 2020 <= 21
      "#D3E3EE", // 2021 <= 21
      "#EDDAB1", // 2022 > 21 → Prev. Quarters
      "#D1A33C", // 2023 → last item → AC. Quarter
    ]);
  });

  it("should compute min/max from ac values", async () => {
    const rows = [
      buildRow({ dt_ini: "2023-01-01T00:00:00.000Z", ac: 48.7 }),
      buildRow({ dt_ini: "2024-01-01T00:00:00.000Z", ac: 55.0 }),
      buildRow({ dt_ini: "2025-01-01T00:00:00.000Z", ac: 50.0 }),
    ];

    const result: any = await evaluate(rows);

    expect(result.min).toBe(48.7);
    expect(result.max).toBe(55.0);
  });

  it("should build connector when at least 5 quarters exist", async () => {
    const rows = [
      buildRow({ dt_ini: "2024-01-01T00:00:00.000Z", ac: 52.9 }),
      buildRow({ dt_ini: "2024-04-01T00:00:00.000Z", ac: 52.9 }),
      buildRow({ dt_ini: "2024-07-01T00:00:00.000Z", ac: 53.1 }),
      buildRow({ dt_ini: "2024-10-01T00:00:00.000Z", ac: 52.9 }),
      buildRow({
        dt_ini: "2025-10-01T00:00:00.000Z",
        ac: 53.4,
        ac_vs_ly: 0.6,
        variationDirectionVsLy: "up",
      }),
    ];

    const result: any = await evaluate(rows);

    expect(result.connector).toEqual({
      from: "Q1'24",
      to: "Q4'25",
      value: 0.6,
      backgroundColor: "#E6F9E6",
      textColor: "#007800",
      measure: "pp",
    });
  });

  it("should span connector from count-5 to count-1", async () => {
    const rows = [
      buildRow({ dt_ini: "2024-01-01T00:00:00.000Z", ac: 52.0 }),
      buildRow({ dt_ini: "2024-04-01T00:00:00.000Z", ac: 52.5 }),
      buildRow({ dt_ini: "2024-07-01T00:00:00.000Z", ac: 53.0 }),
      buildRow({ dt_ini: "2024-10-01T00:00:00.000Z", ac: 52.8 }),
      buildRow({ dt_ini: "2025-01-01T00:00:00.000Z", ac: 53.0 }),
      buildRow({ dt_ini: "2025-04-01T00:00:00.000Z", ac: 53.1 }),
      buildRow({ dt_ini: "2025-07-01T00:00:00.000Z", ac: 53.3 }),
      buildRow({
        dt_ini: "2025-10-01T00:00:00.000Z",
        ac: 53.4,
        ac_vs_ly: 0.6,
        variationDirectionVsLy: "up",
      }),
    ];

    const result: any = await evaluate(rows);

    expect(result.connector.from).toBe("Q4'24");
    expect(result.connector.to).toBe("Q4'25");
  });

  it("should return null connector when fewer than 5 quarters", async () => {
    const rows = [
      buildRow({ dt_ini: "2024-01-01T00:00:00.000Z", ac: 52.0 }),
      buildRow({ dt_ini: "2024-04-01T00:00:00.000Z", ac: 52.5 }),
      buildRow({
        dt_ini: "2024-07-01T00:00:00.000Z",
        ac: 53.0,
        ac_vs_ly: 1.0,
      }),
    ];

    const result: any = await evaluate(rows);

    expect(result.connector).toBeNull();
  });

  it("should return null connector when ac_vs_ly is not a number", async () => {
    const rows = Array.from({ length: 5 }, (_, i) =>
      buildRow({
        dt_ini: `2024-0${i + 1}-01T00:00:00.000Z`,
        ac: 50 + i,
        ac_vs_ly: i === 4 ? null : 0.5,
      }),
    );

    const result: any = await evaluate(rows);

    expect(result.connector).toBeNull();
  });

  it("should use down direction colors when variationDirectionVsLy is down", async () => {
    const rows = Array.from({ length: 5 }, (_, i) =>
      buildRow({
        dt_ini: `2024-0${i + 1}-01T00:00:00.000Z`,
        ac: 55 - i,
        ac_vs_ly: i === 4 ? -2.0 : 0.5,
        variationDirectionVsLy: i === 4 ? "down" : "up",
      }),
    );

    const result: any = await evaluate(rows);

    expect(result.connector.backgroundColor).toBe("#FFE6E6");
    expect(result.connector.textColor).toBe("#BA0B0B");
  });

  it("should include legend and legendPeriod", async () => {
    const result: any = await evaluate([
      buildRow({ dt_ini: "2025-01-01T00:00:00.000Z", ac: 53 }),
    ]);

    expect(result.legend).toEqual([
      { label: "DR not in the survey", color: "#D3E3EE" },
      { label: "Prev. Quarters", color: "#EDDAB1" },
      { label: "AC. Quarter", color: "#D1A33C" },
    ]);
    expect(result.legendPeriod).toBe("Quarterly");
  });

  it("should return empty variationCaptions", async () => {
    const result: any = await evaluate([
      buildRow({ dt_ini: "2025-01-01T00:00:00.000Z", ac: 53 }),
    ]);

    expect(result.variationCaptions).toEqual([]);
  });
});

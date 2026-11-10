import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("yearPowerVsAcExportFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book-export/performance-trend/yearPowerVsAcExportFormatter.jsonata",
  );

  const DS_KEY =
    "portfolio-brand_brand-power-book_overview_power-performance-trend_by-year-power-ac";

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiledExpression);
  });

  const evaluate = async (data: any[]) => {
    const raw = await compiledExpression.evaluate({
      datasources: { [DS_KEY]: data },
    });
    return JSON.parse(JSON.stringify(raw));
  };

  const buildRow = (overrides: Record<string, any> = {}) => ({
    dt_ini: "2023-01-01T00:00:00.000Z",
    ac: 52,
    ac_vs_previous_year: 0.5,
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

  it("should format a single yearly row correctly", async () => {
    const result: any = await evaluate([
      buildRow({ dt_ini: "2025-01-01T00:00:00.000Z", ac: 53.3 }),
    ]);

    expect(result.values).toEqual([53.3]);
    expect(result.labels).toEqual(["FY'25"]);
    expect(result.min).toBe(53.3);
    expect(result.max).toBe(53.3);
    expect(result.backgroundColor).toEqual(["#D1A33C"]);
    expect(result.variationCaptions).toEqual([]);
    expect(result.connector).toBeNull();
    expect(result.legendPeriod).toBe("FY");
  });

  it("should sort rows by dt_ini ascending and map values/labels", async () => {
    const rows = [
      buildRow({ dt_ini: "2025-01-01T00:00:00.000Z", ac: 53.3 }),
      buildRow({ dt_ini: "2023-01-01T00:00:00.000Z", ac: 52.0 }),
      buildRow({ dt_ini: "2024-01-01T00:00:00.000Z", ac: 52.9 }),
    ];

    const result: any = await evaluate(rows);

    expect(result.values).toEqual([52.0, 52.9, 53.3]);
    expect(result.labels).toEqual(["FY'23", "FY'24", "FY'25"]);
  });

  it("should apply DR threshold color for years <= 2021", async () => {
    const rows = [
      buildRow({ dt_ini: "2019-01-01T00:00:00.000Z", ac: 50.2 }),
      buildRow({ dt_ini: "2020-01-01T00:00:00.000Z", ac: 50.5 }),
      buildRow({ dt_ini: "2021-01-01T00:00:00.000Z", ac: 50.8 }),
      buildRow({ dt_ini: "2022-01-01T00:00:00.000Z", ac: 51.5 }),
      buildRow({ dt_ini: "2023-01-01T00:00:00.000Z", ac: 52.0 }),
      buildRow({ dt_ini: "2024-01-01T00:00:00.000Z", ac: 52.9 }),
      buildRow({ dt_ini: "2025-01-01T00:00:00.000Z", ac: 53.3 }),
    ];

    const result: any = await evaluate(rows);

    expect(result.backgroundColor).toEqual([
      "#D3E3EE", // 2019 <= 21 → DR not in survey
      "#D3E3EE", // 2020 <= 21
      "#D3E3EE", // 2021 <= 21
      "#EDDAB1", // 2022 > 21 → Prev. Quarters
      "#EDDAB1", // 2023
      "#EDDAB1", // 2024
      "#D1A33C", // 2025 → last item → AC. Quarter
    ]);
  });

  it("should compute min from smallest positive distinct ac value", async () => {
    const rows = [
      buildRow({ dt_ini: "2023-01-01T00:00:00.000Z", ac: 52 }),
      buildRow({ dt_ini: "2024-01-01T00:00:00.000Z", ac: 50 }),
      buildRow({ dt_ini: "2025-01-01T00:00:00.000Z", ac: 55 }),
    ];

    const result: any = await evaluate(rows);

    expect(result.min).toBe(50);
    expect(result.max).toBe(55);
  });

  it("should build connector from the two last yearly rows with up direction", async () => {
    const rows = [
      buildRow({
        dt_ini: "2024-01-01T00:00:00.000Z",
        ac: 52.9,
        ac_vs_previous_year: 0.1,
        variationDirectionVsLy: "up",
      }),
      buildRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        ac: 53.3,
        ac_vs_previous_year: 0.4,
        variationDirectionVsLy: "up",
      }),
    ];

    const result: any = await evaluate(rows);

    expect(result.connector).toEqual({
      from: "FY'24",
      to: "FY'25",
      value: 0.4,
      backgroundColor: "#E6F9E6",
      textColor: "#007800",
      measure: "pp",
    });
  });

  it("should build connector with down direction colors", async () => {
    const rows = [
      buildRow({ dt_ini: "2024-01-01T00:00:00.000Z", ac: 52.9 }),
      buildRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        ac: 52.0,
        ac_vs_previous_year: -0.9,
        variationDirectionVsLy: "down",
      }),
    ];

    const result: any = await evaluate(rows);

    expect(result.connector).toEqual({
      from: "FY'24",
      to: "FY'25",
      value: -0.9,
      backgroundColor: "#FFE6E6",
      textColor: "#BA0B0B",
      measure: "pp",
    });
  });

  it("should return null connector when ac_vs_previous_year is not a number", async () => {
    const rows = [
      buildRow({ dt_ini: "2024-01-01T00:00:00.000Z", ac: 52.9 }),
      buildRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        ac: 53.3,
        ac_vs_previous_year: null,
      }),
    ];

    const result: any = await evaluate(rows);

    expect(result.connector).toBeNull();
  });

  it("should include legend with three entries", async () => {
    const result: any = await evaluate([
      buildRow({ dt_ini: "2025-01-01T00:00:00.000Z", ac: 53 }),
    ]);

    expect(result.legend).toEqual([
      { label: "DR not in the survey", color: "#D3E3EE" },
      { label: "Prev. Quarters", color: "#EDDAB1" },
      { label: "AC. Quarter", color: "#D1A33C" },
    ]);
  });
});

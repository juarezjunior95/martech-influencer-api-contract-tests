import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("yearPowerAcFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book/overview/power-book-overview/yearPowerAcFormatter.jsonata",
  );

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
  });

  const evaluate = async (powerMixRows: any[], yearAcRows: any[]) => {
    const raw = await compiledExpression.evaluate({
      datasources: { mix_ds: powerMixRows, year_ac_ds: yearAcRows },
    });
    return JSON.parse(JSON.stringify(raw));
  };

  const buildYearRow = (overrides: Record<string, any> = {}) => ({
    dt_ini: "2024-01-01T00:00:00.000Z",
    dt_end: "2024-12-01T00:00:00.000Z",
    ac: 52.9,
    ac_vs_ly: 0.4,
    ac_vs_previous_year: 0.4,
    variationDirectionVsLy: "up",
    ...overrides,
  });

  const buildMixRow = (overrides: Record<string, any> = {}) => ({
    dt_ini: "2024-01-01T00:00:00.000Z",
    value: 45.0,
    ac: 45.0,
    ...overrides,
  });

  it("should return empty flag when year datasource is empty", async () => {
    const result = await evaluate([], []);
    expect(result).toEqual({ empty: true });
  });

  it("should map yearly data to chart values and FY labels", async () => {
    const yearRows = [
      buildYearRow({
        dt_ini: "2023-01-01T00:00:00.000Z",
        dt_end: "2023-12-01T00:00:00.000Z",
        ac: 52.0,
      }),
      buildYearRow({
        dt_ini: "2024-01-01T00:00:00.000Z",
        dt_end: "2024-12-01T00:00:00.000Z",
        ac: 52.9,
      }),
      buildYearRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-12-01T00:00:00.000Z",
        ac: 53.3,
      }),
    ];

    const result = await evaluate([], yearRows);

    expect(result.values).toEqual([52.0, 52.9, 53.3]);
    expect(result.labels).toEqual(["FY'23", "FY'24", "FY'25"]);
  });

  it("should use quarter label for partial year (YTD)", async () => {
    const yearRows = [
      buildYearRow({
        dt_ini: "2024-01-01T00:00:00.000Z",
        dt_end: "2024-12-01T00:00:00.000Z",
        ac: 52.9,
      }),
      buildYearRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-12-01T00:00:00.000Z",
        ac: 53.5,
      }),
      buildYearRow({
        dt_ini: "2026-01-01T00:00:00.000Z",
        dt_end: "2026-03-01T00:00:00.000Z",
        ac: 52.7,
      }),
    ];

    const result = await evaluate([], yearRows);

    expect(result.labels).toEqual(["FY'24", "FY'25", "Q1'26"]);
  });

  it("should apply default color for all bars except latest", async () => {
    const yearRows = [
      buildYearRow({
        dt_ini: "2024-01-01T00:00:00.000Z",
        dt_end: "2024-12-01T00:00:00.000Z",
        ac: 52,
      }),
      buildYearRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-12-01T00:00:00.000Z",
        ac: 53,
      }),
    ];

    const result = await evaluate([], yearRows);

    expect(result.backgroundColor).toEqual(["#EDDAB1", "#D1A33C"]);
  });

  it("should build connector from the two last yearly rows", async () => {
    const yearRows = [
      buildYearRow({
        dt_ini: "2024-01-01T00:00:00.000Z",
        dt_end: "2024-12-01T00:00:00.000Z",
        ac: 52.9,
      }),
      buildYearRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-12-01T00:00:00.000Z",
        ac: 53.3,
        ac_vs_previous_year: 0.4,
      }),
    ];

    const result = await evaluate([], yearRows);

    expect(result.connector).toEqual({
      from: "FY'24",
      to: "FY'25",
      value: 0.4,
      backgroundColor: "#E6F9E6",
      textColor: "#007800",
      measure: "pp",
    });
  });

  it("should use down connector colors when ac_vs_previous_year is negative", async () => {
    const yearRows = [
      buildYearRow({
        dt_ini: "2024-01-01T00:00:00.000Z",
        dt_end: "2024-12-01T00:00:00.000Z",
        ac: 52.9,
      }),
      buildYearRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-12-01T00:00:00.000Z",
        ac: 52.0,
        ac_vs_previous_year: -0.9,
      }),
    ];

    const result = await evaluate([], yearRows);

    expect(result.connector.backgroundColor).toBe("#FFE6E6");
    expect(result.connector.textColor).toBe("#BA0B0B");
  });

  it("should not include connector with only one year", async () => {
    const yearRows = [
      buildYearRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-12-01T00:00:00.000Z",
        ac: 53,
      }),
    ];

    const result = await evaluate([], yearRows);

    expect(result.connector).toBeUndefined();
  });

  it("should build variationCaptions from power mix rows", async () => {
    const mixRows = [
      buildMixRow({ dt_ini: "2023-01-01T00:00:00.000Z", value: 44.0 }),
      buildMixRow({ dt_ini: "2024-01-01T00:00:00.000Z", value: 45.5 }),
    ];
    const yearRows = [
      buildYearRow({
        dt_ini: "2023-01-01T00:00:00.000Z",
        dt_end: "2023-12-01T00:00:00.000Z",
        ac: 52,
      }),
      buildYearRow({
        dt_ini: "2024-01-01T00:00:00.000Z",
        dt_end: "2024-12-01T00:00:00.000Z",
        ac: 53,
      }),
    ];

    const result = await evaluate(mixRows, yearRows);

    expect(result.variationCaptions).toHaveLength(1);
    expect(result.variationCaptions[0].title).toBe("Mix of Total Power");
    expect(result.variationCaptions[0].subtitle).toBe("%");
    expect(result.variationCaptions[0].data).toHaveLength(2);
    expect(result.variationCaptions[0].data[0].value).toBe(44.0);
  });

  it("should return empty variationCaptions when no mix data", async () => {
    const yearRows = [
      buildYearRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-12-01T00:00:00.000Z",
        ac: 53,
      }),
    ];

    const result = await evaluate([], yearRows);

    expect(result.variationCaptions).toEqual([]);
  });

  it("should fallback mix value to ac when value is null", async () => {
    const mixRows = [
      buildMixRow({
        dt_ini: "2023-01-01T00:00:00.000Z",
        value: null,
        ac: 42.5,
      }),
      buildMixRow({
        dt_ini: "2024-01-01T00:00:00.000Z",
        value: 45.0,
        ac: 45.0,
      }),
    ];
    const yearRows = [
      buildYearRow({
        dt_ini: "2023-01-01T00:00:00.000Z",
        dt_end: "2023-12-01T00:00:00.000Z",
        ac: 52,
      }),
      buildYearRow({
        dt_ini: "2024-01-01T00:00:00.000Z",
        dt_end: "2024-12-01T00:00:00.000Z",
        ac: 53,
      }),
    ];

    const result = await evaluate(mixRows, yearRows);

    expect(result.variationCaptions[0].data[0].value).toBe(42.5);
    expect(result.variationCaptions[0].data[1].value).toBe(45.0);
  });
});

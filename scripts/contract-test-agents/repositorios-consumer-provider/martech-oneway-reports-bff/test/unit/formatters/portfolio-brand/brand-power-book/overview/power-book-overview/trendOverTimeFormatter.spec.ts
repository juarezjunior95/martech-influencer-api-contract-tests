import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("trendOverTimeFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book/overview/power-book-overview/trendOverTimeFormatter.jsonata",
  );

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
  });

  const evaluate = async (powerMixRows: any[], trendRows: any[]) => {
    const raw = await compiledExpression.evaluate({
      datasources: { mix_ds: powerMixRows, trend_ds: trendRows },
    });
    return JSON.parse(JSON.stringify(raw));
  };

  const buildTrendRow = (overrides: Record<string, any> = {}) => ({
    dt_ini: "2025-07-01T00:00:00.000Z",
    dt_end: "2025-09-30T00:00:00.000Z",
    ac: 53.0,
    ac_vs_ly: 0.5,
    variationDirectionVsLy: "up",
    ...overrides,
  });

  const buildMixRow = (overrides: Record<string, any> = {}) => ({
    dt_ini: "2025-07-01T00:00:00.000Z",
    dt_end: "2025-09-30T00:00:00.000Z",
    value: 45.2,
    ac: 45.2,
    ...overrides,
  });

  it("should return empty flag when trend datasource is empty", async () => {
    const result = await evaluate([], []);
    expect(result).toEqual({ empty: true });
  });

  it("should map quarterly trend data to chart values and labels", async () => {
    const trendRows = [
      buildTrendRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-03-31T00:00:00.000Z",
        ac: 52.5,
      }),
      buildTrendRow({
        dt_ini: "2025-04-01T00:00:00.000Z",
        dt_end: "2025-06-30T00:00:00.000Z",
        ac: 53.0,
      }),
      buildTrendRow({
        dt_ini: "2025-07-01T00:00:00.000Z",
        dt_end: "2025-09-30T00:00:00.000Z",
        ac: 53.4,
      }),
    ];

    const result = await evaluate([], trendRows);

    expect(result.values).toEqual([52.5, 53.0, 53.4]);
    expect(result.labels).toEqual(["Q1'25", "Q2'25", "Q3'25"]);
  });

  it("should apply default color for all bars except latest", async () => {
    const trendRows = [
      buildTrendRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-03-31T00:00:00.000Z",
        ac: 52,
      }),
      buildTrendRow({
        dt_ini: "2025-04-01T00:00:00.000Z",
        dt_end: "2025-06-30T00:00:00.000Z",
        ac: 53,
      }),
    ];

    const result = await evaluate([], trendRows);

    expect(result.backgroundColor).toEqual(["#EDDAB1", "#D1A33C"]);
  });

  it("should compute min from smallest positive distinct ac value", async () => {
    const trendRows = [
      buildTrendRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-03-31T00:00:00.000Z",
        ac: 48.7,
      }),
      buildTrendRow({
        dt_ini: "2025-04-01T00:00:00.000Z",
        dt_end: "2025-06-30T00:00:00.000Z",
        ac: 55,
      }),
    ];

    const result = await evaluate([], trendRows);

    expect(result.min).toBe(48.7);
    expect(result.max).toBe(55);
  });

  it("should build connector when at least 5 trend rows exist", async () => {
    const trendRows = [
      buildTrendRow({
        dt_ini: "2024-10-01T00:00:00.000Z",
        dt_end: "2024-12-31T00:00:00.000Z",
        ac: 52.9,
      }),
      buildTrendRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-03-31T00:00:00.000Z",
        ac: 53.0,
      }),
      buildTrendRow({
        dt_ini: "2025-04-01T00:00:00.000Z",
        dt_end: "2025-06-30T00:00:00.000Z",
        ac: 53.1,
      }),
      buildTrendRow({
        dt_ini: "2025-07-01T00:00:00.000Z",
        dt_end: "2025-09-30T00:00:00.000Z",
        ac: 53.2,
      }),
      buildTrendRow({
        dt_ini: "2025-10-01T00:00:00.000Z",
        dt_end: "2025-12-31T00:00:00.000Z",
        ac: 53.4,
        ac_vs_ly: 0.6,
        variationDirectionVsLy: "up",
      }),
    ];

    const result = await evaluate([], trendRows);

    expect(result.connector).toEqual({
      from: "Q4'24",
      to: "Q4'25",
      value: 0.6,
      backgroundColor: "#E6F9E6",
      textColor: "#007800",
      measure: "pp",
    });
  });

  it("should not include connector when fewer than 5 trend rows", async () => {
    const trendRows = [
      buildTrendRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-03-31T00:00:00.000Z",
        ac: 52,
      }),
      buildTrendRow({
        dt_ini: "2025-04-01T00:00:00.000Z",
        dt_end: "2025-06-30T00:00:00.000Z",
        ac: 53,
      }),
    ];

    const result = await evaluate([], trendRows);

    expect(result.connector).toBeUndefined();
  });

  it("should build variationCaptions from power mix rows", async () => {
    const mixRows = [
      buildMixRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-03-31T00:00:00.000Z",
        value: 44.0,
      }),
      buildMixRow({
        dt_ini: "2025-04-01T00:00:00.000Z",
        dt_end: "2025-06-30T00:00:00.000Z",
        value: 45.2,
      }),
    ];
    const trendRows = [
      buildTrendRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-03-31T00:00:00.000Z",
        ac: 52,
      }),
      buildTrendRow({
        dt_ini: "2025-04-01T00:00:00.000Z",
        dt_end: "2025-06-30T00:00:00.000Z",
        ac: 53,
      }),
    ];

    const result = await evaluate(mixRows, trendRows);

    expect(result.variationCaptions).toHaveLength(1);
    expect(result.variationCaptions[0].title).toBe(" ");
    expect(result.variationCaptions[0].data).toHaveLength(2);
    expect(result.variationCaptions[0].data[0].value).toBe(44.0);
    expect(result.variationCaptions[0].data[0].unit_of_measure).toBe("%");
  });

  it("should return empty variationCaptions when no mix rows", async () => {
    const trendRows = [
      buildTrendRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-03-31T00:00:00.000Z",
        ac: 52,
      }),
    ];

    const result = await evaluate([], trendRows);

    expect(result.variationCaptions).toEqual([]);
  });

  it("should include legend with Previous Year and Current Year", async () => {
    const trendRows = [
      buildTrendRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-03-31T00:00:00.000Z",
        ac: 52,
      }),
    ];

    const result = await evaluate([], trendRows);

    expect(result.legend).toEqual([
      { label: "Previous Year", color: "#EDDAB1" },
      { label: "Current Year", color: "#D1A33C" },
    ]);
  });

  it("should fallback mix value to ac when value is null", async () => {
    const mixRows = [
      buildMixRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-03-31T00:00:00.000Z",
        value: null,
        ac: 42.5,
      }),
      buildMixRow({
        dt_ini: "2025-04-01T00:00:00.000Z",
        dt_end: "2025-06-30T00:00:00.000Z",
        value: 45.0,
        ac: 45.0,
      }),
    ];
    const trendRows = [
      buildTrendRow({
        dt_ini: "2025-01-01T00:00:00.000Z",
        dt_end: "2025-03-31T00:00:00.000Z",
        ac: 52,
      }),
      buildTrendRow({
        dt_ini: "2025-04-01T00:00:00.000Z",
        dt_end: "2025-06-30T00:00:00.000Z",
        ac: 53,
      }),
    ];

    const result = await evaluate(mixRows, trendRows);

    expect(result.variationCaptions[0].data[0].value).toBe(42.5);
    expect(result.variationCaptions[0].data[1].value).toBe(45.0);
  });
});

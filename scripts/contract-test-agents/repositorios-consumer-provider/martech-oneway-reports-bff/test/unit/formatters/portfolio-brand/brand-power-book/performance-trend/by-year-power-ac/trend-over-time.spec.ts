import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("trend-over-time formatter (by-year-power-ac)", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book/performance-trend/by-year-power-ac/trend-over-time.jsonata",
  );

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);
  });

  const trendKey =
    "portfolio-brand_brand-power-book_overview_power-performance-trend_by-trend-over-time";
  const yearlyKey =
    "portfolio-brand_brand-power-book_overview_power-performance-trend_by-year-power-ac";
  const quarterMixKey =
    "portfolio-brand_brand-power-book_overview_power-performance-trend_by-trend-over-time-power-mix";
  const yearMixKey =
    "portfolio-brand_brand-power-book_overview_power-performance-trend_year-by-year-power-ac-power-mix";

  it("should map raw quarterly/yearly rows to chart payload (arrays, connector, legend)", async () => {
    const mockInput = {
      datasources: {
        [trendKey]: [
          {
            dt_ini: "2019-01-01T00:00:00.000Z",
            ac: 48.7,
            ac_vs_ly: 48.7,
            variationDirectionVsLy: "up",
          },
          {
            dt_ini: "2025-10-01T00:00:00.000Z",
            ac: 53.4,
            ac_vs_ly: 0.6,
            variationDirectionVsLy: "up",
          },
        ],
        [yearlyKey]: [
          {
            dt_ini: "2024-01-01T00:00:00.000Z",
            ac: 52.9,
            ac_vs_ly: 0.1,
            variationDirectionVsLy: "up",
          },
          {
            dt_ini: "2025-01-01T00:00:00.000Z",
            ac: 53.3,
            ac_vs_ly: 0.4,
            variationDirectionVsLy: "up",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result).toHaveProperty("trendOverTime");
    expect(result).toHaveProperty("yearPowerVsAc");
    expect(result).toHaveProperty("legend");

    expect(result.trendOverTime.values).toEqual([48.7, 53.4]);
    expect(result.trendOverTime.labels).toEqual(["Q1'19", "Q4'25"]);
    expect(result.trendOverTime.min).toBe(48.7);
    expect(result.trendOverTime.max).toBe(53.4);
    expect(result.trendOverTime.backgroundColor).toEqual([
      "#EDDAB1",
      "#D1A33C",
    ]);
    expect(result.trendOverTime.variationCaptions).toEqual([]);
    expect(result.trendOverTime.connector).toBeNull();

    expect(result.yearPowerVsAc.values).toEqual([52.9, 53.3]);
    expect(result.yearPowerVsAc.labels).toEqual(["FY'24", "FY'25"]);
    expect(result.yearPowerVsAc.connector).toEqual({
      from: "FY'24",
      to: "FY'25",
      value: 0.4,
      backgroundColor: "#E6F9E6",
      textColor: "#007800",
      measure: "pp",
    });

    expect(result.legend).toHaveLength(2);
    expect(result.legend[0].label).toBe("Previous Year");
    expect(result.legend[1].label).toBe("Current Year");
  });

  it("should scale quarterly bar values by mix % when by-trend-over-time-power-mix rows exist", async () => {
    const mockInput = {
      datasources: {
        [trendKey]: [
          {
            dt_ini: "2020-01-01T00:00:00.000Z",
            dt_end: "2020-03-01T00:00:00.000Z",
            ac: 46.4,
            ac_vs_ly: 1,
            variationDirectionVsLy: "up",
          },
        ],
        [yearlyKey]: [],
        [quarterMixKey]: [
          {
            dt_ini: "2020-01-01T00:00:00.000Z",
            value: 52,
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.trendOverTime.values).toEqual([24.1]);
    expect(result.trendOverTime.min).toBe(24.1);
    expect(result.trendOverTime.max).toBe(24.1);
    expect(result.trendOverTime.variationCaptions).toHaveLength(1);
    expect(result.trendOverTime.variationCaptions[0].title).toBe(" ");
    expect(result.trendOverTime.variationCaptions[0].data).toEqual([
      {
        value: 52,
        unit_of_measure: "%",
        color: "#1414148F",
      },
    ]);
  });

  it("should append Q1 partial bar to yearPowerVsAc after last fiscal year when quarterly has Q1 in a later year", async () => {
    const mockInput = {
      datasources: {
        [trendKey]: [
          {
            dt_ini: "2026-01-01T00:00:00.000Z",
            dt_end: "2026-03-01T00:00:00.000Z",
            ac: 53.6,
            ac_vs_ly: 0.2,
            variationDirectionVsLy: "up",
          },
        ],
        [yearlyKey]: [
          {
            dt_ini: "2025-01-01T00:00:00.000Z",
            dt_end: "2025-12-01T00:00:00.000Z",
            ac: 53.5,
            ac_vs_ly: 1.4,
            variationDirectionVsLy: "up",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.yearPowerVsAc.labels).toEqual(["FY'25", "Q1'26"]);
    expect(result.yearPowerVsAc.values).toEqual([53.5, 53.6]);
    expect(result.yearPowerVsAc.connector).toEqual({
      from: "FY'25",
      to: "Q1'26",
      value: 0.2,
      backgroundColor: "#E6F9E6",
      textColor: "#007800",
      measure: "pp",
    });
  });

  it("should scale yearly bars by year mix when year-by-year-power-ac-power-mix is present", async () => {
    const mockInput = {
      datasources: {
        [trendKey]: [],
        [yearlyKey]: [
          {
            dt_ini: "2020-01-01T00:00:00.000Z",
            dt_end: "2020-12-01T00:00:00.000Z",
            ac: 50.7,
            ac_vs_ly: 1,
            variationDirectionVsLy: "up",
          },
        ],
        [yearMixKey]: [
          {
            dt_ini: "2020-01-01T00:00:00.000Z",
            value: 52.7,
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.trendOverTime).toBeNull();
    expect(result.yearPowerVsAc.values).toEqual([26.7]);
    expect(result.yearPowerVsAc.variationCaptions).toHaveLength(1);
    expect(result.yearPowerVsAc.variationCaptions[0].title).toBe(
      "Mix of Total Power",
    );
    expect(result.yearPowerVsAc.variationCaptions[0].subtitle).toBe("%");
    expect(result.yearPowerVsAc.variationCaptions[0].data).toEqual([
      {
        value: 52.7,
        unit_of_measure: "%",
        color: "#1414148F",
      },
    ]);
  });

  it("should set quarterly connector from five quarters before last to last when at least five points exist", async () => {
    const quarters = [
      {
        dt_ini: "2024-01-01T00:00:00.000Z",
        ac: 52.9,
        ac_vs_ly: 0,
        variationDirectionVsLy: "up",
      },
      {
        dt_ini: "2024-04-01T00:00:00.000Z",
        ac: 52.9,
        ac_vs_ly: 0,
        variationDirectionVsLy: "up",
      },
      {
        dt_ini: "2024-07-01T00:00:00.000Z",
        ac: 53.1,
        ac_vs_ly: 0,
        variationDirectionVsLy: "up",
      },
      {
        dt_ini: "2024-10-01T00:00:00.000Z",
        ac: 52.9,
        ac_vs_ly: 0,
        variationDirectionVsLy: "up",
      },
      {
        dt_ini: "2025-01-01T00:00:00.000Z",
        ac: 53.4,
        ac_vs_ly: 0,
        variationDirectionVsLy: "up",
      },
      {
        dt_ini: "2025-04-01T00:00:00.000Z",
        ac: 53.3,
        ac_vs_ly: 0,
        variationDirectionVsLy: "up",
      },
      {
        dt_ini: "2025-07-01T00:00:00.000Z",
        ac: 53.3,
        ac_vs_ly: 0,
        variationDirectionVsLy: "up",
      },
      {
        dt_ini: "2025-10-01T00:00:00.000Z",
        ac: 53.4,
        ac_vs_ly: 0.6,
        variationDirectionVsLy: "up",
      },
    ];
    const mockInput = {
      datasources: {
        [trendKey]: quarters,
        [yearlyKey]: [],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.trendOverTime.connector).toEqual({
      from: "Q4'24",
      to: "Q4'25",
      value: 0.6,
      backgroundColor: "#E6F9E6",
      textColor: "#007800",
      measure: "pp",
    });
  });

  it("should return null yearly connector when last row ac_vs_ly is not a number", async () => {
    const mockInput = {
      datasources: {
        [trendKey]: [],
        [yearlyKey]: [
          {
            dt_ini: "2023-01-01T00:00:00.000Z",
            ac: 68,
            ac_vs_ly: null,
            variationDirectionVsLy: "up",
          },
        ],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.yearPowerVsAc).not.toBeNull();
    expect(result.yearPowerVsAc.connector).toBeNull();
    expect(result.yearPowerVsAc.values).toEqual([68]);
    expect(result.yearPowerVsAc.labels).toEqual(["FY'23"]);
  });

  it("should return null trendOverTime connector when fewer than 5 quarters", async () => {
    const mockInput = {
      datasources: {
        [trendKey]: [
          {
            dt_ini: "2024-01-01T00:00:00.000Z",
            ac: 50,
            ac_vs_ly: 1,
            variationDirectionVsLy: "up",
          },
          {
            dt_ini: "2024-04-01T00:00:00.000Z",
            ac: 51,
            ac_vs_ly: 2,
            variationDirectionVsLy: "up",
          },
        ],
        [yearlyKey]: [],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.trendOverTime.connector).toBeNull();
  });

  it("should return legend when datasources are empty", async () => {
    const mockInput = {
      datasources: {
        [trendKey]: [],
        [yearlyKey]: [],
      },
    };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.trendOverTime).toBeNull();
    expect(result.yearPowerVsAc).toBeNull();
    expect(result.legend).toHaveLength(2);
    expect(result.legend[0].label).toBe("Previous Year");
    expect(result.legend[1].label).toBe("Current Year");
  });

  it("should return null sections when datasources are missing or empty", async () => {
    const mockInput = { datasources: {} };

    const result = await compiledExpression.evaluate(mockInput);

    expect(result.trendOverTime).toBeNull();
    expect(result.yearPowerVsAc).toBeNull();
    expect(result.legend).toBeDefined();
  });
});

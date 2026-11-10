import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("performanceDetailsFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book/overview/performance-breakdown/performanceDetailsFormatter.jsonata",
  );

  const DS_KEY = "perf_details_ds";

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
    country_iso_code_3: "BRA",
    level_1: "ABI",
    dt_ini: "2025-07-01T00:00:00.000Z",
    dt_end: "2025-09-30T00:00:00.000Z",
    ac: 55.2,
    ac_vs_ly: 1.3,
    ac_vs_lq: 0.5,
    variationDirectionVsLy: "up",
    variationDirectionVsLq: "up",
    ...overrides,
  });

  it("should return header and empty rows when datasource is empty", async () => {
    const result: any = await evaluate([]);

    expect(result.header).toHaveLength(4);
    expect(result.rows).toEqual([[]]);
  });

  it("should format header with dynamic ly and lq titles", async () => {
    const result: any = await evaluate([buildRow()]);

    expect(result.header[0]).toEqual({ id: "id", title: "" });
    expect(result.header[1]).toEqual({ id: "ac", title: "AC" });
    expect(result.header[2].id).toBe("ly");
    expect(result.header[2].title).toMatch(/^vs Q\d'\d{2}$/);
    expect(result.header[3].id).toBe("lq");
    expect(result.header[3].title).toMatch(/^vs Q\d'\d{2}$/);
  });

  it("should build ABI cell with correct structure", async () => {
    const result: any = await evaluate([
      buildRow({
        country_iso_code_3: "MEX",
        ac: 48.5,
        ac_vs_ly: 2.1,
        ac_vs_lq: -0.3,
        variationDirectionVsLy: "up",
        variationDirectionVsLq: "down",
      }),
    ]);
    const abiCell = result.rows[0][0];

    expect(abiCell.id.value).toBe("MEX");
    expect(abiCell.ac.chartData.data).toEqual([48.5]);
    expect(abiCell.ac.chartData.backgroundColor).toEqual(["#EDCD20"]);
    expect(abiCell.ly.value).toBe(2.1);
    expect(abiCell.ly.variationDirection).toBe("#49764B");
    expect(abiCell.lq.value).toBe(-0.3);
    expect(abiCell.lq.variationDirection).toBe("#A20A0A");
  });

  it("should pair ABI and Competitor rows for the same country", async () => {
    const rows = [
      buildRow({ country_iso_code_3: "BRA", level_1: "ABI", ac: 55 }),
      buildRow({ country_iso_code_3: "BRA", level_1: "Comp", ac: 40 }),
    ];

    const result: any = await evaluate(rows);
    const flatRows = result.rows[0];

    expect(flatRows[0].id.value).toBe("BRA");
    expect(flatRows[0].ac.chartData.backgroundColor).toEqual(["#EDCD20"]);
    expect(flatRows[1].type.value).toBe("competitor");
    expect(flatRows[1].ac.chartData.backgroundColor).toEqual(["#97ADBB"]);
  });

  it("should sort countries alphabetically with ABI+Comp pairs", async () => {
    const rows = [
      buildRow({ country_iso_code_3: "MEX", level_1: "ABI" }),
      buildRow({ country_iso_code_3: "MEX", level_1: "Comp" }),
      buildRow({ country_iso_code_3: "ARG", level_1: "ABI" }),
      buildRow({ country_iso_code_3: "ARG", level_1: "Comp" }),
      buildRow({ country_iso_code_3: "BRA", level_1: "ABI" }),
      buildRow({ country_iso_code_3: "BRA", level_1: "Comp" }),
    ];

    const result: any = await evaluate(rows);
    const flatRows = result.rows[0];
    const ids = flatRows.map((r: any) => r.id.value);

    expect(ids).toEqual(["ARG", "ARG", "BRA", "BRA", "MEX", "MEX"]);
  });

  it("should pick the latest row per country/level", async () => {
    const rows = [
      buildRow({
        country_iso_code_3: "BRA",
        dt_ini: "2025-01-01T00:00:00.000Z",
        ac: 50,
      }),
      buildRow({
        country_iso_code_3: "BRA",
        dt_ini: "2025-07-01T00:00:00.000Z",
        ac: 55,
      }),
    ];

    const result: any = await evaluate(rows);
    const abiCell = result.rows[0][0];

    expect(abiCell.ac.chartData.data).toEqual([55]);
  });

  it("should fallback lq direction when variationDirectionVsLq is missing", async () => {
    const result: any = await evaluate([
      buildRow({ ac_vs_lq: 1.0, variationDirectionVsLq: undefined }),
    ]);
    expect(result.rows[0][0].lq.variationDirection).toBe("#49764B");

    const result2: any = await evaluate([
      buildRow({ ac_vs_lq: -1.0, variationDirectionVsLq: undefined }),
    ]);
    expect(result2.rows[0][0].lq.variationDirection).toBe("#A20A0A");
  });
});

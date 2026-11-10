import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("exportPerformanceDetailsFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book-export/performance-breakdown/exportPerformanceDetailsFormatter.jsonata",
  );

  const DS_KEY = "performance_details_ds";

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiledExpression);
  });

  const evaluate = (data: any[]) =>
    compiledExpression.evaluate({ datasources: { [DS_KEY]: data } });

  const buildRow = (overrides: Record<string, any> = {}) => ({
    country_iso_code_3: "BRA",
    level_1: "ABI",
    is_comp: false,
    dt_ini: "2025-07-01T00:00:00.000Z",
    dt_end: "2025-09-30T00:00:00.000Z",
    ac: 55.2,
    ac_vs_ly: 1.3,
    ac_vs_lq: 0.5,
    variationDirectionVsLy: "up",
    variationDirectionVsLq: "up",
    abi_zone: "SAZ",
    ...overrides,
  });

  it("should return header and empty rows when datasource is empty", async () => {
    const result: any = await evaluate([]);

    expect(result.header).toBeDefined();
    expect(result.header).toHaveLength(5);
    expect(result.rows).toEqual([[]]);
  });

  it("should format header with ly and lq period titles from data", async () => {
    const result: any = await evaluate([buildRow()]);

    expect(result.header[0]).toEqual({ id: "label", title: "" });
    expect(result.header[1]).toEqual({ id: "id", title: "" });
    expect(result.header[2]).toEqual({ id: "ac", title: "AC" });
    expect(result.header[3].id).toBe("ly");
    expect(result.header[3].title).toMatch(/^vs Q\d'\d{2}$/);
    expect(result.header[4].id).toBe("lq");
    expect(result.header[4].title).toMatch(/^vs Q\d'\d{2}$/);
  });

  it("should build ABI cell with correct structure for a single country", async () => {
    const row = buildRow({
      country_iso_code_3: "MEX",
      ac: 48.5,
      ac_vs_ly: 2.1,
      ac_vs_lq: -0.3,
      variationDirectionVsLy: "up",
      variationDirectionVsLq: "down",
      abi_zone: "MAZ",
    });

    const result: any = await evaluate([row]);
    const cell = result.rows[0][0];

    expect(cell.id.value).toBe("MEX");
    expect(cell.ac.chartData.data).toEqual([48.5]);
    expect(cell.ac.chartData.backgroundColor).toEqual(["#EDCD20"]);
    expect(cell.ac.chartData.secondaryBackgroundColor).toEqual(["#EDDAB1"]);
    expect(cell.ly.value).toBe(2.1);
    expect(cell.ly.unitMeasure).toBe("pp");
    expect(cell.ly.variationDirection).toBe("#49764B");
    expect(cell.lq.value).toBe(-0.3);
    expect(cell.lq.unitMeasure).toBe("pp");
    expect(cell.lq.variationDirection).toBe("#A20A0A");
    expect(cell.label.value).toBe("MAZ");
  });

  it("should include ABI rows when is_comp is false, ignoring COMP rows", async () => {
    const rows = [
      buildRow({
        country_iso_code_3: "BRA",
        level_1: "ABI",
        is_comp: false,
        ac: 55,
      }),
      buildRow({
        country_iso_code_3: "BRA",
        level_1: "COMP",
        is_comp: false,
        ac: 40,
      }),
    ];

    const result: any = await evaluate(rows);
    const cell = result.rows[0][0];

    expect(cell.ac.chartData.data).toEqual([55]);
  });

  it("should include COMP rows with competitor legend when is_comp is true", async () => {
    const rows = [
      buildRow({
        country_iso_code_3: "BRA",
        level_1: "ABI",
        is_comp: true,
        ac: 55,
      }),
      buildRow({
        country_iso_code_3: "BRA",
        level_1: "COMP",
        is_comp: true,
        ac: 40,
      }),
    ];

    const result: any = await evaluate(rows);
    const cell = result.rows[0][0];

    expect(cell.ac.chartData.data).toEqual([40]);
    expect(cell.ac.chartData.backgroundColor).toEqual(["#46ca7b"]);
    expect(cell.ac.chartData.secondaryBackgroundColor).toEqual(["#D3E3EE"]);
  });

  it("should pick the latest row per country when multiple dates exist", async () => {
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
    const cell = result.rows[0][0];

    expect(cell.ac.chartData.data).toEqual([55]);
  });

  it("should sort countries alphabetically", async () => {
    const rows = [
      buildRow({ country_iso_code_3: "MEX" }),
      buildRow({ country_iso_code_3: "ARG" }),
      buildRow({ country_iso_code_3: "BRA" }),
    ];

    const result: any = await evaluate(rows);
    const flatRows = result.rows[0];

    expect(flatRows.map((r: any) => r.id.value)).toEqual(["ARG", "BRA", "MEX"]);
  });

  it("should fallback lq direction to computed from ac_vs_lq when variationDirectionVsLq is missing", async () => {
    const rows = [
      buildRow({
        ac_vs_lq: 1.0,
        variationDirectionVsLq: undefined,
      }),
    ];

    const result: any = await evaluate(rows);
    const cell = result.rows[0][0];

    expect(cell.lq.variationDirection).toBe("#49764B");
  });

  it("should compute down lq direction when ac_vs_lq is negative and direction is missing", async () => {
    const rows = [
      buildRow({
        ac_vs_lq: -1.0,
        variationDirectionVsLq: undefined,
      }),
    ];

    const result: any = await evaluate(rows);
    const cell = result.rows[0][0];

    expect(cell.lq.variationDirection).toBe("#A20A0A");
  });
});

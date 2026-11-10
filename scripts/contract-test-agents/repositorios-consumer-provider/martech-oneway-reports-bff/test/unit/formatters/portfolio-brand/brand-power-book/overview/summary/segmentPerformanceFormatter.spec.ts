import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("segmentPerformanceFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book/overview/summary/segmentPerformanceFormatter.jsonata",
  );

  const DS_KEY = "segment_performance_ds";

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiledExpression);
  });

  const evaluate = (data: any[]) =>
    compiledExpression.evaluate({ datasources: { [DS_KEY]: data } });

  const buildRow = (overrides: Record<string, any> = {}) => ({
    price_tier: "Premium",
    level_1: "ABI",
    ac: 55.2,
    ac_vs_ly: 1.3,
    dt_end: "2025-03-31T00:00:00.000Z",
    ...overrides,
  });

  it("should return empty flag when datasource is empty", async () => {
    const result = await evaluate([]);
    expect(result).toEqual({ empty: true });
  });

  it("should build header with dynamic ly column title from dt_end", async () => {
    const result: any = await evaluate([buildRow()]);

    expect(result.header).toHaveLength(3);
    expect(result.header[0]).toEqual({ id: "id", title: "" });
    expect(result.header[1]).toEqual({ id: "ac", title: "AC" });
    expect(result.header[2].id).toBe("ly");
    expect(result.header[2].title).toMatch(/^vs Q\d'\d{2}$/);
  });

  it("should map price_tier as id, replacing N/A with TT ABI", async () => {
    const rows = [
      buildRow({ price_tier: "Premium" }),
      buildRow({ price_tier: "N/A" }),
    ];

    const result: any = await evaluate(rows);
    const items = result.rows[0];

    expect(items[0].id.value).toBe("Premium");
    expect(items[1].id.value).toBe("TT ABI");
  });

  it("should set type to competitor for comp level_1", async () => {
    const rows = [buildRow({ level_1: "ABI" }), buildRow({ level_1: "comp" })];

    const result: any = await evaluate(rows);
    const items = result.rows[0];

    expect(items[0].type.value).toBe("abi");
    expect(items[1].type.value).toBe("competitor");
  });

  it("should use ABI colors for non-comp and Competitor colors for comp rows", async () => {
    const rows = [
      buildRow({ level_1: "ABI", ac: 55.2 }),
      buildRow({ level_1: "comp", ac: 40.1 }),
    ];

    const result: any = await evaluate(rows);
    const items = result.rows[0];

    expect(items[0].ac.chartData.backgroundColor).toEqual(["#EDCD20"]);
    expect(items[0].ac.chartData.secondaryBackgroundColor).toEqual(["#EDDAB1"]);
    expect(items[1].ac.chartData.backgroundColor).toEqual(["#97ADBB"]);
    expect(items[1].ac.chartData.secondaryBackgroundColor).toEqual(["#D3E3EE"]);
  });

  it("should set ly variation direction based on ac_vs_ly sign", async () => {
    const rows = [buildRow({ ac_vs_ly: 1.3 }), buildRow({ ac_vs_ly: -0.5 })];

    const result: any = await evaluate(rows);
    const items = result.rows[0];

    expect(items[0].ly.variationDirection).toBe("#49764B");
    expect(items[0].ly.value).toBe(1.3);
    expect(items[0].ly.unitMeasure).toBe("pp");
    expect(items[1].ly.variationDirection).toBe("#A20A0A");
    expect(items[1].ly.value).toBe(-0.5);
  });
});

import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("summaryPowerBreakdownFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book/overview/summary/summaryPowerBreakdownFormatter.jsonata",
  );

  const DS_KEY = "breakdown_ds";

  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    compiledExpression = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiledExpression);
  });

  const evaluate = (data: any[]) =>
    compiledExpression.evaluate({ datasources: { [DS_KEY]: data } });

  const buildRow = (overrides: Record<string, any> = {}) => ({
    raw_brand: "Brand A",
    kpi_name: "power",
    level_1: "ABI",
    ac: 55.0,
    ac_vs_ly: 1.3,
    dt_end: "2025-09-30T00:00:00.000Z",
    ...overrides,
  });

  it("should return empty flag when datasource is empty", async () => {
    const result = await evaluate([]);
    expect(result).toEqual({ empty: true });
  });

  it("should build header with 5 groups (id + 4 kpis)", async () => {
    const result: any = await evaluate([buildRow()]);

    expect(result.header).toHaveLength(5);
    expect(result.header[0].children[0].id).toBe("id");
    expect(result.header[1].title).toBe("Brand Power");
    expect(result.header[2].title).toBe("Meaning");
    expect(result.header[3].title).toBe("Difference");
    expect(result.header[4].title).toBe("Salience");
  });

  it("should use dynamic ly label in header children", async () => {
    const result: any = await evaluate([buildRow()]);

    const lyTitle = result.header[1].children[1].title;
    expect(lyTitle).toMatch(/^vs Q\d'\d{2}$/);
  });

  it("should build one row per brand with KPI cells", async () => {
    const rows = [
      buildRow({
        raw_brand: "Brand A",
        kpi_name: "power",
        ac: 55,
        ac_vs_ly: 1.0,
      }),
      buildRow({
        raw_brand: "Brand A",
        kpi_name: "meaningful",
        ac: 60,
        ac_vs_ly: -0.5,
      }),
      buildRow({
        raw_brand: "Brand A",
        kpi_name: "difference",
        ac: 45,
        ac_vs_ly: 0.3,
      }),
      buildRow({
        raw_brand: "Brand A",
        kpi_name: "salience",
        ac: 50,
        ac_vs_ly: 0.8,
      }),
    ];

    const result: any = await evaluate(rows);
    const row = result.rows[0][0];

    expect(row.id.value).toBe("Brand A");
    expect(row.type.value).toBe("abi");
    expect(row.brand_power_ac.chartData.data).toEqual([55]);
    expect(row.brand_power_ac.chartData.backgroundColor).toEqual(["#EDCD20"]);
    expect(row.brand_power_ac.chartData.max).toBe(100);
    expect(row.brand_power_ly.unitMeasure).toBe("pp");
    expect(row.brand_power_ly.variationDirection).toBe("#49764B");
    expect(row.brand_power_ly.value).toBe(1.0);
    expect(row.meaning_ac.chartData.data).toEqual([60]);
    expect(row.meaning_ly.variationDirection).toBe("#A20A0A");
    expect(row.salience_ac.chartData.data).toEqual([50]);
  });

  it("should use fixedMax 100 for brand_power and dynamic max for others", async () => {
    const rows = [
      buildRow({ raw_brand: "A", kpi_name: "power", ac: 55 }),
      buildRow({ raw_brand: "A", kpi_name: "meaningful", ac: 60 }),
      buildRow({ raw_brand: "A", kpi_name: "difference", ac: 45 }),
      buildRow({ raw_brand: "A", kpi_name: "salience", ac: 50 }),
      buildRow({ raw_brand: "B", kpi_name: "power", ac: 52 }),
      buildRow({ raw_brand: "B", kpi_name: "meaningful", ac: 70 }),
      buildRow({ raw_brand: "B", kpi_name: "difference", ac: 48 }),
      buildRow({ raw_brand: "B", kpi_name: "salience", ac: 55 }),
    ];

    const result: any = await evaluate(rows);
    const row = result.rows[0][0];

    expect(row.brand_power_ac.chartData.max).toBe(100);
    expect(row.meaning_ac.chartData.max).toBe(70);
    expect(row.difference_ac.chartData.max).toBe(48);
    expect(row.salience_ac.chartData.max).toBe(55);
  });

  it("should exclude rows with level_1 = COMP from the output", async () => {
    const rows = [
      buildRow({ raw_brand: "ABI Brand", kpi_name: "power", level_1: "ABI" }),
      buildRow({
        raw_brand: "ABI Brand",
        kpi_name: "meaningful",
        level_1: "ABI",
      }),
      buildRow({
        raw_brand: "ABI Brand",
        kpi_name: "difference",
        level_1: "ABI",
      }),
      buildRow({
        raw_brand: "ABI Brand",
        kpi_name: "salience",
        level_1: "ABI",
      }),
      buildRow({ raw_brand: "Comp Brand", kpi_name: "power", level_1: "COMP" }),
      buildRow({
        raw_brand: "Comp Brand",
        kpi_name: "meaningful",
        level_1: "COMP",
      }),
      buildRow({
        raw_brand: "Comp Brand",
        kpi_name: "difference",
        level_1: "COMP",
      }),
      buildRow({
        raw_brand: "Comp Brand",
        kpi_name: "salience",
        level_1: "COMP",
      }),
    ];

    const result: any = await evaluate(rows);
    const allRows = result.rows[0];

    expect(allRows).toHaveLength(1);
    expect(allRows[0].id.value).toBe("ABI Brand");
    expect(allRows[0].type.value).toBe("abi");
  });

  it("should set variation direction based on ac_vs_ly sign", async () => {
    const rows = [
      buildRow({ raw_brand: "A", kpi_name: "power", ac_vs_ly: 1.0 }),
      buildRow({ raw_brand: "A", kpi_name: "meaningful", ac_vs_ly: -2.0 }),
      buildRow({ raw_brand: "A", kpi_name: "difference", ac_vs_ly: 0.5 }),
      buildRow({ raw_brand: "A", kpi_name: "salience", ac_vs_ly: -0.1 }),
    ];

    const result: any = await evaluate(rows);
    const row = result.rows[0][0];

    expect(row.brand_power_ly.variationDirection).toBe("#49764B");
    expect(row.meaning_ly.variationDirection).toBe("#A20A0A");
    expect(row.difference_ly.variationDirection).toBe("#49764B");
    expect(row.salience_ly.variationDirection).toBe("#A20A0A");
  });
});

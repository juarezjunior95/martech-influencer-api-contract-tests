import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("zonePowerPerformanceFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book/overview/performance-breakdown/zonePowerPerformanceFormatter.jsonata",
  );

  const DS_KEY = "zone_ds";

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
    abi_zone: "NAZ",
    level_1: "ABI",
    dt_ini: "2025-07-01T00:00:00.000Z",
    dt_end: "2025-09-30T00:00:00.000Z",
    ac: 55.2,
    ac_vs_ly: 1.3,
    ac_vs_lq: 0.5,
    ...overrides,
  });

  it("should return empty rows and default header titles when datasource is empty", async () => {
    const result: any = await evaluate([]);

    expect(result.table.header).toHaveLength(4);
    expect(result.table.header[2].title).toBe("vs LY");
    expect(result.table.header[3].title).toBe("vs LQ");
    expect(result.table.rows).toEqual([[]]);
    expect(result.legend).toHaveLength(2);
  });

  it("should build header with dynamic ly and lq titles when data exists", async () => {
    const result: any = await evaluate([buildRow()]);

    expect(result.table.header[2].title).toMatch(/^vs Q\d'\d{2}$/);
    expect(result.table.header[3].title).toMatch(/^vs Q\d'\d{2}$/);
  });

  it("should return legend with ABI and Competitor entries", async () => {
    const result: any = await evaluate([buildRow()]);

    expect(result.legend).toEqual([
      { label: "ABI", color: "#EDCD20", selected_color: "#EDDAB1" },
      { label: "Competitor", color: "#97ADBB", selected_color: "#D3E3EE" },
    ]);
  });

  it("should order zones as NAZ, SAZ, MAZ, APAC, AFR, EUR with ABI+Comp pairs", async () => {
    const rows = [
      buildRow({ abi_zone: "EUR", level_1: "ABI" }),
      buildRow({ abi_zone: "EUR", level_1: "Comp" }),
      buildRow({ abi_zone: "NAZ", level_1: "ABI" }),
      buildRow({ abi_zone: "NAZ", level_1: "Comp" }),
      buildRow({ abi_zone: "APAC", level_1: "ABI" }),
      buildRow({ abi_zone: "APAC", level_1: "Comp" }),
      buildRow({ abi_zone: "SAZ", level_1: "ABI" }),
      buildRow({ abi_zone: "SAZ", level_1: "Comp" }),
    ];

    const result: any = await evaluate(rows);
    const ids = result.table.rows[0].map((r: any) => r.id.value);

    expect(ids).toEqual([
      "NAZ",
      "NAZ",
      "SAZ",
      "SAZ",
      "APAC",
      "APAC",
      "EUR",
      "EUR",
    ]);
  });

  it("should pair ABI and Competitor rows for the same zone", async () => {
    const rows = [
      buildRow({ abi_zone: "NAZ", level_1: "ABI", ac: 55 }),
      buildRow({ abi_zone: "NAZ", level_1: "Comp", ac: 40 }),
    ];

    const result: any = await evaluate(rows);
    const flatRows = result.table.rows[0];

    expect(flatRows).toHaveLength(2);
    expect(flatRows[0].id.value).toBe("NAZ");
    expect(flatRows[0].ac.chartData.backgroundColor).toEqual(["#EDCD20"]);
    expect(flatRows[1].type.value).toBe("competitor");
    expect(flatRows[1].ac.chartData.backgroundColor).toEqual(["#97ADBB"]);
  });

  it("should use the Heineken competitor color when raw_brand is Heineken", async () => {
    const rows = [
      buildRow({ abi_zone: "NAZ", level_1: "ABI", raw_brand: "ABI Brand" }),
      buildRow({ abi_zone: "NAZ", level_1: "Comp", raw_brand: "Heineken" }),
    ];

    const result: any = await evaluate(rows);
    const competitorCell = result.table.rows[0][1];

    expect(competitorCell.type.value).toBe("competitor");
    expect(competitorCell.ac.chartData.backgroundColor).toEqual(["#46ca7b"]);
  });

  it("should compute variation direction from ac_vs_ly sign", async () => {
    const rows = [
      buildRow({
        abi_zone: "NAZ",
        level_1: "ABI",
        ac_vs_ly: 1.3,
        ac_vs_lq: -0.5,
      }),
      buildRow({ abi_zone: "NAZ", level_1: "Comp" }),
    ];

    const result: any = await evaluate(rows);
    const cell = result.table.rows[0][0];

    expect(cell.ly.variationDirection).toBe("up");
    expect(cell.ly.value).toBe(1.3);
    expect(cell.lq.variationDirection).toBe("down");
    expect(cell.lq.value).toBe(-0.5);
  });

  it("should pick the latest row per zone/level", async () => {
    const rows = [
      buildRow({
        abi_zone: "NAZ",
        level_1: "ABI",
        dt_ini: "2025-01-01T00:00:00.000Z",
        ac: 50,
      }),
      buildRow({
        abi_zone: "NAZ",
        level_1: "ABI",
        dt_ini: "2025-07-01T00:00:00.000Z",
        ac: 55,
      }),
      buildRow({ abi_zone: "NAZ", level_1: "Comp" }),
    ];

    const result: any = await evaluate(rows);
    const cell = result.table.rows[0][0];

    expect(cell.ac.chartData.data).toEqual([55]);
  });

  it("should skip zones not in the defined order", async () => {
    const rows = [
      buildRow({ abi_zone: "NAZ", level_1: "ABI" }),
      buildRow({ abi_zone: "NAZ", level_1: "Comp" }),
      buildRow({ abi_zone: "UNKNOWN", level_1: "ABI" }),
      buildRow({ abi_zone: "UNKNOWN", level_1: "Comp" }),
    ];

    const result: any = await evaluate(rows);
    const abiCells = result.table.rows[0].filter((r: any) => !r.type);

    expect(abiCells).toHaveLength(1);
    expect(abiCells[0].id.value).toBe("NAZ");
  });
});

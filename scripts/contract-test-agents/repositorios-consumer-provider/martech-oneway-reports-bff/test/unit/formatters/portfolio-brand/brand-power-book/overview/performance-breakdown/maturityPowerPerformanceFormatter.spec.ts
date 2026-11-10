import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("maturityPowerPerformanceFormatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/portfolio-brand/brand-power-book/overview/performance-breakdown/maturityPowerPerformanceFormatter.jsonata",
  );

  const DS_KEY = "maturity_ds";

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
    maturity: "M3",
    level_1: "ABI",
    dt_ini: "2025-07-01T00:00:00.000Z",
    dt_end: "2025-09-30T00:00:00.000Z",
    ac: 55.2,
    ac_vs_ly: 1.3,
    ac_vs_lq: 0.5,
    variationDirectionVsLy: "up",
    ...overrides,
  });

  it("should return empty rows and default header titles when datasource is empty", async () => {
    const result: any = await evaluate([]);

    expect(result.table.header).toHaveLength(4);
    expect(result.table.header[2].title).toBe("vs LY");
    expect(result.table.header[3].title).toBe("vs LQ");
    expect(result.table.rows).toEqual([[]]);
    expect(result.legend).toHaveLength(3);
  });

  it("should build header with dynamic ly and lq titles when data exists", async () => {
    const result: any = await evaluate([buildRow()]);

    expect(result.table.header[2].id).toBe("ly");
    expect(result.table.header[2].title).toMatch(/^vs Q\d'\d{2}$/);
    expect(result.table.header[3].id).toBe("lq");
    expect(result.table.header[3].title).toMatch(/^vs Q\d'\d{2}$/);
  });

  it("should return legend with ABI and Competitor entries", async () => {
    const result: any = await evaluate([buildRow()]);

    expect(result.legend).toEqual([
      { label: "ABI", color: "#EDCD20", selected_color: "#EDDAB1" },
      { label: "Competitor", color: "#97ADBB", selected_color: "#D3E3EE" },
      { label: "Competitor", color: "#46ca7b", selected_color: "#D3E3EE" },
    ]);
  });

  it("should order maturities as M3, M2, M1 with ABI+Comp pairs", async () => {
    const rows = [
      buildRow({ maturity: "M1", level_1: "ABI" }),
      buildRow({ maturity: "M1", level_1: "Comp" }),
      buildRow({ maturity: "M3", level_1: "ABI" }),
      buildRow({ maturity: "M3", level_1: "Comp" }),
      buildRow({ maturity: "M2", level_1: "ABI" }),
      buildRow({ maturity: "M2", level_1: "Comp" }),
    ];

    const result: any = await evaluate(rows);
    const ids = result.table.rows[0].map((r: any) => r.id.value);

    expect(ids).toEqual(["M3", "M3", "M2", "M2", "M1", "M1"]);
  });

  it("should pair ABI and Competitor rows for the same maturity", async () => {
    const rows = [
      buildRow({ maturity: "M3", level_1: "ABI", ac: 55 }),
      buildRow({ maturity: "M3", level_1: "Comp", ac: 40 }),
    ];

    const result: any = await evaluate(rows);
    const flatRows = result.table.rows[0];

    expect(flatRows).toHaveLength(2);
    expect(flatRows[0].id.value).toBe("M3");
    expect(flatRows[0].ac.chartData.backgroundColor).toEqual(["#EDCD20"]);
    expect(flatRows[1].type.value).toBe("competitor");
    expect(flatRows[1].ac.chartData.backgroundColor).toEqual(["#97ADBB"]);
  });

  it("should use the Heineken competitor color when raw_brand is Heineken", async () => {
    const rows = [
      buildRow({ maturity: "M3", level_1: "ABI", raw_brand: "ABI Brand" }),
      buildRow({ maturity: "M3", level_1: "Comp", raw_brand: "Heineken" }),
    ];

    const result: any = await evaluate(rows);
    const competitorCell = result.table.rows[0][1];

    expect(competitorCell.type.value).toBe("competitor");
    expect(competitorCell.ac.chartData.backgroundColor).toEqual(["#46ca7b"]);
  });

  it("should build ABI cell with correct ly and lq variation", async () => {
    const rows = [
      buildRow({
        maturity: "M3",
        level_1: "ABI",
        ac_vs_ly: 1.3,
        ac_vs_lq: -0.5,
        variationDirectionVsLy: "up",
      }),
      buildRow({ maturity: "M3", level_1: "Comp" }),
    ];

    const result: any = await evaluate(rows);
    const abiCell = result.table.rows[0][0];

    expect(abiCell.ly.variationDirection).toBe("#49764B");
    expect(abiCell.ly.value).toBe(1.3);
    expect(abiCell.lq.variationDirection).toBe("down");
    expect(abiCell.lq.value).toBe(-0.5);
  });

  it("should build Competitor cell with variation based on ac_vs_ly sign", async () => {
    const rows = [
      buildRow({ maturity: "M3", level_1: "ABI" }),
      buildRow({
        maturity: "M3",
        level_1: "Comp",
        ac_vs_ly: -0.8,
        ac_vs_lq: 0.3,
      }),
    ];

    const result: any = await evaluate(rows);
    const compCell = result.table.rows[0][1];

    expect(compCell.type.value).toBe("competitor");
    expect(compCell.ly.variationDirection).toBe("down");
    expect(compCell.lq.variationDirection).toBe("down");
  });

  it("should skip maturities not in the defined order", async () => {
    const rows = [
      buildRow({ maturity: "M3", level_1: "ABI" }),
      buildRow({ maturity: "M3", level_1: "Comp" }),
      buildRow({ maturity: "UNKNOWN", level_1: "ABI" }),
      buildRow({ maturity: "UNKNOWN", level_1: "Comp" }),
    ];

    const result: any = await evaluate(rows);
    const ids = result.table.rows[0]
      .filter((r: any) => !r.type)
      .map((r: any) => r.id.value);

    expect(ids).toEqual(["M3"]);
  });
});

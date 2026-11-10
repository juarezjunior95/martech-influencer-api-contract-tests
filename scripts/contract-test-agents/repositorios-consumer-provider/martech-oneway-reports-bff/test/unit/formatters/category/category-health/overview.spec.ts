import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("category category-health overview formatter", () => {
  const makeRow = (overrides: Record<string, unknown> = {}) => ({
    maturity: "N/A",
    country_iso_code_3: "ABI",
    kpi_name: "cat_health_volume",
    category: "Beer",
    unit_of_measure: "Min",
    comp_unit_of_measure: "%",
    ac: 100.5,
    ac_vs_ly: 2.3,
    variationDirectionAc: "up",
    variationDirectionVsLy: "up",
    country: {
      imageIcon: "https://example.com/icon.png",
      imageWaving: "",
    },
    ...overrides,
  });

  const wrapInput = (rows: Record<string, unknown>[]) => ({
    datasources: {
      "category_category-health_overview": rows,
    },
  });

  const getCompiledExpression = async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/category/category-health/overview.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    const compiled = jsonata(expression);
    registerHelpers(compiled);
    return compiled;
  };

  const filterNonEmptyGroups = (rows: any[][]) =>
    rows.filter((g: any[]) => g.length > 0);

  it("should return empty flag when datasource has no data", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(wrapInput([]));

    expect(result).toEqual({ empty: true });
  });

  it("should build category-based column headers", async () => {
    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(
      wrapInput([makeRow({ category: "Beer" })]),
    );

    expect(result.tableData).toHaveProperty("header");
    expect(result.tableData).toHaveProperty("rows");

    const cols = result.tableData.header;
    expect(cols.map((c: any) => c.title)).toEqual([
      "Countries",
      "Beer Volume",
      "BICL",
      "Share of Throat",
      "Beer Participation",
      "WMTBB",
    ]);
  });

  it("should sort Global first then M(highest) to M(lowest), grouping countries per maturity", async () => {
    const rows = [
      makeRow({ maturity: "M1", country_iso_code_3: "BRA" }),
      makeRow({ maturity: "M5", country_iso_code_3: "JPN" }),
      makeRow({ maturity: "N/A", country_iso_code_3: "ABI" }),
      makeRow({ maturity: "M3", country_iso_code_3: "USA" }),
      makeRow({
        maturity: "M3",
        country_iso_code_3: "GBR",
        country: { imageIcon: "https://gbr-flag.png", imageWaving: "" },
      }),
      makeRow({ maturity: "M4", country_iso_code_3: "CHN" }),
    ];

    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(wrapInput(rows));
    const groups = filterNonEmptyGroups(result.tableData.rows);

    expect(groups).toHaveLength(5);

    expect(groups[0][0].rowGroup).toBe("Global");
    expect(groups[0][0].countries).toEqual({ value: "Global", icon: "World" });

    expect(groups[1][0].rowGroup).toBe("M5");
    expect(groups[2][0].rowGroup).toBe("M4");

    expect(groups[3]).toHaveLength(2);
    expect(groups[3][0].countries).toMatchObject({
      value: "USA",
      img: "https://example.com/icon.png",
    });
    expect(groups[3][1].countries).toMatchObject({
      value: "GBR",
      img: "https://gbr-flag.png",
    });

    expect(groups[4][0].rowGroup).toBe("M1");
  });

  it("should show maturity aggregate rows (ABI with non-N/A maturity) as highlight row then country rows", async () => {
    const rows = [
      makeRow({ maturity: "N/A", country_iso_code_3: "ABI", ac: 100 }),
      makeRow({ maturity: "M3", country_iso_code_3: "ABI", ac: 999 }),
      makeRow({ maturity: "M3", country_iso_code_3: "USA", ac: 50 }),
    ];

    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(wrapInput(rows));

    const groups = filterNonEmptyGroups(result.tableData.rows);
    const m3Group = groups[1];
    expect(m3Group).toHaveLength(2);
    expect(m3Group[0].highlight).toBe(true);
    expect(m3Group[0].countries.value).toBe("M3");
    expect(m3Group[0].bv_fy).toBe("999.0");
    expect(m3Group[1].bv_fy).toBe("50.0");
  });

  it("should map KPI fields, merge per country, and default missing KPIs to dash", async () => {
    const rows = [
      makeRow({
        maturity: "M3",
        country_iso_code_3: "USA",
        kpi_name: "cat_health_volume",
        ac: 352500,
        ac_vs_ly: 3.2,
      }),
      makeRow({
        maturity: "M3",
        country_iso_code_3: "USA",
        kpi_name: "cat_health_icl",
        ac: 16.8,
        ac_vs_ly: 2.4,
        comp_unit_of_measure: "pp",
      }),
      makeRow({
        maturity: "M3",
        country_iso_code_3: "USA",
        kpi_name: "wmtbb",
        ac: 6.1,
        ac_vs_ly: -0.5,
      }),
    ];

    const compiled = await getCompiledExpression();
    const result = await compiled.evaluate(wrapInput(rows));

    const usaRow = filterNonEmptyGroups(result.tableData.rows)[0][0];

    expect(usaRow.bv_fy).toBe("352,500.0");
    expect(usaRow.bv_vsly).toEqual({
      value: "3.2",
      unitMeasure: "%",
      variationDirection: "up",
    });

    expect(usaRow.bicl_fy).toBe("16.8");
    expect(usaRow.bicl_vsly.unitMeasure).toBe("pp");

    expect(usaRow.wmtbb_fy).toBe("6.1");

    expect(usaRow.sot_fy).toBe("-");
    expect(usaRow.sot_vsly).toBe("-");
    expect(usaRow.bp_fy).toBe("-");
    expect(usaRow.bp_vsly).toBe("-");
  });

  describe("tooltipContent by category", () => {
    const getHeaderCol = (result: any, id: string) =>
      result.tableData.header.find((c: any) => c.id === id);

    it("should set Beer volume and BICL tooltips for category Beer", async () => {
      const compiled = await getCompiledExpression();
      const result = await compiled.evaluate(
        wrapInput([makeRow({ category: "Beer" })]),
      );
      const volumeCol = getHeaderCol(result, "beerVolume");
      const biclCol = getHeaderCol(result, "bicl");
      expect(volumeCol.tooltipContent).toContain(
        "Total beer volume consumed by legal drinking age consumers",
      );
      expect(biclCol.tooltipContent).toContain(
        "BICL = Beer Industry Consumption Level",
      );
      expect(biclCol.tooltipContent).toContain(
        "BICL = Beer Volume / # LDA+ Consumers",
      );
    });

    it("should set Beyond Beer volume tooltip for category Beyond Beer", async () => {
      const compiled = await getCompiledExpression();
      const result = await compiled.evaluate(
        wrapInput([makeRow({ category: "Beyond Beer" })]),
      );
      const volumeCol = getHeaderCol(result, "beerVolume");
      expect(volumeCol.tooltipContent).toContain(
        "Total beyond beer volume consumed by",
      );
    });

    it("should set Beer + Beyond Beer volume tooltip for category Beer + Beyond Beer", async () => {
      const compiled = await getCompiledExpression();
      const result = await compiled.evaluate(
        wrapInput([makeRow({ category: "Beer + Beyond Beer" })]),
      );
      const volumeCol = getHeaderCol(result, "beerVolume");
      expect(volumeCol.tooltipContent).toContain(
        "Total beer + beyond beer volume consumed by",
      );
    });

    it("should set WMTBB tooltip (same for all categories)", async () => {
      const compiled = await getCompiledExpression();
      const beerResult = await compiled.evaluate(
        wrapInput([makeRow({ category: "Beer" })]),
      );
      const bybResult = await compiled.evaluate(
        wrapInput([makeRow({ category: "Beyond Beer" })]),
      );
      const wmtbbBeer = getHeaderCol(beerResult, "wmtbb").tooltipContent;
      const wmtbbByb = getHeaderCol(bybResult, "wmtbb").tooltipContent;
      expect(wmtbbBeer).toContain("WMTBB = Working Minutes to Buy Beer");
      expect(wmtbbByb).toContain("WMTBB = Working Minutes to Buy Beer");
      expect(wmtbbBeer).toEqual(wmtbbByb);
    });
  });
});

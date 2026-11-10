import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DATASOURCE_KEY = "category_category-health_drill-down_line-chart-drill";

describe("category category-health drill-down line-chart formatter", () => {
  const makeRow = (overrides: Record<string, unknown> = {}) => ({
    dt_ini: "2025-01-01T00:00:00.000Z",
    dt_end: "2025-12-01T00:00:00.000Z",
    abi_zone: "SAZ",
    country_iso_code_3: "BRA",
    ac: 151377,
    ac_vs_ly: 1.7,
    unit_of_measure: "k hl",
    comp_unit_of_measure: "%",
    category: "Beer",
    kpi_name: "cat_health_volume",
    vs_ly_label_suffix: "YTD",
    variationDirectionAc: "up",
    variationDirectionVsLy: "up",
    refreshMonthLabel: "Dec'25",
    lyMonthLabel: "Dec'24",
    country: {
      imageIcon: "https://example.com/BRA.png",
      imageWaving: "https://example.com/Brazil.png",
    },
    ...overrides,
  });

  const wrapInput = (rows: Record<string, unknown>[]) => ({
    datasources: { [DATASOURCE_KEY]: rows },
  });

  const getCompiled = async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/category/category-health/drill-down/line-chart-drill.jsonata",
    );
    const compiled = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiled);
    return compiled;
  };

  it("returns empty when datasource has no data", async () => {
    const compiled = await getCompiled();
    expect(await compiled.evaluate(wrapInput([]))).toEqual({ empty: true });
  });

  it("returns beerVolume and drivers when volume + lda_size + ICL present", async () => {
    const rows = [
      makeRow({
        kpi_name: "cat_health_volume",
        dt_end: "2024-12-01T00:00:00.000Z",
        ac: 148817,
        ac_vs_ly: null,
      }),
      makeRow({
        kpi_name: "cat_health_volume",
        dt_end: "2025-12-01T00:00:00.000Z",
        ac: 151377,
        ac_vs_ly: 1.7,
      }),
      makeRow({
        kpi_name: "lda_size",
        category: "N/A",
        dt_end: "2024-12-01T00:00:00.000Z",
        ac: 161492928,
        ac_vs_ly: null,
        unit_of_measure: "#",
      }),
      makeRow({
        kpi_name: "lda_size",
        category: "N/A",
        dt_end: "2025-12-01T00:00:00.000Z",
        ac: 162837315,
        ac_vs_ly: 0.8,
        unit_of_measure: "#",
      }),
      makeRow({
        kpi_name: "cat_health_icl",
        dt_end: "2024-12-01T00:00:00.000Z",
        ac: 92.2,
        ac_vs_ly: null,
        unit_of_measure: "l / year",
      }),
      makeRow({
        kpi_name: "cat_health_icl",
        dt_end: "2025-12-01T00:00:00.000Z",
        ac: 93,
        ac_vs_ly: 0.9,
        unit_of_measure: "l / year",
      }),
    ];
    const compiled = await getCompiled();
    const result = await compiled.evaluate(wrapInput(rows));

    expect(result.beerVolume).toBeDefined();
    expect(result.beerVolume.title).toBe("Beer Volume Performance");
    expect(result.beerVolume.chartLabel).toBe("Beer Volume");
    expect(result.beerVolume.unit).toBe("k hl");
    expect(result.beerVolume.labels[0]).toBe("2024");
    expect(result.beerVolume.labels[1]).toBe("2025");
    expect(result.beerVolume.values[0]).toBe(148817);
    expect(result.beerVolume.values[1]).toBe(151377);
    expect(result.beerVolume.comparisonData[0]).toMatchObject({
      value: "-",
      measure: "",
      color: "#5C5C5C",
    });
    expect(result.beerVolume.comparisonData[1]).toMatchObject({
      value: "1.7",
      color: "#007800",
    });

    expect(result.drivers).toBeDefined();
    expect(result.drivers.title).toBe("Drivers");
    expect(result.drivers.iclLabel).toBe("BICL");
    expect(result.drivers.populationValues[0]).toBe(161492928);
    expect(result.drivers.iclValues[0]).toBe(92.2);
  });

  it("shows dash without measure when ac_vs_ly is null on non-first rows", async () => {
    const rows = [
      makeRow({
        kpi_name: "cat_health_volume",
        dt_end: "2023-12-01T00:00:00.000Z",
        ac: 145000,
        ac_vs_ly: null,
      }),
      makeRow({
        kpi_name: "cat_health_volume",
        dt_end: "2024-12-01T00:00:00.000Z",
        ac: 148817,
        ac_vs_ly: 2.6,
      }),
      makeRow({
        kpi_name: "cat_health_volume",
        dt_end: "2025-12-01T00:00:00.000Z",
        ac: 151377,
        ac_vs_ly: null,
      }),
    ];
    const compiled = await getCompiled();
    const result = await compiled.evaluate(wrapInput(rows));

    expect(result.beerVolume.comparisonData[0]).toMatchObject({
      value: "-",
      measure: "",
      color: "#5C5C5C",
    });
    expect(result.beerVolume.comparisonData[1]).toMatchObject({
      value: "2.6",
      measure: "%",
      color: "#007800",
    });
    expect(result.beerVolume.comparisonData[2]).toMatchObject({
      value: "-",
      measure: "",
      color: "#5C5C5C",
    });
  });

  it("returns beerIcl when only ICL rows present (no volume)", async () => {
    const rows = [
      makeRow({
        kpi_name: "cat_health_icl",
        dt_end: "2023-12-01T00:00:00.000Z",
        ac: 92.4,
        ac_vs_ly: null,
        unit_of_measure: "l / year",
      }),
      makeRow({
        kpi_name: "cat_health_icl",
        dt_end: "2024-12-01T00:00:00.000Z",
        ac: 92.2,
        ac_vs_ly: -0.3,
        unit_of_measure: "l / year",
      }),
      makeRow({
        kpi_name: "cat_health_icl",
        dt_end: "2025-12-01T00:00:00.000Z",
        ac: 93,
        ac_vs_ly: 0.9,
        unit_of_measure: "l / year",
      }),
    ];
    const compiled = await getCompiled();
    const result = await compiled.evaluate(wrapInput(rows));

    expect(result.beerIcl).toBeDefined();
    expect(result.beerVolume).toBeUndefined();
    expect(result.beerIcl.title).toBe("BICL Performance");
    expect(result.beerIcl.labels[0]).toBe("2023");
    expect(result.beerIcl.comparisonData[1].color).toBe("#C80000");
    expect(result.beerIcl.comparisonData[2].color).toBe("#007800");
  });

  const sotRow = (
    year: string,
    category: string,
    ac: number,
    ac_vs_ly: number | null,
  ) =>
    makeRow({
      kpi_name: "cat_health_sot",
      dt_end: `${year}-12-01T00:00:00.000Z`,
      dt_ini: `${year}-01-01T00:00:00.000Z`,
      ac,
      ac_vs_ly,
      category,
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
    });

  const allSotRows = [
    sotRow("2024", "Beer", 71.4, 0.4),
    sotRow("2024", "Beer + Beyond Beer", 72.2, 0.5),
    sotRow("2024", "Beyond Beer", 0.8, 0),
    sotRow("2024", "Spirits", 24.1, -0.3),
    sotRow("2024", "Wine", 3.6, -0.1),
    sotRow("2025", "Beer", 71.8, 0.4),
    sotRow("2025", "Beer + Beyond Beer", 72.6, 0.4),
    sotRow("2025", "Beyond Beer", 0.8, 0),
    sotRow("2025", "Spirits", 23.5, -0.6),
    sotRow("2025", "Wine", 3.8, 0.2),
  ];

  it("returns shareOfThroat with 4 categories when Beer selected (excludes Beer + Beyond Beer)", async () => {
    const compiled = await getCompiled();
    const result = await compiled.evaluate(wrapInput(allSotRows));

    expect(result.shareOfThroat).toBeDefined();
    expect(result.shareOfThroat.title).toBe("Share of Throat");
    expect(result.shareOfThroat.subtitle).toBe("[%]");
    expect(result.shareOfThroat.chartData.columns).toHaveLength(2);

    const col2024 = result.shareOfThroat.chartData.columns[0];
    expect(col2024.label).toBe("2024");
    expect(col2024.segments).toHaveLength(4);
    expect(col2024.segments[0].value).toBe("71.4");
    expect(col2024.segments[1].value).toBe("0.8");
    expect(col2024.segments[2].value).toBe("24.1");
    expect(col2024.segments[3].value).toBe("3.6");

    expect(result.shareOfThroat.chartData.colors).toHaveLength(4);
    expect([...result.shareOfThroat.chartData.colors]).toEqual([
      "#EFD328",
      "#D9AA4A",
      "#69ACE3",
      "#EC8AB0",
    ]);
    expect(result.shareOfThroat.chartData.connectorColors).toHaveLength(4);
    expect([...result.shareOfThroat.chartData.connectorColors]).toEqual([
      "#F0DF78",
      "#EEC879",
      "#A1CFF4",
      "#F6B7D0",
    ]);

    const legends = [...result.shareOfThroat.chartData.legends];
    expect(legends).toEqual(["Beer", "Beyond Beer", "Spirits", "Wine"]);

    const compLine = result.shareOfThroat.chartData.comparisonLine;
    expect(compLine).toHaveLength(4);
    expect(compLine[0].title).toBe("Beer vs LY");
    expect(compLine[0].data[0]).toMatchObject({
      value: "-",
      measure: "",
      color: "#5C5C5C",
    });
    expect(compLine[0].data[1]).toMatchObject({
      value: "0.4",
      measure: "pp",
      color: "#007800",
    });

    expect(compLine[2].title).toBe("Spirits vs LY");
    expect(compLine[2].data[1]).toMatchObject({
      value: "-0.6",
      measure: "pp",
      color: "#C80000",
    });

    expect(compLine[3].title).toBe("Wine vs LY");
    expect(compLine[3].data[1]).toMatchObject({
      value: "0.2",
      measure: "pp",
      color: "#007800",
    });
  });

  it("shows dash without measure for null ac_vs_ly in shareOfThroat comparisonLine", async () => {
    const rows = [
      sotRow("2024", "Beer", 71.4, null),
      sotRow("2024", "Beyond Beer", 0.8, null),
      sotRow("2024", "Spirits", 24.1, null),
      sotRow("2024", "Wine", 3.6, null),
      sotRow("2025", "Beer", 71.8, 0.4),
      sotRow("2025", "Beyond Beer", 0.8, null),
      sotRow("2025", "Spirits", 23.5, -0.6),
      sotRow("2025", "Wine", 3.8, 0.2),
    ];
    const compiled = await getCompiled();
    const result = await compiled.evaluate(wrapInput(rows));

    const compLine = result.shareOfThroat.chartData.comparisonLine;

    expect(compLine[0].data[0]).toMatchObject({
      value: "-",
      measure: "",
      color: "#5C5C5C",
    });
    expect(compLine[0].data[1]).toMatchObject({
      value: "0.4",
      measure: "pp",
      color: "#007800",
    });

    expect(compLine[1].data[0]).toMatchObject({
      value: "-",
      measure: "",
      color: "#5C5C5C",
    });
    expect(compLine[1].data[1]).toMatchObject({
      value: "-",
      measure: "",
      color: "#5C5C5C",
    });
  });

  it("returns shareOfThroat with 3 categories when Beer + Beyond Beer selected (merged)", async () => {
    const rows = allSotRows.map((r) => ({
      ...r,
      category: r.category === "Beer" ? "Beer + Beyond Beer" : r.category,
    }));
    const compiled = await getCompiled();
    const result = await compiled.evaluate(wrapInput(rows));

    expect(result.shareOfThroat).toBeDefined();

    const legends = [...result.shareOfThroat.chartData.legends];
    expect(legends).toEqual(["Beer + Beyond Beer", "Spirits", "Wine"]);

    expect(result.shareOfThroat.chartData.colors).toHaveLength(3);
    expect([...result.shareOfThroat.chartData.colors]).toEqual([
      "#EFD328",
      "#69ACE3",
      "#EC8AB0",
    ]);
    expect(result.shareOfThroat.chartData.connectorColors).toHaveLength(3);
    expect([...result.shareOfThroat.chartData.connectorColors]).toEqual([
      "#F0DF78",
      "#A1CFF4",
      "#F6B7D0",
    ]);

    const col2024 = result.shareOfThroat.chartData.columns[0];
    expect(col2024.segments).toHaveLength(3);

    const compLine = result.shareOfThroat.chartData.comparisonLine;
    expect(compLine).toHaveLength(3);
    expect(compLine[0].title).toBe("Beer + Beyond Beer vs LY");
    expect(compLine[1].title).toBe("Spirits vs LY");
    expect(compLine[2].title).toBe("Wine vs LY");
  });
});

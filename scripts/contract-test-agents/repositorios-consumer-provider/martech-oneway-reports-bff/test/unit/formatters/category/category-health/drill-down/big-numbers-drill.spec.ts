import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const DATASOURCE_KEY = "category_category-health_drill-down_big-numbers-drill";

describe("category category-health drill-down big-numbers formatter", () => {
  const makeRow = (overrides: Record<string, unknown> = {}) => ({
    dt_ini: "2025-01-01T00:00:00.000Z",
    dt_end: "2025-12-01T00:00:00.000Z",
    abi_zone: "SAZ",
    country_iso_code_3: "BRA",
    ac: 51.7,
    ac_vs_ly: -0.6,
    unit_of_measure: "%",
    comp_unit_of_measure: "pp",
    variationDirectionVsLy: "down",
    lyMonthLabel: "Dec'24",
    category: "Beer",
    kpi_name: "p4w",
    country: { imageIcon: "https://example.com/BRA.png", imageWaving: "" },
    ...overrides,
  });

  const wrapInput = (rows: Record<string, unknown>[]) => ({
    datasources: { [DATASOURCE_KEY]: rows },
  });

  const getCompiled = async () => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/category/category-health/drill-down/big-numbers-drill.jsonata",
    );
    const compiled = jsonata(fs.readFileSync(jsonataPath, "utf8"));
    registerHelpers(compiled);
    return compiled;
  };

  it("returns empty when datasource has no data", async () => {
    const compiled = await getCompiled();
    expect(await compiled.evaluate(wrapInput([]))).toEqual({ empty: true });
  });

  it("returns 5 cards with correct structure, titles by category, and formatted values", async () => {
    const rows = [
      makeRow({
        kpi_name: "cat_health_volume",
        category: "Beer",
        ac: 148817,
        ac_vs_ly: 1.7,
        comp_unit_of_measure: "%",
        variationDirectionVsLy: "up",
      }),
      makeRow({ kpi_name: "cat_health_icl", category: "Beer" }),
      makeRow({ kpi_name: "cat_health_sot", category: "Beer" }),
      makeRow({ kpi_name: "p4w", category: "Beer" }),
      makeRow({ kpi_name: "wmtbb", category: "Beer" }),
    ];
    const compiled = await getCompiled();
    const result = await compiled.evaluate(wrapInput(rows));

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(5);
    expect(result[0]).toMatchObject({
      title: "Beer Volume",
      kpiKey: "volume",
      dataTestId: "beer-volume",
      data: [
        {
          bigNumber: { value: "1.7", measure: "%", direction: "up" },
          comparison: { label: "vs", value: "24'FY" },
          secondaryInfo: { value: "148.8K" },
        },
      ],
    });
  });

  it("when ac_vs_ly is null, promotes ac to bigNumber with secondaryInfo label (unit), omits comparison", async () => {
    const compiled = await getCompiled();
    const result = await compiled.evaluate(
      wrapInput([
        makeRow({
          kpi_name: "cat_health_volume",
          ac: 148817,
          ac_vs_ly: null,
          comp_unit_of_measure: "%",
          variationDirectionVsLy: "up",
        }),
      ]),
    );
    expect(result[0].data[0]).toEqual({
      bigNumber: { value: "148.8K", measure: "", direction: "" },
      secondaryInfo: { label: "[ % ]" },
    });
    expect(result[0].data[0].comparison).toBeUndefined();
  });

  it('normalizes unit "k hl" without uppercasing the first letter', async () => {
    const compiled = await getCompiled();
    const result = await compiled.evaluate(
      wrapInput([
        makeRow({
          kpi_name: "cat_health_volume",
          unit_of_measure: "k hl",
          ac: 1000,
          ac_vs_ly: 1,
        }),
      ]),
    );
    expect(result[0].data[0].secondaryInfo?.label).toBe("[ k hl ]");
  });

  it("uses dt_end for comparison when lyMonthLabel is empty", async () => {
    const compiled = await getCompiled();
    const result = await compiled.evaluate(
      wrapInput([
        makeRow({
          kpi_name: "cat_health_volume",
          lyMonthLabel: "",
          dt_end: "2025-12-01T00:00:00.000Z",
          ac: 100,
          ac_vs_ly: 1,
        }),
      ]),
    );
    expect(result[0].data[0].comparison?.value).toBe("25'FY");
  });

  it("uses latest period (max dt_end) per KPI when multiple rows exist", async () => {
    const rows = [
      makeRow({
        kpi_name: "cat_health_volume",
        dt_end: "2023-12-01T00:00:00.000Z",
        ac: 100,
        ac_vs_ly: 1,
      }),
      makeRow({
        kpi_name: "cat_health_volume",
        dt_end: "2025-12-01T00:00:00.000Z",
        ac: 148817,
        ac_vs_ly: 1.7,
      }),
    ];
    const compiled = await getCompiled();
    const result = await compiled.evaluate(wrapInput(rows));
    expect(result[0].data).toHaveLength(1);
    expect(result[0].data[0].bigNumber.value).toBe("1.7");
  });

  it("resolves card titles by category (Beer, Beyond Beer, Beer + Beyond Beer)", async () => {
    const compiled = await getCompiled();
    const beer = await compiled.evaluate(
      wrapInput([makeRow({ kpi_name: "cat_health_volume", category: "Beer" })]),
    );
    const byb = await compiled.evaluate(
      wrapInput([
        makeRow({ kpi_name: "cat_health_volume", category: "Beyond Beer" }),
      ]),
    );
    const bPlusByb = await compiled.evaluate(
      wrapInput([
        makeRow({
          kpi_name: "cat_health_volume",
          category: "Beer + Beyond Beer",
        }),
      ]),
    );
    expect(beer[0].title).toBe("Beer Volume");
    expect(byb[0].title).toBe("BYB Volume");
    expect(bPlusByb[0].title).toBe("B+BYB Volume");
  });

  it("returns WMTBB card empty with specific message when category is not Beer", async () => {
    const result = await (
      await getCompiled()
    ).evaluate(
      wrapInput([
        makeRow({ kpi_name: "cat_health_volume", category: "Beyond Beer" }),
      ]),
    );
    const wmtbb = result[4];
    expect(wmtbb.data).toEqual([]);
    expect(wmtbb.emptyStateMessage).toBe(
      "Choose Beer Product Type to access WMTBB data",
    );
  });

  it("sets emptyStateMessage by KPI when card has no data (participation vs default)", async () => {
    const result = await (
      await getCompiled()
    ).evaluate(
      wrapInput([makeRow({ kpi_name: "cat_health_volume", category: "Beer" })]),
    );
    expect(result[3].data).toEqual([]);
    expect(result[3].emptyStateMessage).toBe(
      "This country does not have Participation data avaliable for this period.",
    );
    expect(result[1].data).toEqual([]);
    expect(result[1].emptyStateMessage).toBe("Data not available");
  });

  it("accepts input wrapped in datasources with data property", async () => {
    const wrapped = {
      datasources: {
        [DATASOURCE_KEY]: {
          data: [makeRow({ kpi_name: "cat_health_volume" })],
        },
      },
    };
    const result = await (await getCompiled()).evaluate(wrapped);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].data).toHaveLength(1);
  });

  it("accepts a single row object (non-array) as datasource data", async () => {
    const row = makeRow({ kpi_name: "cat_health_volume" });
    const wrapped = {
      datasources: { [DATASOURCE_KEY]: row },
    };
    const result = await (await getCompiled()).evaluate(wrapped);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].title).toBe("Beer Volume");
    expect(result[0].data).toHaveLength(1);
  });
});

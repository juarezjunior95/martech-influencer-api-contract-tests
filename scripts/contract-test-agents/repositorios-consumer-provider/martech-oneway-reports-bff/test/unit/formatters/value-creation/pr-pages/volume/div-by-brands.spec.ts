import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("div-by-brands formatter (pr-pages volume)", () => {
  let compiledExpression: jsonata.Expression;

  const DS_NAME = "value-creation_pr-pages_volume_div-by-brands";

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/pr-pages/volume/div-by-brands.jsonata",
  );

  type DatasourceEntry = {
    step_name: string;
    raw_brand: string;
    country_iso_code_3: string;
    ac: number;
    ac_vs_ly: number | null;
    bu: number | null;
    ac_vs_bu: number | null;
    dt_ini?: string;
    dt_end?: string;
    comp_unit_of_measure?: string;
    unit_of_measure?: string;
    portfolio: string;
    period: string;
    vs_ly_label_suffix?: string;
    kpi_name?: string;
    variationDirectionAc?: "up" | "down";
    variationDirectionVsLy: "up" | "down";
    variationDirectionVsBu: "up" | "down";
    brand: { imageSquare: string; imageTable?: string };
    country: { imageIcon: string; imageWaving?: string };
  };

  const country = {
    imageIcon: "https://example.com/usa.png",
    imageWaving: "",
  };

  const createAnchor = (
    stepName: "MTD'25" | "MTD'26" | "YTD'25" | "YTD'26",
    dtEnd: string,
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry => ({
    step_name: stepName,
    raw_brand: stepName,
    country_iso_code_3: "USA",
    ac: 1000,
    ac_vs_ly: null,
    bu: null,
    ac_vs_bu: null,
    dt_end: dtEnd,
    portfolio: "Total",
    period: stepName.startsWith("YTD") ? "YTD" : "MTD",
    vs_ly_label_suffix: stepName.startsWith("YTD") ? "YTD" : "MTD",
    variationDirectionAc: "up",
    variationDirectionVsLy: "up",
    variationDirectionVsBu: "down",
    brand: { imageSquare: "", imageTable: "" },
    country,
    ...overrides,
  });

  const createBrandRow = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry => ({
    step_name: "TestBrand",
    raw_brand: "TestBrand",
    country_iso_code_3: "USA",
    ac: 50,
    ac_vs_ly: 2.5,
    bu: 10,
    ac_vs_bu: -1.2,
    dt_end: "2026-02-01T00:00:00.000Z",
    portfolio: "Megabrands",
    period: "MTD",
    vs_ly_label_suffix: "MTD",
    variationDirectionAc: "up",
    variationDirectionVsLy: "up",
    variationDirectionVsBu: "down",
    brand: {
      imageSquare: "https://example.com/brand.png",
      imageTable: "",
    },
    country,
    ...overrides,
  });

  const createMockInput = (entries: DatasourceEntry[]) => ({
    datasources: {
      [DS_NAME]: entries,
    },
  });

  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => compiledExpression.evaluate(input);

  const toArray = <T = unknown>(value: unknown): T[] => {
    if (value == null) return [];
    if (Array.isArray(value)) return value as T[];
    if (typeof value === "object" && Symbol.iterator in (value as object)) {
      return Array.from(value as Iterable<T>);
    }
    return [];
  };

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return empty state when datasource has no rows", async () => {
    const result = await evaluateExpression(createMockInput([]));

    expect(result).toEqual({ empty: true });
  });

  it("should return empty state when every row is filtered out (non-volume kpi)", async () => {
    const result = await evaluateExpression(
      createMockInput([
        createBrandRow({ kpi_name: "volume_weight" }),
        createBrandRow({ kpi_name: "volume_weight", step_name: "Other" }),
      ]),
    );

    expect(result).toEqual({ empty: true });
  });

  it("should return chart payload with ordered anchors, comparison trend (not color), and baseChartColors", async () => {
    const entries = [
      createBrandRow({ step_name: "TestBrand", raw_brand: "TestBrand" }),
      createAnchor("MTD'25", "2025-02-01T00:00:00.000Z"),
      createAnchor("MTD'26", "2026-02-01T00:00:00.000Z"),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as Record<string, unknown>;

    expect(result.empty).toBeUndefined();
    expect(result.period).toBe("MTD");

    expect([...toArray<string>(result.labels)]).toEqual([
      "Feb'25",
      "TestBrand",
      "Feb'26",
    ]);

    expect([...toArray<number>(result.values)]).toEqual([1000, 50, 1000]);

    const comparisonData = toArray<{ title: string; data: unknown }>(
      (result.comparisonLine as { data: unknown }).data,
    );
    expect(comparisonData.map((l) => l.title)).toEqual(["vs LY", "vs BU"]);

    const vsLy = toArray<Record<string, unknown>>(comparisonData[0].data);
    expect(vsLy[0]).toEqual({ value: "" });
    expect(vsLy[1]).toMatchObject({
      value: "2.5",
      measure: "%",
      trend: "positive",
    });
    expect(vsLy[1]).not.toHaveProperty("color");

    const vsBu = toArray<Record<string, unknown>>(comparisonData[1].data);
    expect(vsBu[0]).toEqual({ value: "" });
    expect(vsBu[1]).toMatchObject({
      measure: "%",
      trend: "negative",
    });
    expect(vsBu[1]).not.toHaveProperty("color");

    expect([...toArray<string | null>(result.baseChartColors)]).toEqual([
      null,
      "Megabrands",
      null,
    ]);

    const legend = toArray<Record<string, string>>(result.legend);
    expect(legend[0]).toMatchObject({ label: "Δ Vol.", shape: "square" });
    expect(legend.some((item) => item.label === "Megabrands")).toBe(true);

    expect(result.brandsAvatar).toEqual(
      expect.objectContaining({
        data: expect.anything(),
      }),
    );
  });

  it("should format YTD anchor labels as YTD'YY from dt_end (not month'YY)", async () => {
    const entries = [
      createAnchor("YTD'25", "2025-02-01T00:00:00.000Z"),
      createBrandRow({ step_name: "TestBrand", raw_brand: "TestBrand" }),
      createAnchor("YTD'26", "2026-02-01T00:00:00.000Z"),
    ];

    const result = (await evaluateExpression(
      createMockInput(entries),
    )) as Record<string, unknown>;

    expect(result.period).toBe("YTD");
    expect([...toArray<string>(result.labels)]).toEqual([
      "YTD'25",
      "TestBrand",
      "YTD'26",
    ]);
  });
});

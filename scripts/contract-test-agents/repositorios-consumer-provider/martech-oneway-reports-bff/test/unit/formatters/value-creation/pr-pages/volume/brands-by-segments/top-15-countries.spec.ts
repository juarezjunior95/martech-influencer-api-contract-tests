import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";
import { waterfallDataSchema } from "@infrastructure/schema/components/waterfall.schema";

describe("brands-by-segments top-15-countries formatter", () => {
  let ajv: Ajv;
  let compiledExpression: jsonata.Expression;

  const DS_NAME = "top-15-countries";

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/pr-pages/volume/brands-by-segments/top-15-countries.jsonata",
  );

  type DatasourceEntry = {
    page_type: string;
    country_iso_code_3: string;
    period_type: string;
    dt_end: string;
    delta: number | null;
    ac_vs_ly: number | null;
    ac_vs_bu: number | null;
    rnk: number;
    vs_ly_label_suffix?: string;
    variationDirectionVsLy: "up" | "down";
    variationDirectionVsBu: "up" | "down";
    variationDirectionDelta: "up" | "down";
    refreshMonthLabel?: string;
    lyMonthLabel?: string;
    country: { imageIcon: string; imageWaving?: string };
  };

  const createEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry => ({
    page_type: "Corona",
    country_iso_code_3: "USA",
    period_type: "MTD",
    dt_end: "2025-12-01T00:00:00.000Z",
    delta: 15.3,
    ac_vs_ly: 2.5,
    ac_vs_bu: 1.8,
    rnk: 1,
    variationDirectionVsLy: "up",
    variationDirectionVsBu: "up",
    variationDirectionDelta: "up",
    country: {
      imageIcon: "https://example.com/usa.png",
      imageWaving: "",
    },
    ...overrides,
  });

  const createABIEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry =>
    createEntry({
      rnk: 0,
      country_iso_code_3: "ABI",
      delta: 155.2,
      ac_vs_ly: null,
      ac_vs_bu: null,
      country: {
        imageIcon: "https://example.com/abi.png",
        imageWaving: "",
      },
      ...overrides,
    });

  const createOthersEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry =>
    createEntry({
      rnk: 16,
      country_iso_code_3: "Others",
      delta: 8.7,
      ac_vs_ly: -0.5,
      ac_vs_bu: -0.3,
      variationDirectionVsLy: "down",
      variationDirectionVsBu: "down",
      variationDirectionDelta: "up",
      country: {
        imageIcon: "https://example.com/others.png",
        imageWaving: "",
      },
      ...overrides,
    });

  const createMockInput = (entries: DatasourceEntry[]) => ({
    datasources: {
      [DS_NAME]: entries,
    },
  });

  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => {
    return await compiledExpression.evaluate(input);
  };

  const ensureArray = (v: any): any[] => {
    if (v == null) return [];
    return Array.isArray(v) ? v : [v];
  };

  const transformForSchema = (jsonataResult: any) => {
    if (!jsonataResult || Object.keys(jsonataResult).length === 0) {
      return jsonataResult;
    }
    const values = getValueSeries(jsonataResult);
    const labels = toPlainStringArray(jsonataResult.labels);
    const rawComparison = ensureArray(jsonataResult.comparisonLine?.data);
    const comparisonLineData = rawComparison.map((line: any) => ({
      title: line.title,
      data: ensureArray(line.data).map((cell: any) => ({
        value: cell.value ?? "",
        measure: cell.measure ?? "",
        ...(cell.trend !== undefined ? { trend: cell.trend } : {}),
        ...(cell.color !== undefined ? { color: cell.color } : {}),
      })),
    }));
    const brandsImg = ensureArray(jsonataResult.brandsAvatar?.data);
    return { data: values, labels, comparisonLineData, brandsImg };
  };

  const toPlainStringArray = (labels: any): string[] => {
    if (labels == null) return [];
    if (typeof labels === "string") return [labels];
    return Array.from(labels as Iterable<string>);
  };

  const getValueSeries = (result: any): number[] => {
    const v = result.values;
    if (v == null || (Array.isArray(v) && v.length === 0)) return [];
    const first = (v as number[] | number[][])[0];
    return Array.isArray(first) ? (first as number[]) : (v as number[]);
  };

  const getFormattedSeries = (result: any): string[] => {
    const f = result.formattedData;
    if (f == null || (Array.isArray(f) && f.length === 0)) return [];
    const first = (f as string[] | string[][])[0];
    return Array.isArray(first) ? (first as string[]) : (f as string[]);
  };

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);

    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return empty object when datasource is empty", async () => {
    const mockInput = createMockInput([]);
    const result = await evaluateExpression(mockInput);

    expect(result).toEqual({ empty: true });
  });

  it("should format valid waterfall data correctly", async () => {
    const entries = [
      createABIEntry({
        rnk: 0,
        dt_end: "2025-01-01T00:00:00.000Z",
        delta: 150.0,
      }),
      createEntry({
        rnk: 1,
        country_iso_code_3: "USA",
        delta: 15.3,
        ac_vs_ly: 2.5,
        ac_vs_bu: 1.8,
      }),
      createEntry({
        rnk: 2,
        country_iso_code_3: "BRA",
        delta: 12.7,
        ac_vs_ly: -1.2,
        ac_vs_bu: -0.8,
        variationDirectionVsLy: "down",
        variationDirectionVsBu: "down",
      }),
      createOthersEntry(),
      createABIEntry({
        rnk: 99,
        dt_end: "2026-01-01T00:00:00.000Z",
        delta: 155.2,
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();
    expect(result.values).toBeDefined();
    expect(Array.isArray(result.values)).toBe(true);

    const values = getValueSeries(result);
    expect(values.length).toBe(5);

    const labels = toPlainStringArray(result.labels);
    expect(labels.length).toBe(5);
    expect(labels[0]).toBe("Jan'25");
    expect(labels[1]).toBe("USA");
    expect(labels[2]).toBe("BRA");
    expect(labels[3]).toBe("Others");
    expect(labels[4]).toBe("Jan'26");

    expect(result.formattedData).toBeDefined();
    expect(Array.isArray(result.formattedData)).toBe(true);

    expect(result.period).toBe("MTD");
    expect(result.legend).toBeDefined();
    expect(Array.isArray(result.legend)).toBe(true);

    expect(result.comparisonLine).toBeDefined();
    expect(result.comparisonLine.data).toBeDefined();
    expect(Array.isArray(result.comparisonLine.data)).toBe(true);

    expect(result.brandsAvatar).toBeDefined();
    expect(result.brandsAvatar.data).toBeDefined();
    expect(Array.isArray(result.brandsAvatar.data)).toBe(true);
  });

  it("should map waterfall totals (rnk 0 / 99) to YTD'YY when period_type is YTD", async () => {
    const entries = [
      createABIEntry({
        rnk: 99,
        period_type: "YTD",
        dt_end: "2026-03-15T00:00:00.000Z",
        delta: 100,
        ac_vs_ly: 2,
        ac_vs_bu: 1,
        variationDirectionVsLy: "up",
        variationDirectionVsBu: "up",
      }),
      createABIEntry({
        rnk: 0,
        period_type: "YTD",
        dt_end: "2025-12-01T00:00:00.000Z",
        delta: 80,
        ac_vs_ly: 1,
        ac_vs_bu: 0.5,
        variationDirectionVsLy: "up",
        variationDirectionVsBu: "up",
      }),
      createEntry({
        rnk: 1,
        period_type: "YTD",
        country_iso_code_3: "BRA",
        delta: 20,
        ac_vs_ly: 3,
        ac_vs_bu: -1,
      }),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const labels = toPlainStringArray(result.labels);

    expect(labels).toEqual(["YTD'25", "BRA", "YTD'26"]);
  });

  it("should handle YTD period correctly for specific page types", async () => {
    const entries = [
      createEntry({
        page_type: "Corona",
        period_type: "YTD",
        delta: 15.3,
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.period).toBe("YTD");
  });

  it("should handle MTD period for regular page types", async () => {
    const entries = [
      createEntry({
        page_type: "Corona",
        period_type: "MTD",
        delta: 15.3,
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.period).toBe("MTD");
  });

  it("should format large numbers correctly", async () => {
    const entries = [
      createEntry({ rnk: 1, delta: 1500000 }),
      createEntry({
        rnk: 2,
        country_iso_code_3: "BRA",
        delta: 2500,
      }),
      createEntry({
        rnk: 3,
        country_iso_code_3: "MEX",
        delta: 55.2,
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    const formatted = getFormattedSeries(result);
    expect(formatted[0]).toBe("1.5M");
    expect(formatted[1]).toBe("2.5K");
    expect(formatted[2]).toBe("55.2");
  });

  it("should format negative numbers correctly", async () => {
    const entries = [
      createEntry({
        rnk: 1,
        delta: -1500000,
        variationDirectionDelta: "down",
      }),
      createEntry({
        rnk: 2,
        country_iso_code_3: "BRA",
        delta: -2500,
        variationDirectionDelta: "down",
      }),
      createEntry({
        rnk: 3,
        country_iso_code_3: "MEX",
        delta: -55.2,
        variationDirectionDelta: "down",
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    const formatted = getFormattedSeries(result);
    expect(formatted[0]).toBe("-1.5M");
    expect(formatted[1]).toBe("-2.5K");
    expect(formatted[2]).toBe("-55.2");
  });

  it("should handle ABI entries correctly (use delta for value)", async () => {
    const entries = [
      createABIEntry({
        rnk: 0,
        dt_end: "2025-01-01T00:00:00.000Z",
        delta: 155.2,
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    const values = getValueSeries(result);
    expect(values[0]).toBe(155.2);
  });

  it("should handle comparison line data correctly", async () => {
    const entries = [
      createABIEntry({
        rnk: 0,
        dt_end: "2025-01-01T00:00:00.000Z",
        ac_vs_ly: null,
        ac_vs_bu: null,
      }),
      createEntry({
        rnk: 1,
        ac_vs_ly: 2.5,
        ac_vs_bu: 1.8,
      }),
      createEntry({
        rnk: 2,
        country_iso_code_3: "BRA",
        ac_vs_ly: -1.2,
        ac_vs_bu: -0.8,
        variationDirectionVsLy: "down",
        variationDirectionVsBu: "down",
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    const comparisonData = result.comparisonLine.data;
    expect(Array.isArray(comparisonData)).toBe(true);
    expect(comparisonData.length).toBe(2);

    const vsLy = comparisonData.find((c: any) => c.title === "vs LY");
    const vsBu = comparisonData.find((c: any) => c.title === "vs BU");

    expect(vsLy.data[0]).toEqual({ value: "" });
    expect(vsBu.data[0]).toEqual({ value: "" });

    expect(vsLy.data[1].value).toBeDefined();
    expect(vsLy.data[1].measure).toBe("%");
    expect(vsLy.data[1].trend).toBeDefined();
  });

  it("should handle different page types correctly", async () => {
    const entries = [
      createEntry({
        page_type: "Corona",
        country_iso_code_3: "USA",
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();
    expect(toPlainStringArray(result.labels)[0]).toBe("USA");
  });

  it("should maintain correct order by rank", async () => {
    const entries = [
      createEntry({
        rnk: 2,
        country_iso_code_3: "BRA",
        delta: 12.7,
      }),
      createABIEntry({
        rnk: 0,
        dt_end: "2025-01-01T00:00:00.000Z",
        delta: 155.2,
      }),
      createEntry({
        rnk: 1,
        country_iso_code_3: "USA",
        delta: 15.3,
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    const labels = toPlainStringArray(result.labels);
    expect(labels[0]).toBe("Jan'25");
    expect(labels[1]).toBe("USA");
    expect(labels[2]).toBe("BRA");
  });

  it("should validate against waterfallDataSchema", async () => {
    const entries = [
      createABIEntry({
        rnk: 0,
        dt_end: "2025-01-01T00:00:00.000Z",
        delta: 150.0,
      }),
      createEntry({
        rnk: 1,
        country_iso_code_3: "USA",
        delta: 15.3,
        ac_vs_ly: 2.5,
        ac_vs_bu: 1.8,
      }),
      createEntry({
        rnk: 2,
        country_iso_code_3: "BRA",
        delta: 12.7,
        ac_vs_ly: -1.2,
        ac_vs_bu: -0.8,
        variationDirectionVsLy: "down",
        variationDirectionVsBu: "down",
      }),
      createABIEntry({
        rnk: 99,
        dt_end: "2026-01-01T00:00:00.000Z",
        delta: 155.2,
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    const transformedResult = transformForSchema(result);
    const validate = ajv.compile(waterfallDataSchema);
    const isValid = validate(transformedResult);

    if (!isValid && validate.errors) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }

    expect(isValid).toBe(true);
  });

  it("should include all required output fields", async () => {
    const entries = [
      createABIEntry({ rnk: 0, dt_end: "2025-01-01T00:00:00.000Z" }),
      createEntry(),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result).toHaveProperty("values");
    expect(result).toHaveProperty("formattedData");
    expect(result).toHaveProperty("labels");
    expect(result).toHaveProperty("period");
    expect(result).toHaveProperty("legend");
    expect(result).toHaveProperty("comparisonLine");
    expect(result).toHaveProperty("brandsAvatar");

    expect(result.comparisonLine).toHaveProperty("data");
    expect(result.brandsAvatar).toHaveProperty("data");
  });

  it("should return legend labels with delta symbol and trending icons", async () => {
    const entries = [
      createEntry({
        variationDirectionDelta: "up",
        delta: 10.2,
      }),
      createEntry({
        rnk: 2,
        country_iso_code_3: "BRA",
        variationDirectionDelta: "down",
        delta: -4.4,
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.legend).toBeDefined();
    expect(Array.isArray(result.legend)).toBe(true);
    expect(result.legend.length).toBeGreaterThanOrEqual(2);

    expect(result.legend[0].label).toBe("Δ Vol.");
    expect(result.legend[1].label).toBe("Δ Vol.");

    expect(result.legend[0].label).not.toContain("Delta");
    expect(result.legend[1].label).not.toContain("Delta");
    expect(result.legend[0].label).not.toContain("¬");
    expect(result.legend[1].label).not.toContain("¬");

    expect(result.legend[0].icon).toBe("TrendingUp");
    expect(result.legend[1].icon).toBe("TrendingDown");
  });

  it("should handle null comparison values gracefully", async () => {
    const entries = [
      createEntry({
        ac_vs_ly: null,
        ac_vs_bu: null,
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();

    const comparisonData = ensureArray(result.comparisonLine.data);
    expect(comparisonData.length).toBe(2);

    const vsLy = comparisonData.find((c: any) => c.title === "vs LY");
    const firstCell = Array.isArray(vsLy.data) ? vsLy.data[0] : vsLy.data;
    expect(firstCell).toBeDefined();
    expect(firstCell.value).toBe("-");
  });

  it("should handle Beyond Beer page type (YTD period)", async () => {
    const entries = [
      createEntry({
        page_type: "Beyond Beer",
        period_type: "YTD",
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.period).toBe("YTD");
  });

  it("should handle Non Alc page type (YTD period)", async () => {
    const entries = [
      createEntry({
        page_type: "Non Alc",
        period_type: "YTD",
      }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.period).toBe("YTD");
  });
});

import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";
import { waterfallDataSchema } from "@infrastructure/schema/components/waterfall.schema";

describe("market-share top-15-countries formatter", () => {
  let ajv: Ajv;
  let compiledExpression: jsonata.Expression;

  const DS_NAME = "value-creation_pr-pages_market-share_top-15-countries";

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/pr-pages/market-share/top-15-countries.jsonata",
  );

  type DatasourceEntry = {
    labels: string;
    raw_brand: string;
    country_iso_code_3: string;
    product_type: string;
    ac: number | null;
    delta: number | null;
    vs_ly: number | null;
    vol_vs_ly: number | null;
    vol_weight: number | null;
    unit_of_measure: string;
    comp_unit_of_measure: string;
    filter_dt_end: string;
    filter_period_type: string;
    filter_waterfall_filter: string;
    filter_country: string;
    filter_zone: string;
    filter_brand: string;
    filter_max_ranked: string;
    rnk: number;
    vs_ly_label_suffix: string;
    variationDirectionAc: "up" | "down";
    variationDirectionVolVsLy: "up" | "down";
    variationDirectionDelta: "up" | "down";
    refreshMonthLabel?: string;
    lyMonthLabel?: string;
    dt_end: string;
    brand: { imageSquare: string; imageTable?: string };
    country: { imageIcon: string; imageWaving?: string };
  };

  const createEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry => ({
    labels: "USA",
    raw_brand: "",
    country_iso_code_3: "USA",
    product_type: "",
    ac: 39.5,
    delta: 0.3,
    vs_ly: 0.3,
    vol_vs_ly: -7.5,
    vol_weight: 16.56,
    unit_of_measure: "%",
    comp_unit_of_measure: "pp",
    filter_dt_end: "2026-02-01",
    filter_period_type: "MTD",
    filter_waterfall_filter: "country",
    filter_country: "ABI",
    filter_zone: "ABI",
    filter_brand: "All",
    filter_max_ranked: "15",
    rnk: 2,
    vs_ly_label_suffix: "MTD",
    variationDirectionAc: "up",
    variationDirectionVolVsLy: "down",
    variationDirectionDelta: "up",
    refreshMonthLabel: "",
    lyMonthLabel: "",
    dt_end: "2026-03-01T00:00:00.000Z",
    brand: { imageSquare: "https://example.com/brand.png", imageTable: "" },
    country: {
      imageIcon: "https://example.com/usa.png",
      imageWaving: "https://example.com/usa-wave.png",
    },
    ...overrides,
  });

  const createTotalStartEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry =>
    createEntry({
      labels: "Mar'25",
      country_iso_code_3: "ABI",
      ac: 54.9,
      delta: null,
      vs_ly: null,
      vol_vs_ly: null,
      vol_weight: null,
      rnk: 0,
      dt_end: "2025-03-01T00:00:00.000Z",
      country: {
        imageIcon: "https://example.com/abi.png",
        imageWaving: "",
      },
      ...overrides,
    });

  const createTotalEndEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry =>
    createEntry({
      labels: "Mar'26",
      country_iso_code_3: "ABI",
      ac: 55.2,
      delta: 0.3,
      vs_ly: 0.3,
      vol_vs_ly: -0.5,
      vol_weight: 1,
      rnk: 17,
      dt_end: "2026-03-01T00:00:00.000Z",
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
      labels: "Others",
      country_iso_code_3: "Others",
      ac: -763.5,
      delta: -5.1,
      vs_ly: -5.1,
      vol_vs_ly: 0.6,
      vol_weight: -1.24,
      rnk: 16,
      variationDirectionAc: "down",
      variationDirectionVolVsLy: "up",
      variationDirectionDelta: "down",
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
    const firstLevel = (f as any)[0];
    if (Array.isArray(firstLevel) && Array.isArray(firstLevel[0])) {
      return firstLevel[0] as string[];
    }
    return Array.isArray(firstLevel)
      ? (firstLevel as string[])
      : (f as string[]);
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
      createTotalStartEntry(),
      createEntry({
        rnk: 1,
        country_iso_code_3: "BRA",
        ac: 59.1,
        vs_ly: 1.4,
        vol_vs_ly: 2.2,
      }),
      createEntry({
        rnk: 2,
        country_iso_code_3: "USA",
        ac: 39.5,
        vs_ly: 0.3,
        vol_vs_ly: -7.5,
      }),
      createOthersEntry(),
      createTotalEndEntry(),
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
    expect(labels[0]).toBe("Mar'25");
    expect(labels[1]).toBe("BRA");
    expect(labels[2]).toBe("USA");
    expect(labels[3]).toBe("Others");
    expect(labels[4]).toBe("Mar'26");

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

  it("should return values containing the expected ac numbers in order", async () => {
    const entries = [
      createTotalStartEntry({ delta: 0 }),
      createEntry({ rnk: 1, country_iso_code_3: "BRA", delta: 0.3 }),
      createTotalEndEntry({ delta: 0.3 }),
    ];

    const result = await evaluateExpression(createMockInput(entries));

    expect(Array.isArray(result.values)).toBe(true);

    const values = getValueSeries(result);
    expect(values).toEqual([0, 0.3, 0.3]);
  });

  it("should append % to formatted bar labels for grey ABI anchor rows (country ISO ABI) only", async () => {
    const entries = [
      createTotalStartEntry({ delta: 54.9 }),
      createEntry({ rnk: 1, country_iso_code_3: "BRA", delta: 59.1 }),
      createTotalEndEntry({ delta: 55.2 }),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const formatted = getFormattedSeries(result);

    expect(formatted).toEqual(["54.9%", "59.1", "55.2%"]);
  });

  it("should map waterfall totals to YTD'YY when filter_period_type is YTD", async () => {
    const entries = [
      createTotalStartEntry({
        filter_period_type: "YTD",
        dt_end: "2025-03-15T00:00:00.000Z",
      }),
      createEntry({
        rnk: 1,
        country_iso_code_3: "BRA",
        filter_period_type: "YTD",
      }),
      createTotalEndEntry({
        filter_period_type: "YTD",
        dt_end: "2026-03-15T00:00:00.000Z",
      }),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const labels = toPlainStringArray(result.labels);

    expect(labels).toEqual(["YTD'25", "BRA", "YTD'26"]);
  });

  it("should map waterfall totals to Mon'YY when filter_period_type is MTD", async () => {
    const entries = [
      createTotalStartEntry({
        filter_period_type: "MTD",
        dt_end: "2025-03-01T00:00:00.000Z",
      }),
      createEntry({
        rnk: 1,
        country_iso_code_3: "BRA",
        filter_period_type: "MTD",
      }),
      createTotalEndEntry({
        filter_period_type: "MTD",
        dt_end: "2026-03-01T00:00:00.000Z",
      }),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const labels = toPlainStringArray(result.labels);

    expect(labels[0]).toBe("Mar'25");
    expect(labels[2]).toBe("Mar'26");
  });

  it("should propagate period from filter_period_type", async () => {
    const ytdResult = await evaluateExpression(
      createMockInput([createEntry({ filter_period_type: "YTD" })]),
    );
    expect(ytdResult.period).toBe("YTD");

    const mtdResult = await evaluateExpression(
      createMockInput([createEntry({ filter_period_type: "MTD" })]),
    );
    expect(mtdResult.period).toBe("MTD");
  });

  it("should format compact numbers correctly", async () => {
    const entries = [
      createEntry({ rnk: 1, country_iso_code_3: "USA", delta: 0.3 }),
      createEntry({ rnk: 2, country_iso_code_3: "BRA", delta: 0.3 }),
      createEntry({ rnk: 3, country_iso_code_3: "MEX", delta: 0.3 }),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const formatted = getFormattedSeries(result);

    expect(formatted[0]).toBe("0.3");
    expect(formatted[1]).toBe("0.3");
    expect(formatted[2]).toBe("0.3");
  });

  it("should format negative numbers correctly", async () => {
    const entries = [
      createEntry({
        rnk: 1,
        country_iso_code_3: "USA",
        ac: -1500000,
        variationDirectionAc: "down",
      }),
      createEntry({
        rnk: 2,
        country_iso_code_3: "BRA",
        ac: -2500,
        variationDirectionAc: "down",
      }),
      createEntry({
        rnk: 3,
        country_iso_code_3: "MEX",
        ac: -55.2,
        variationDirectionAc: "down",
      }),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const formatted = getFormattedSeries(result);

    expect(formatted[0]).toBe("0.3");
    expect(formatted[1]).toBe("0.3");
    expect(formatted[2]).toBe("0.3");
  });

  it("should use ac field as the main value", async () => {
    const entries = [createTotalStartEntry({ delta: 0.3 })];

    const result = await evaluateExpression(createMockInput(entries));
    const values = getValueSeries(result);

    expect(values[0]).toBe(0.3);
  });

  it("should produce comparison lines with vs LY and Vol. vs LY titles", async () => {
    const entries = [
      createTotalStartEntry(),
      createEntry({
        rnk: 1,
        country_iso_code_3: "BRA",
        vs_ly: 1.4,
        vol_vs_ly: 2.2,
        variationDirectionAc: "up",
        variationDirectionVolVsLy: "up",
      }),
      createEntry({
        rnk: 2,
        country_iso_code_3: "USA",
        vs_ly: -1.2,
        vol_vs_ly: -0.8,
        variationDirectionAc: "down",
        variationDirectionVolVsLy: "down",
      }),
      createTotalEndEntry(),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const comparisonData = result.comparisonLine.data;

    expect(Array.isArray(comparisonData)).toBe(true);
    expect(comparisonData.length).toBe(2);

    const vsLy = comparisonData.find((c: any) => c.title === "vs LY");
    const volVsLy = comparisonData.find((c: any) => c.title === "Vol. vs LY");

    expect(vsLy).toBeDefined();
    expect(volVsLy).toBeDefined();

    expect(vsLy.data[0]).toEqual({ value: "" });
    expect(volVsLy.data[0]).toEqual({ value: "" });

    expect(vsLy.data[1].value).toBeDefined();
    expect(vsLy.data[1].measure).toBe("pp");
    expect(vsLy.data[1].trend).toBe("positive");

    expect(vsLy.data[2].measure).toBe("pp");
    expect(vsLy.data[2].trend).toBe("negative");

    expect(vsLy.data[3].value).toBeDefined();
    expect(vsLy.data[3].measure).toBe("pp");
    expect(volVsLy.data[1].measure).toBe("%");
    expect(volVsLy.data[2].measure).toBe("%");
    expect(volVsLy.data[3].value).toBeDefined();
    expect(volVsLy.data[3].measure).toBe("%");
  });

  it("should use comp_unit_of_measure for vs LY and unit_of_measure for Vol. vs LY", async () => {
    const entries = [
      createTotalStartEntry(),
      createEntry({
        rnk: 1,
        country_iso_code_3: "BRA",
        comp_unit_of_measure: "pp",
        unit_of_measure: "%",
      }),
      createTotalEndEntry(),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const vsLy = result.comparisonLine.data.find(
      (c: any) => c.title === "vs LY",
    );
    const volVsLy = result.comparisonLine.data.find(
      (c: any) => c.title === "Vol. vs LY",
    );

    expect(vsLy.data[1].measure).toBe("pp");
    expect(volVsLy.data[1].measure).toBe("%");
  });

  it("should use comp_unit_of_measure from datasource for vs LY when overridden", async () => {
    const entries = [
      createTotalStartEntry(),
      createEntry({
        rnk: 1,
        country_iso_code_3: "BRA",
        comp_unit_of_measure: "%",
      }),
      createTotalEndEntry(),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const vsLy = result.comparisonLine.data.find(
      (c: any) => c.title === "vs LY",
    );

    expect(vsLy.data[1].measure).toBe("%");
  });

  it("should set country_iso_code_3 as label for non-total rows", async () => {
    const entries = [
      createTotalStartEntry(),
      createEntry({ rnk: 1, country_iso_code_3: "BRA" }),
      createEntry({ rnk: 2, country_iso_code_3: "USA" }),
      createTotalEndEntry(),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const labels = toPlainStringArray(result.labels);

    expect(labels[1]).toBe("BRA");
    expect(labels[2]).toBe("USA");
  });

  it("should maintain correct order by rank", async () => {
    const entries = [
      createEntry({ rnk: 2, country_iso_code_3: "BRA" }),
      createTotalStartEntry(),
      createEntry({ rnk: 1, country_iso_code_3: "USA" }),
      createTotalEndEntry(),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const labels = toPlainStringArray(result.labels);

    expect(labels[0]).toBe("Mar'25");
    expect(labels[1]).toBe("USA");
    expect(labels[2]).toBe("BRA");
    expect(labels[3]).toBe("Mar'26");
  });

  it("should produce brandsAvatar entries with country flag image", async () => {
    const entries = [
      createTotalStartEntry({
        country: {
          imageIcon: "https://example.com/abi.png",
        },
      }),
      createEntry({
        rnk: 1,
        country_iso_code_3: "BRA",
        country: {
          imageIcon: "https://example.com/bra.png",
        },
      }),
      createTotalEndEntry({
        country: {
          imageIcon: "https://example.com/abi.png",
        },
      }),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const avatars = result.brandsAvatar.data;

    expect(avatars.length).toBe(3);
    expect(avatars[0].title).toBe("Mar'25");
    expect(avatars[0].mainBrand.src).toBe("https://example.com/abi.png");
    expect(avatars[0].mainBrand.alt).toBe("ABI FLAG");

    expect(avatars[1].title).toBe("BRA");
    expect(avatars[1].mainBrand.src).toBe("https://example.com/bra.png");
    expect(avatars[1].mainBrand.alt).toBe("BRA FLAG");
  });

  it("should validate against waterfallDataSchema", async () => {
    const entries = [
      createTotalStartEntry(),
      createEntry({
        rnk: 1,
        country_iso_code_3: "BRA",
        ac: 59.1,
        vs_ly: 1.4,
        vol_vs_ly: 2.2,
      }),
      createEntry({
        rnk: 2,
        country_iso_code_3: "USA",
        ac: 39.5,
        vs_ly: -1.2,
        vol_vs_ly: -0.8,
        variationDirectionAc: "down",
        variationDirectionVolVsLy: "down",
      }),
      createTotalEndEntry(),
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
      createTotalStartEntry(),
      createEntry(),
      createTotalEndEntry(),
    ];

    const result = await evaluateExpression(createMockInput(entries));

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

  it("should return legend with delta symbol and trending icons", async () => {
    const entries = [
      createTotalStartEntry(),
      createEntry({ rnk: 1, country_iso_code_3: "BRA" }),
      createTotalEndEntry(),
    ];

    const result = await evaluateExpression(createMockInput(entries));

    expect(result.legend).toBeDefined();
    expect(Array.isArray(result.legend)).toBe(true);
    expect(result.legend.length).toBe(2);

    expect(result.legend[0].label).toBe("Δ Vol.");
    expect(result.legend[1].label).toBe("Δ Vol.");

    expect(result.legend[0].icon).toBe("TrendingUp");
    expect(result.legend[1].icon).toBe("TrendingDown");

    expect(result.legend[0].color).toBe("#49764B");
    expect(result.legend[1].color).toBe("#A20A0A");
  });

  it("should handle null comparison values gracefully", async () => {
    const entries = [
      createTotalStartEntry(),
      createEntry({
        rnk: 1,
        country_iso_code_3: "BRA",
        vs_ly: null,
        vol_vs_ly: null,
      }),
      createTotalEndEntry(),
    ];

    const result = await evaluateExpression(createMockInput(entries));

    expect(result.empty).toBeUndefined();

    const comparisonData = ensureArray(result.comparisonLine.data);
    expect(comparisonData.length).toBe(2);

    const vsLy = comparisonData.find((c: any) => c.title === "vs LY");
    const cell = Array.isArray(vsLy.data) ? vsLy.data[1] : vsLy.data;
    expect(cell).toBeDefined();
    expect(cell.value).toBe("-");
  });

  it("should use delta for bar values and vs_ly for comparison line when they differ", async () => {
    const entries = [
      createTotalStartEntry(),
      createEntry({
        rnk: 1,
        country_iso_code_3: "BRA",
        delta: 0.5,
        vs_ly: 0.3,
      }),
      createTotalEndEntry(),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const vsLy = result.comparisonLine.data.find(
      (c: any) => c.title === "vs LY",
    );

    expect(getValueSeries(result)[1]).toBe(0.5);
    expect(vsLy.data[1].value).toBe("0.3");
  });

  it("should empty comparison cells for the start total row only", async () => {
    const entries = [
      createTotalStartEntry(),
      createEntry({ rnk: 1, country_iso_code_3: "BRA" }),
      createTotalEndEntry(),
    ];

    const result = await evaluateExpression(createMockInput(entries));
    const vsLy = result.comparisonLine.data.find(
      (c: any) => c.title === "vs LY",
    );
    const volVsLy = result.comparisonLine.data.find(
      (c: any) => c.title === "Vol. vs LY",
    );

    expect(vsLy.data[0]).toEqual({ value: "" });
    expect(volVsLy.data[0]).toEqual({ value: "" });

    expect(vsLy.data[2].value).toBeDefined();
    expect(vsLy.data[2].value).not.toBe("");
    expect(volVsLy.data[2].value).toBeDefined();
    expect(volVsLy.data[2].value).not.toBe("");
  });
});

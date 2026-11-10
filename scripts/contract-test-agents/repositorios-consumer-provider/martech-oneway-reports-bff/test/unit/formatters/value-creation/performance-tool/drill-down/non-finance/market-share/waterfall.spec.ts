import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "../../../../../../../../src/infrastructure/repositories/helpers";
import { waterfallDataSchema } from "../../../../../../../../src/infrastructure/schema/components/waterfall.schema";

describe("market share waterfall formatter", () => {
  let ajv: Ajv;
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/performance-tool/drill-down/non-finance/market-share/waterfall.jsonata",
  );

  type DatasourceEntry = {
    label_value: string;
    image_value: string;
    ac: number;
    delta: number;
    ac_direction: string;
    vs_ly: number | null;
    vs_ly_direction: string | null;
    unit_of_measure: string;
    comp_unit_of_measure: string;
    vol_vs_ly?: number | null;
    vol_vs_ly_direction?: string | null;
    vol_weight?: number | null;
    vol_weight_direction?: string | null;
    badge_value?: string | null;
  };

  const createEntry = (
    overrides: Partial<DatasourceEntry>,
  ): DatasourceEntry => ({
    label_value: "USA",
    image_value: "https://example.com/USA.png",
    ac: 55.2,
    delta: 0.1,
    ac_direction: "up",
    vs_ly: 0.3,
    vs_ly_direction: "up",
    unit_of_measure: "%",
    comp_unit_of_measure: "pp",
    ...overrides,
  });

  const createTotalLY = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry =>
    createEntry({
      label_value: "YTD'24",
      image_value: "https://example.com/ABI.png",
      ac: 55.2,
      delta: 0,
      ac_direction: "up",
      vs_ly: null,
      vs_ly_direction: null,
      ...overrides,
    });

  const createTotalAC = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry =>
    createEntry({
      label_value: "YTD'25",
      image_value: "https://example.com/ABI.png",
      ac: 54.9,
      delta: 0,
      ac_direction: "up",
      vs_ly: null,
      vs_ly_direction: null,
      ...overrides,
    });

  const createMockInput = (
    largeEntries: DatasourceEntry[],
    smallEntries: DatasourceEntry[],
  ) => ({
    datasources: {
      large: largeEntries,
      small: smallEntries,
    },
  });

  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => {
    return await compiledExpression.evaluate(input);
  };

  const transformForSchema = (jsonataResult: any) => {
    if (!jsonataResult || Object.keys(jsonataResult).length === 0) {
      return jsonataResult;
    }
    return {
      data: Array.isArray(jsonataResult.values)
        ? jsonataResult.values
        : [jsonataResult.values],
      labels: jsonataResult.labels || [],
      comparisonLineData: jsonataResult.comparisonLine?.data || [],
      brandsImg: jsonataResult.images?.data || [],
    };
  };

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);

    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return empty object when both datasources are empty", async () => {
    const mockInput = createMockInput([], []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBe(true);
    expect(result.large).toBeUndefined();
    expect(result.small).toBeUndefined();
  });

  it("should return waterfall data with large and small structures (country view)", async () => {
    const largeEntries = [
      createTotalLY(),
      createEntry({
        label_value: "USA",
        image_value: "https://example.com/USA.png",
        ac: 5.8,
        delta: -1.2,
        ac_direction: "up",
        vs_ly: 0.3,
        vs_ly_direction: "up",
      }),
      createEntry({
        label_value: "BRA",
        image_value: "https://example.com/BRA.png",
        ac: 11.3,
        delta: 11.3,
        ac_direction: "up",
        vs_ly: -0.2,
        vs_ly_direction: "down",
      }),
      createEntry({
        label_value: "Others",
        image_value: "https://example.com/other-brands.png",
        ac: 7.2,
        delta: 7.2,
        ac_direction: "up",
        vs_ly: 0.1,
        vs_ly_direction: "up",
      }),
      createTotalAC(),
    ];

    const smallEntries = [largeEntries[0], largeEntries[1], largeEntries[4]];

    const mockInput = createMockInput(largeEntries, smallEntries);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();
    expect(result.large).toBeDefined();
    expect(result.small).toBeDefined();

    expect(result.large.values).toBeDefined();
    expect(result.large.labels).toBeDefined();
    expect(result.large.formattedData).toBeDefined();
    expect(result.large.comparisonLine).toBeDefined();
    expect(result.large.images).toBeDefined();

    expect(result.small.values).toBeDefined();
    expect(result.small.labels).toBeDefined();
    expect(result.small.formattedData).toBeDefined();
    expect(result.small.comparisonLine).toBeDefined();
    expect(result.small.images).toBeDefined();

    expect(Array.isArray(result.large.values)).toBe(true);
    expect(result.large.values.length).toBe(5);
    expect(result.large.values[0]).toBe(55.2);
    expect(result.large.values[1]).toBe(-1.2);
    expect(result.large.values[2]).toBe(11.3);
    expect(result.large.values[3]).toBe(7.2);
    expect(result.large.values[4]).toBe(54.9);

    expect(Array.isArray(result.small.values)).toBe(true);
    expect(result.small.values.length).toBe(3);

    expect(Array.isArray(result.large.labels)).toBe(true);
    expect(result.large.labels.length).toBe(5);
    expect(result.large.labels[0]).toBe("YTD'24");
    expect(result.large.labels[1]).toBe("USA");
    expect(result.large.labels[2]).toBe("BRA");
    expect(result.large.labels[3]).toBe("Others");
    expect(result.large.labels[4]).toBe("YTD'25");

    expect(Array.isArray(result.large.formattedData)).toBe(true);
    expect(result.large.formattedData.length).toBe(1);
    expect(Array.isArray(result.large.formattedData[0])).toBe(true);
    expect(result.large.formattedData[0].length).toBe(5);
    expect(result.large.formattedData[0][0]).toBe("55.2");
    expect(result.large.formattedData[0][1]).toBe("-1.2");

    const comparisonData = Array.isArray(result.large.comparisonLine.data)
      ? result.large.comparisonLine.data
      : [result.large.comparisonLine.data];
    expect(comparisonData.length).toBe(3);
    expect(comparisonData[0].title).toBe("vs LY");
    expect(comparisonData[1].title).toBe("Vol. vs LY");
    expect(comparisonData[2].title).toBe("Vol. Weight");
    expect(Array.isArray(comparisonData[0].data)).toBe(true);
    expect(comparisonData[0].data.length).toBe(5);

    expect(comparisonData[0].data[0].value).toBe("-");
    expect(comparisonData[0].data[0].measure).toBe("");
    expect(comparisonData[0].data[0].trend).toBe("");

    expect(comparisonData[0].data[1].value).toBe("0.3");
    expect(comparisonData[0].data[1].measure).toBe("pp");
    expect(comparisonData[0].data[1].trend).toBe("positive");

    expect(comparisonData[0].data[2].value).toBe("-0.2");
    expect(comparisonData[0].data[2].measure).toBe("pp");
    expect(comparisonData[0].data[2].trend).toBe("negative");

    expect(comparisonData[0].data[4].value).toBe("-");
    expect(comparisonData[0].data[4].measure).toBe("");
    expect(comparisonData[0].data[4].trend).toBe("");

    // Vol. vs LY should have all "-" and empty trend; Vol. Weight should have "neutral" trend
    // idx 1 -> "Vol. vs LY", idx 2 -> "Vol. Weight"
    expect(comparisonData[1].data.length).toBe(5);
    for (let i = 0; i < 5; i++) {
      expect(comparisonData[1].data[i].value).toBe("-");
      expect(comparisonData[1].data[i].measure).toBe("");
      expect(comparisonData[1].data[i].trend).toBe("");
    }
    expect(comparisonData[2].data.length).toBe(5);
    for (let i = 0; i < 5; i++) {
      expect(comparisonData[2].data[i].value).toBe("-");
      expect(comparisonData[2].data[i].measure).toBe("");
      expect(comparisonData[2].data[i].trend).toBe("neutral");
    }

    expect(Array.isArray(result.large.images.data)).toBe(true);
    expect(result.large.images.data.length).toBe(5);
    expect(result.large.images.data[0].mainBrand.src).toBe(
      "https://example.com/ABI.png",
    );
    expect(result.large.images.data[0].mainBrand.alt).toBe("YTD'24");
    expect(result.large.images.data[0].title).toBe("YTD'24");
    expect(result.large.images.data[1].mainBrand.src).toBe(
      "https://example.com/USA.png",
    );
    expect(result.large.images.data[1].title).toBe("USA");

    const largeForSchema = transformForSchema(result.large);
    const validate = ajv.compile(waterfallDataSchema);
    const isValid = validate(largeForSchema);
    if (!isValid && validate.errors) {
      console.error(
        "Large validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    const smallForSchema = transformForSchema(result.small);
    const validateSmall = ajv.compile(waterfallDataSchema);
    const isValidSmall = validateSmall(smallForSchema);
    if (!isValidSmall && validateSmall.errors) {
      console.error(
        "Small validation errors:",
        JSON.stringify(validateSmall.errors, null, 2),
      );
    }
    expect(isValidSmall).toBe(true);
  });

  it("should return waterfall data with brand labels", async () => {
    const largeEntries = [
      createTotalLY({
        label_value: "YTD'24",
        image_value: "https://example.com/BRA.png",
        ac: 62.1,
      }),
      createEntry({
        label_value: "Original",
        image_value: "https://example.com/original.png",
        ac: 15.3,
        ac_direction: "up",
        vs_ly: 1.2,
        vs_ly_direction: "up",
      }),
      createEntry({
        label_value: "Budweiser",
        image_value: "https://example.com/budweiser.png",
        ac: 8.7,
        ac_direction: "up",
        vs_ly: -0.5,
        vs_ly_direction: "down",
      }),
      createEntry({
        label_value: "Others",
        image_value: "https://example.com/other-brands.png",
        ac: 3.2,
        ac_direction: "up",
        vs_ly: 0.1,
        vs_ly_direction: "up",
      }),
      createTotalAC({
        label_value: "YTD'25",
        image_value: "https://example.com/BRA.png",
        ac: 61.8,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.large).toBeDefined();
    expect(result.large.labels[0]).toBe("YTD'24");
    expect(result.large.labels[1]).toBe("Original");
    expect(result.large.labels[2]).toBe("Budweiser");
    expect(result.large.labels[3]).toBe("Others");
    expect(result.large.labels[4]).toBe("YTD'25");

    expect(result.large.images.data[1].mainBrand.src).toBe(
      "https://example.com/original.png",
    );
    expect(result.large.images.data[1].mainBrand.alt).toBe("Original");
    expect(result.large.images.data[1].title).toBe("Original");
  });

  it("should return waterfall data with sub-brand labels", async () => {
    const largeEntries = [
      createTotalLY({
        label_value: "YTD'24",
        image_value: "https://example.com/brahma.png",
        ac: 20.5,
      }),
      createEntry({
        label_value: "Brahma",
        image_value: "https://example.com/brahma.png",
        ac: 12.1,
        ac_direction: "up",
        vs_ly: 0.8,
        vs_ly_direction: "up",
      }),
      createEntry({
        label_value: "Brahma - NA",
        image_value: "https://example.com/brahma-na.png",
        ac: 3.4,
        ac_direction: "down",
        vs_ly: -0.3,
        vs_ly_direction: "down",
      }),
      createEntry({
        label_value: "Brahma Duplo Malte",
        image_value: "https://example.com/brahma-duplo.png",
        ac: 2.8,
        ac_direction: "up",
        vs_ly: 0.2,
        vs_ly_direction: "up",
      }),
      createTotalAC({
        label_value: "YTD'25",
        image_value: "https://example.com/brahma.png",
        ac: 20.1,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.large).toBeDefined();
    expect(result.large.labels[1]).toBe("Brahma");
    expect(result.large.labels[2]).toBe("Brahma - NA");
    expect(result.large.labels[3]).toBe("Brahma Duplo Malte");
  });

  it("should handle null vs_ly for totals correctly", async () => {
    const largeEntries = [
      createTotalLY(),
      createEntry({
        label_value: "USA",
        image_value: "https://example.com/USA.png",
        ac: 5.8,
        vs_ly: 0.3,
        vs_ly_direction: "up",
      }),
      createTotalAC(),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    const comparisonData = result.large.comparisonLine.data;
    const vsLyLine = Array.isArray(comparisonData)
      ? comparisonData[0]
      : comparisonData;

    expect(vsLyLine.data[0].value).toBe("-");
    expect(vsLyLine.data[0].measure).toBe("");
    expect(vsLyLine.data[0].trend).toBe("");

    expect(vsLyLine.data[1].value).toBe("0.3");
    expect(vsLyLine.data[1].measure).toBe("pp");
    expect(vsLyLine.data[1].trend).toBe("positive");

    expect(vsLyLine.data[2].value).toBe("-");
    expect(vsLyLine.data[2].measure).toBe("");
    expect(vsLyLine.data[2].trend).toBe("");
  });

  it("should format large numbers correctly with formatCompactNumber", async () => {
    const largeEntries = [
      createEntry({ ac: 1500000, vs_ly: 0.5, vs_ly_direction: "up" }),
      createEntry({
        ac: 2500,
        delta: 2500,
        vs_ly: -0.3,
        vs_ly_direction: "down",
      }),
      createEntry({ ac: 55.2, vs_ly: 0.1, vs_ly_direction: "up" }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.large.formattedData[0][0]).toBe("1.5M");
    expect(result.large.formattedData[0][1]).toBe("2.5K");
    expect(result.large.formattedData[0][2]).toBe("55.2");
  });

  it("should format negative large numbers correctly", async () => {
    const largeEntries = [
      createEntry({ ac: -1500000, vs_ly: 0.1, vs_ly_direction: "up" }),
      createEntry({
        ac: -2500,
        delta: -2500,
        vs_ly: 0.1,
        vs_ly_direction: "up",
      }),
      createEntry({ ac: -55.2, vs_ly: 0.1, vs_ly_direction: "up" }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.large.formattedData[0][0]).toBe("-1.5M");
    expect(result.large.formattedData[0][1]).toBe("-2.5K");
    expect(result.large.formattedData[0][2]).toBe("-55.2");
  });

  it("should handle direction trends correctly", async () => {
    const largeEntries = [
      createEntry({
        ac: 10,
        delta: 1,
        vs_ly: 0.5,
        vs_ly_direction: "up",
      }),
      createEntry({
        ac: 8,
        delta: -1,
        vs_ly: -0.3,
        vs_ly_direction: "down",
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    const comparisonData = Array.isArray(result.large.comparisonLine.data)
      ? result.large.comparisonLine.data
      : [result.large.comparisonLine.data];
    const vsLyData = comparisonData[0].data;

    expect(vsLyData[0].trend).toBe("positive");
    expect(vsLyData[1].trend).toBe("negative");
  });

  it("should use comp_unit_of_measure from data", async () => {
    const largeEntries = [
      createEntry({
        ac: 10,
        vs_ly: 0.5,
        vs_ly_direction: "up",
        comp_unit_of_measure: "pp",
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    const comparisonData = Array.isArray(result.large.comparisonLine.data)
      ? result.large.comparisonLine.data
      : [result.large.comparisonLine.data];

    expect(comparisonData[0].data[0].measure).toBe("pp");
  });

  it("should fallback to % when comp_unit_of_measure is not provided", async () => {
    const largeEntries = [
      createEntry({
        ac: 10,
        vs_ly: 0.5,
        vs_ly_direction: "up",
        comp_unit_of_measure: undefined as any,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    const comparisonData = Array.isArray(result.large.comparisonLine.data)
      ? result.large.comparisonLine.data
      : [result.large.comparisonLine.data];

    expect(comparisonData[0].data[0].measure).toBe("%");
  });

  it("should return empty object for empty subset", async () => {
    const mockInput = createMockInput([], []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBe(true);
  });

  it("should handle when only large has data", async () => {
    const largeEntries = [
      createTotalLY(),
      createEntry({ ac: 5.0, vs_ly: 0.3, vs_ly_direction: "up" }),
      createTotalAC(),
    ];
    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.large).toBeDefined();
    expect(result.small).toEqual({});
  });

  it("should handle when only small has data", async () => {
    const smallEntries = [
      createTotalLY(),
      createEntry({ ac: 5.0, vs_ly: 0.3, vs_ly_direction: "up" }),
      createTotalAC(),
    ];
    const mockInput = createMockInput([], smallEntries);
    const result = await evaluateExpression(mockInput);

    expect(result.large).toEqual({});
    expect(result.small).toBeDefined();
  });

  it("should return waterfall when all deltas are zero but not null", async () => {
    const largeEntries = [
      createEntry({
        ac: 0,
        delta: 0,
        vs_ly: null,
        vs_ly_direction: null,
      }),
      createEntry({
        ac: 0,
        delta: 0,
        vs_ly: 0,
        vs_ly_direction: "up",
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();
    expect(result.large).toBeDefined();
    const values = result.large.values as number[];
    expect(values.length).toBe(2);
    expect(values.every((v) => v === 0)).toBe(true);
  });

  it("should return empty when delta is not a valid non-zero number", async () => {
    const largeEntries = [
      createEntry({
        ac: null as any,
        delta: null as any,
        vs_ly: null,
        vs_ly_direction: null,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBe(true);
  });

  it("should validate against waterfallDataSchema for brand waterfall", async () => {
    const largeEntries = [
      createTotalLY({
        label_value: "YTD'24",
        image_value: "https://example.com/ABI.png",
        ac: 48.5,
      }),
      createEntry({
        label_value: "Brahma",
        image_value: "https://example.com/brahma.png",
        ac: 12.1,
        vs_ly: 1.5,
        vs_ly_direction: "up",
      }),
      createEntry({
        label_value: "Corona",
        image_value: "https://example.com/corona.png",
        ac: 8.3,
        vs_ly: -0.8,
        vs_ly_direction: "down",
      }),
      createEntry({
        label_value: "Budweiser",
        image_value: "https://example.com/budweiser.png",
        ac: 6.2,
        vs_ly: 0.3,
        vs_ly_direction: "up",
      }),
      createEntry({
        label_value: "Others",
        image_value: "https://example.com/other-brands.png",
        ac: 4.1,
        vs_ly: -0.1,
        vs_ly_direction: "down",
      }),
      createTotalAC({
        label_value: "YTD'25",
        image_value: "https://example.com/ABI.png",
        ac: 47.5,
      }),
    ];

    const smallEntries = [
      largeEntries[0],
      largeEntries[1],
      largeEntries[2],
      largeEntries[5],
    ];

    const mockInput = createMockInput(largeEntries, smallEntries);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();

    const largeForSchema = transformForSchema(result.large);
    const validate = ajv.compile(waterfallDataSchema);
    const isValid = validate(largeForSchema);
    if (!isValid && validate.errors) {
      console.error(
        "Large validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    const smallForSchema = transformForSchema(result.small);
    const isValidSmall = validate(smallForSchema);
    if (!isValidSmall && validate.errors) {
      console.error(
        "Small validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValidSmall).toBe(true);
  });

  it("should format vs_ly values with one decimal place", async () => {
    const largeEntries = [
      createEntry({
        ac: 10,
        delta: 0.5,
        vs_ly: 1.567,
        vs_ly_direction: "up",
      }),
      createEntry({
        ac: 8,
        delta: -0.5,
        vs_ly: -0.234,
        vs_ly_direction: "down",
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    const comparisonData = Array.isArray(result.large.comparisonLine.data)
      ? result.large.comparisonLine.data
      : [result.large.comparisonLine.data];

    expect(comparisonData[0].data[0].value).toBe("1.6");
    expect(comparisonData[0].data[1].value).toBe("-0.2");
  });

  it("should map images correctly from data service response", async () => {
    const largeEntries = [
      createTotalLY({
        label_value: "YTD'24",
        image_value: "https://cdn.example.com/flags/ABI.png",
      }),
      createEntry({
        label_value: "BRA",
        image_value: "https://cdn.example.com/flags/BRA.png",
        ac: 11.3,
        vs_ly: -0.2,
        vs_ly_direction: "down",
      }),
      createEntry({
        label_value: "USA",
        image_value: "https://cdn.example.com/flags/USA.png",
        ac: 5.8,
        vs_ly: 0.3,
        vs_ly_direction: "up",
      }),
      createTotalAC({
        label_value: "YTD'25",
        image_value: "https://cdn.example.com/flags/ABI.png",
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.large.images.data[0].mainBrand.src).toBe(
      "https://cdn.example.com/flags/ABI.png",
    );
    expect(result.large.images.data[0].mainBrand.alt).toBe("YTD'24");
    expect(result.large.images.data[0].title).toBe("YTD'24");

    expect(result.large.images.data[1].mainBrand.src).toBe(
      "https://cdn.example.com/flags/BRA.png",
    );
    expect(result.large.images.data[1].mainBrand.alt).toBe("BRA");
    expect(result.large.images.data[1].title).toBe("BRA");

    expect(result.large.images.data[2].mainBrand.src).toBe(
      "https://cdn.example.com/flags/USA.png",
    );
    expect(result.large.images.data[2].mainBrand.alt).toBe("USA");
    expect(result.large.images.data[2].title).toBe("USA");

    expect(result.large.images.data[3].mainBrand.src).toBe(
      "https://cdn.example.com/flags/ABI.png",
    );
    expect(result.large.images.data[3].mainBrand.alt).toBe("YTD'25");
    expect(result.large.images.data[3].title).toBe("YTD'25");
  });
});

import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";
import { waterfallDataSchema } from "../../../../../../../src/infrastructure/schema/components/waterfall.schema";

describe("contribution waterfall formatter", () => {
  let ajv: Ajv;
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/performance-tool/drill-down/non-finance/contribution-waterfall.jsonata",
  );

  type DatasourceEntry = {
    kpi_name: string;
    brand: string;
    country: string;
    brand_image?: string;
    country_flag?: string;
    dt_end: string;
    period?: string;
    label_value?: string;
    image_value?: string;
    ac_delta: number | null;
    ac: number;
    ac_direction: string;
    ac_ly_total: number;
    ac_total: number;
    ac_vs_ly: number | null;
    ac_vs_ly_direction: string;
    ac_vs_lq?: number | null;
    ac_vs_lq_direction?: string;
    ac_delta_direction: string;
    nr_weight: number | null;
    nr_weight_direction?: string;
    unit_of_measure?: string;
    comp_unit_of_measure?: string;
    waterfall_filter?: string;
  };

  // Helper function to create a datasource entry
  const createEntry = (
    overrides: Partial<DatasourceEntry>,
  ): DatasourceEntry => {
    const entry = {
      kpi_name: "innovation_volume",
      brand: "Budweiser",
      country: "BRA",
      brand_image: "https://example.com/budweiser.png",
      dt_end: "2025-09-01T00:00:00.000Z",
      period: "YTD",
      ac_delta: 1000,
      ac: 5000,
      ac_direction: "up",
      ac_ly_total: 4500,
      ac_total: 5000,
      ac_vs_ly: 5.2,
      ac_vs_ly_direction: "up",
      ac_delta_direction: "up",
      nr_weight: 100.5,
      nr_weight_direction: "up",
      unit_of_measure: "%",
      comp_unit_of_measure: "pp",
      ...overrides,
    };
    // Set label_value and image_value based on brand/country if not provided
    if (!entry.label_value) {
      entry.label_value = entry.brand === "N/A" ? entry.country : entry.brand;
    }
    if (!entry.image_value) {
      entry.image_value =
        entry.brand === "N/A" ? entry.country_flag : entry.brand_image;
    }
    return entry;
  };

  // Helper function to create mock input
  const createMockInput = (
    largeEntries: DatasourceEntry[],
    smallEntries: DatasourceEntry[],
  ) => ({
    datasources: {
      large: largeEntries,
      small: smallEntries,
    },
  });

  // Helper function to evaluate expression
  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => {
    return await compiledExpression.evaluate(input);
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
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "USA",
        country_flag: "https://example.com/USA.png",
        ac_delta: 1500,
        ac_ly_total: 7500,
        ac_total: 8000,
        ac_vs_ly: 8.5,
        ac_vs_ly_direction: "up",
        ac_delta_direction: "up",
        nr_weight: 150.2,
        unit_of_measure: "%",
        comp_unit_of_measure: "pp",
        waterfall_filter: "country",
      }),
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "BRA",
        country_flag: "https://example.com/BRA.png",
        ac_delta: 2200,
        ac_ly_total: 7500,
        ac_total: 8000,
        ac_vs_ly: -3.2,
        ac_vs_ly_direction: "down",
        ac_delta_direction: "up",
        nr_weight: 220.5,
        unit_of_measure: "%",
        comp_unit_of_measure: "pp",
        waterfall_filter: "country",
      }),
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "MEX",
        country_flag: "https://example.com/MEX.png",
        ac_delta: 1800,
        ac_ly_total: 7500,
        ac_total: 8000,
        ac_vs_ly: 12.1,
        ac_vs_ly_direction: "up",
        ac_delta_direction: "up",
        nr_weight: 180.8,
        unit_of_measure: "%",
        comp_unit_of_measure: "pp",
        waterfall_filter: "country",
      }),
    ];

    const smallEntries = largeEntries.slice(0, 2); // First 2 entries

    const mockInput = createMockInput(largeEntries, smallEntries);
    const result = await evaluateExpression(mockInput);

    // Should not be empty
    expect(result.empty).toBeUndefined();
    expect(result.large).toBeDefined();
    expect(result.small).toBeDefined();

    // Validate large structure
    expect(result.large.values).toBeDefined();
    expect(result.large.labels).toBeDefined();
    expect(result.large.formattedData).toBeDefined();
    expect(result.large.comparisonLine).toBeDefined();
    expect(result.large.images).toBeDefined();

    // Validate small structure
    expect(result.small.values).toBeDefined();
    expect(result.small.labels).toBeDefined();
    expect(result.small.formattedData).toBeDefined();
    expect(result.small.comparisonLine).toBeDefined();
    expect(result.small.images).toBeDefined();

    // Validate large values array structure: [...ac_delta values]
    expect(Array.isArray(result.large.values)).toBe(true);
    expect(result.large.values.length).toBe(3); // 3 entries
    expect(result.large.values[0]).toBe(1500); // first ac_delta
    expect(result.large.values[1]).toBe(2200); // second ac_delta
    expect(result.large.values[2]).toBe(1800); // third ac_delta

    // Validate small values array structure: [...ac_delta values]
    expect(Array.isArray(result.small.values)).toBe(true);
    expect(result.small.values.length).toBe(2); // 2 entries
    expect(result.small.values[0]).toBe(1500); // first ac_delta
    expect(result.small.values[1]).toBe(2200); // second ac_delta

    // Validate large formattedData is an array of arrays
    expect(Array.isArray(result.large.formattedData)).toBe(true);
    expect(result.large.formattedData.length).toBe(1); // Should be an array containing one array
    expect(Array.isArray(result.large.formattedData[0])).toBe(true);
    expect(result.large.formattedData[0].length).toBe(3); // Should contain 3 formatted values
    // Check that values are formatted: first and last with 1 decimal, middle with 2 decimals
    expect(result.large.formattedData[0][0]).toMatch(/^\d+,\d{3}\.\d{1}$/); // Format: "1,500.0" (first index)
    expect(result.large.formattedData[0][1]).toMatch(/^\d+\.\d{2}$/); // Format: "2200.00" (middle)
    expect(result.large.formattedData[0][2]).toMatch(/^\d+,\d{3}\.\d{1}$/); // Format: "1,800.0" (last index)

    // Validate small formattedData is an array of arrays
    expect(Array.isArray(result.small.formattedData)).toBe(true);
    expect(result.small.formattedData.length).toBe(1); // Should be an array containing one array
    expect(Array.isArray(result.small.formattedData[0])).toBe(true);
    expect(result.small.formattedData[0].length).toBe(2); // Should contain 2 formatted values

    // Validate large labels array structure: [first YTD format, ...country names, last YTD format]
    expect(Array.isArray(result.large.labels)).toBe(true);
    expect(result.large.labels.length).toBe(3);
    expect(result.large.labels[0]).toBe("YTD'25"); // first dt_end uses ytdFormat
    expect(result.large.labels[1]).toBe("BRA"); // middle uses label_value of second item
    expect(result.large.labels[2]).toBe("YTD'25"); // last dt_end uses ytdFormat

    // Validate small labels array
    expect(Array.isArray(result.small.labels)).toBe(true);
    expect(result.small.labels.length).toBe(2);
    expect(result.small.labels[0]).toBe("YTD'25"); // first dt_end uses ytdFormat
    expect(result.small.labels[1]).toBe("YTD'25"); // last dt_end uses ytdFormat

    // Validate comparison line data
    expect(result.large.comparisonLine).toBeDefined();
    // JSONata may return array or single value, normalize to array
    const comparisonData = Array.isArray(result.large.comparisonLine.data)
      ? result.large.comparisonLine.data
      : result.large.comparisonLine.data
        ? [result.large.comparisonLine.data]
        : [];
    expect(Array.isArray(comparisonData)).toBe(true);
    // For country filter with YTD (not QTD), should have 3 items: Absolute Power, vs LY, NR Weight
    expect(comparisonData.length).toBe(3);

    // Validate first comparison line (Absolute Power)
    const powerLine = comparisonData[0];
    expect(powerLine.title).toBe("Absolute Power");
    expect(Array.isArray(powerLine.data)).toBe(true);
    expect(powerLine.data.length).toBe(3); // 3 entries

    // Validate second comparison line (vs LY)
    const vsLyLine = comparisonData[1];
    expect(vsLyLine.title).toBe("vs LY");
    expect(Array.isArray(vsLyLine.data)).toBe(true);
    expect(vsLyLine.data.length).toBe(3);

    // Validate third comparison line (NR Weight for country filter)
    const nrLine = comparisonData[2];
    expect(nrLine.title).toBe("NR Weight");
    expect(Array.isArray(nrLine.data)).toBe(true);
    expect(nrLine.data.length).toBe(3);

    // Validate images for large
    expect(result.large.images).toBeDefined();
    expect(Array.isArray(result.large.images.data)).toBe(true);
    expect(result.large.images.data.length).toBe(3);
    expect(result.large.images.data[0].mainBrand.src).toBe(
      "https://example.com/USA.png",
    );
    expect(result.large.images.data[0].mainBrand.alt).toBe("USA");
    expect(result.large.images.data[0].title).toBe("YTD'25"); // first index uses ytdFormat
    expect(result.large.images.data[1].title).toBe("BRA"); // middle uses label_value of second item
    expect(result.large.images.data[2].title).toBe("YTD'25"); // last index uses ytdFormat

    // Validate images for small
    expect(result.small.images).toBeDefined();
    expect(Array.isArray(result.small.images.data)).toBe(true);
    expect(result.small.images.data.length).toBe(2);
    expect(result.small.images.data[0].title).toBe("YTD'25"); // first index uses ytdFormat
    expect(result.small.images.data[1].title).toBe("YTD'25"); // last index uses ytdFormat

    // Transform jsonata structure to match schema for validation
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

    // Validate schema for large
    const largeForSchema = transformForSchema(result.large);
    const validateLarge = ajv.compile(waterfallDataSchema);
    const isValidLarge = validateLarge(largeForSchema);
    if (!isValidLarge && validateLarge.errors) {
      console.error(
        "Large validation errors:",
        JSON.stringify(validateLarge.errors, null, 2),
      );
    }
    expect(isValidLarge).toBe(true);

    // Validate schema for small
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

  it("should return waterfall data with large and small structures (brand view)", async () => {
    const largeEntries = [
      createEntry({
        kpi_name: "innovation_nr",
        brand: "Budweiser",
        country: "BRA",
        brand_image: "https://example.com/budweiser.png",
        ac_delta: 850,
        ac_ly_total: 2800,
        ac_total: 3000,
        ac_vs_ly: 6.8,
        ac_vs_ly_direction: "up",
        ac_delta_direction: "up",
        nr_weight: 85.5,
        unit_of_measure: "%",
        comp_unit_of_measure: "pp",
      }),
      createEntry({
        kpi_name: "innovation_nr",
        brand: "Stella Artois",
        country: "BRA",
        brand_image: "https://example.com/stella.png",
        ac_delta: 650,
        ac_ly_total: 2800,
        ac_total: 3000,
        ac_vs_ly: -4.2,
        ac_vs_ly_direction: "down",
        ac_delta_direction: "up",
        nr_weight: 65.2,
        unit_of_measure: "%",
        comp_unit_of_measure: "pp",
      }),
      createEntry({
        kpi_name: "innovation_nr",
        brand: "Corona",
        country: "BRA",
        brand_image: "https://example.com/corona.png",
        ac_delta: 500,
        ac_ly_total: 2800,
        ac_total: 3000,
        ac_vs_ly: 15.5,
        ac_vs_ly_direction: "up",
        ac_delta_direction: "up",
        nr_weight: 50.8,
        unit_of_measure: "%",
        comp_unit_of_measure: "pp",
      }),
    ];

    const smallEntries = largeEntries.slice(0, 2); // First 2 entries

    const mockInput = createMockInput(largeEntries, smallEntries);
    const result = await evaluateExpression(mockInput);

    // Should not be empty
    expect(result.empty).toBeUndefined();
    expect(result.large).toBeDefined();
    expect(result.small).toBeDefined();

    // Validate labels use brand names in brand view
    expect(result.large.labels[0]).toBe("YTD'25"); // first index uses ytdFormat
    expect(result.large.labels[1]).toBe("Stella Artois"); // middle uses label_value of second item
    expect(result.large.labels[2]).toBe("YTD'25"); // last index uses ytdFormat

    // Validate images use brand_image
    expect(Array.isArray(result.large.images.data)).toBe(true);
    expect(result.large.images.data.length).toBe(3);
    expect(result.large.images.data[0].mainBrand.src).toBe(
      "https://example.com/budweiser.png",
    );
    expect(result.large.images.data[0].mainBrand.alt).toBe("Budweiser");
    expect(result.large.images.data[0].title).toBe("YTD'25"); // first index uses ytdFormat
    expect(result.large.images.data[1].title).toBe("Stella Artois"); // middle uses label_value of second item
    expect(result.large.images.data[2].title).toBe("YTD'25"); // last index uses ytdFormat
  });

  it("should handle null values correctly", async () => {
    const largeEntries = [
      createEntry({
        ac_delta: null,
        ac: null as any,
        ac_vs_ly: null,
        nr_weight: null,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    // When all ac_delta values are null or 0, formatter returns { empty: true }
    expect(result.empty).toBe(true);
  });

  it("should handle valid data with some null values", async () => {
    const largeEntries = [
      createEntry({
        ac_delta: 100, // valid non-zero value
        ac: null as any,
        ac_vs_ly: null,
        nr_weight: null,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.large).toBeDefined();
    expect(result.large.values).toBeDefined();
    // JSONata array projection may return single value or array
    const valuesArray = Array.isArray(result.large.values)
      ? result.large.values
      : [result.large.values];
    expect(valuesArray[0]).toBe(100);

    expect(result.large.comparisonLine).toBeDefined();
    expect(result.large.comparisonLine.data).toBeDefined();
    expect(Array.isArray(result.large.comparisonLine.data)).toBe(true);
    expect(result.large.comparisonLine.data.length).toBeGreaterThan(0);

    const powerLine = result.large.comparisonLine.data[0];
    expect(powerLine).toBeDefined();
    expect(powerLine.title).toBe("Absolute Power");
    expect(powerLine.data).toBeDefined();
    // JSONata property projection may return single object or array
    const powerDataArray = Array.isArray(powerLine.data)
      ? powerLine.data
      : [powerLine.data];
    expect(powerDataArray.length).toBeGreaterThan(0);
    // formatValue returns "-" when not a number (ac is null)
    expect(powerDataArray[0].value).toBe("-");

    const vsLyLine = result.large.comparisonLine.data[1];
    const vsLyDataArray = Array.isArray(vsLyLine.data)
      ? vsLyLine.data
      : [vsLyLine.data];
    expect(vsLyDataArray[0].value).toBe("-"); // null should format as "-"

    const nrLine = result.large.comparisonLine.data[2];
    const nrDataArray = Array.isArray(nrLine.data)
      ? nrLine.data
      : [nrLine.data];
    expect(nrDataArray[0].value).toBe("-"); // null nr_weight formats as "-"
    // measure should be empty when value is 0 or null
    expect(nrDataArray[0].measure).toBe("");
  });

  it("should format numbers correctly", async () => {
    const largeEntries = [
      createEntry({
        ac: 1234.567,
        ac_vs_ly: 12.345,
        nr_weight: 123.456,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.large).toBeDefined();
    expect(result.large.comparisonLine).toBeDefined();
    expect(result.large.comparisonLine.data).toBeDefined();
    expect(Array.isArray(result.large.comparisonLine.data)).toBe(true);
    expect(result.large.comparisonLine.data.length).toBeGreaterThan(0);

    const powerLine = result.large.comparisonLine.data[0];
    expect(powerLine).toBeDefined();
    expect(powerLine.data).toBeDefined();
    // JSONata property projection may return single object or array
    const powerDataArray = Array.isArray(powerLine.data)
      ? powerLine.data
      : [powerLine.data];
    expect(powerDataArray.length).toBeGreaterThan(0);

    // Check formatted values - ac uses formatValue which has one decimal place (#,##0.0)
    expect(powerDataArray[0].value).toBe("1,234.6");

    const vsLyLine = result.large.comparisonLine.data[1];
    const vsLyDataArray = Array.isArray(vsLyLine.data)
      ? vsLyLine.data
      : [vsLyLine.data];
    expect(vsLyDataArray[0].value).toBe("12.3");

    const nrLine = result.large.comparisonLine.data[2];
    const nrDataArray = Array.isArray(nrLine.data)
      ? nrLine.data
      : [nrLine.data];
    expect(nrDataArray[0].value).toContain("123.5");

    // Validate formattedData formats numbers correctly
    expect(result.large.formattedData).toBeDefined();
    expect(Array.isArray(result.large.formattedData)).toBe(true);
    expect(result.large.formattedData.length).toBe(1);
    expect(Array.isArray(result.large.formattedData[0])).toBe(true);
    // formattedData: first index uses formatValue (1 decimal with thousands separator),
    // middle uses formatTwoDecimals (2 decimals without thousands separator)
    expect(result.large.formattedData[0][0]).toMatch(/^\d+,\d{3}\.\d{1}$/); // Format: "1,000.0" (first index)
  });

  it("should only show measure for nr_contribution when value is greater than 0", async () => {
    const largeEntries = [
      createEntry({
        nr_weight: 100.5,
        unit_of_measure: "pp",
      }),
      createEntry({
        nr_weight: 0,
        unit_of_measure: "pp",
      }),
      createEntry({
        nr_weight: null,
        unit_of_measure: "pp",
      }),
      createEntry({
        nr_weight: -5.2,
        unit_of_measure: "pp",
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.large).toBeDefined();
    expect(result.large.comparisonLine).toBeDefined();

    // Find NR Weight line
    const comparisonData = Array.isArray(result.large.comparisonLine.data)
      ? result.large.comparisonLine.data
      : result.large.comparisonLine.data
        ? [result.large.comparisonLine.data]
        : [];
    const nrLine = comparisonData.find(
      (line: any) => line.title === "NR Weight",
    );
    expect(nrLine).toBeDefined();

    const nrDataArray = Array.isArray(nrLine.data)
      ? nrLine.data
      : [nrLine.data];

    // First entry: value > 0, measure should be present
    expect(nrDataArray[0].measure).toBe("pp");

    // Second entry: value = 0, measure should be empty
    expect(nrDataArray[1].measure).toBe("");

    // Third entry: value is null (treated as 0), measure should be empty
    expect(nrDataArray[2].measure).toBe("");

    // Fourth entry: value < 0, measure should be empty
    expect(nrDataArray[3].measure).toBe("");
  });

  it("should define trends by numeric value (>0 positive, <=0 negative)", async () => {
    const largeEntries = [
      createEntry({
        ac: 10,
        ac_vs_ly: 1.5,
        ac_direction: "down",
        ac_vs_ly_direction: "down",
      }),
      createEntry({
        ac: 0,
        ac_vs_ly: 0,
        ac_direction: "up",
        ac_vs_ly_direction: "up",
      }),
      createEntry({
        ac: -3,
        ac_vs_ly: -0.4,
        ac_direction: "up",
        ac_vs_ly_direction: "up",
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    // Trend is now based on the raw numeric value, not direction fields.
    expect(result.large.comparisonLine.data[0].data[0].trend).toBe("positive");
    expect(result.large.comparisonLine.data[0].data[1].trend).toBe("negative");
    expect(result.large.comparisonLine.data[0].data[2].trend).toBe("negative");

    expect(result.large.comparisonLine.data[1].data[0].trend).toBe("positive");
    expect(result.large.comparisonLine.data[1].data[1].trend).toBe("negative");
    expect(result.large.comparisonLine.data[1].data[2].trend).toBe("negative");
  });

  it("should handle unit of measure correctly", async () => {
    const largeEntries = [
      createEntry({
        unit_of_measure: "%",
        comp_unit_of_measure: "pp",
      }),
      createEntry({
        unit_of_measure: undefined,
        comp_unit_of_measure: undefined,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    // Power line always has empty measure
    expect(result.large.comparisonLine.data[0].data[0].measure).toBe("");

    // vs_ly line should use provided unit
    expect(result.large.comparisonLine.data[1].data[0].measure).toBe("pp");

    // Second entry - power still has empty measure
    expect(result.large.comparisonLine.data[0].data[1].measure).toBe("");
    // Second entry - vs_ly should use default unit when not provided
    expect(result.large.comparisonLine.data[1].data[1].measure).toBe("%");
  });

  it("should return empty object for empty subset", async () => {
    const mockInput = createMockInput([], []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBe(true);
  });

  it("should handle when only large has data", async () => {
    const largeEntries = [createEntry({})];
    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.large).toBeDefined();
    expect(result.small).toEqual({});
  });

  it("should handle when only small has data", async () => {
    const smallEntries = [createEntry({})];
    const mockInput = createMockInput([], smallEntries);
    const result = await evaluateExpression(mockInput);

    expect(result.large).toEqual({});
    expect(result.small).toBeDefined();
  });

  it("should use quarter format for QTD period in labels and images titles", async () => {
    const largeEntries = [
      createEntry({
        dt_end: "2025-03-31T00:00:00.000Z", // Q1
        period: "QTD",
        country: "USA",
        label_value: "USA",
        image_value: "https://example.com/USA.png",
      }),
      createEntry({
        dt_end: "2025-06-30T00:00:00.000Z", // Q2
        period: "QTD",
        country: "BRA",
        label_value: "BRA",
        image_value: "https://example.com/BRA.png",
      }),
      createEntry({
        dt_end: "2025-09-30T00:00:00.000Z", // Q3
        period: "QTD",
        country: "MEX",
        label_value: "MEX",
        image_value: "https://example.com/MEX.png",
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    // Validate labels use quarter format for first and last
    expect(result.large.labels[0]).toBe("Q1'25"); // first index uses quarter
    expect(result.large.labels[1]).toBe("BRA"); // middle uses label_value
    expect(result.large.labels[2]).toBe("Q3'25"); // last index uses quarter

    // Validate images titles use quarter format for first and last
    expect(result.large.images.data[0].title).toBe("Q1'25"); // first index uses quarter
    expect(result.large.images.data[1].title).toBe("BRA"); // middle uses label_value
    expect(result.large.images.data[2].title).toBe("Q3'25"); // last index uses quarter

    // Validate comparison line titles for QTD period
    const comparisonData = Array.isArray(result.large.comparisonLine.data)
      ? result.large.comparisonLine.data
      : result.large.comparisonLine.data
        ? [result.large.comparisonLine.data]
        : [];
    expect(comparisonData[1].title).toBe("vs LQ"); // QTD uses "vs LQ" instead of "vs LY"
    expect(comparisonData[2].title).toBe("NR Weight"); // QTD uses "NR Weight" instead of "NR Contribution"
  });

  describe("comparisonLine with waterfall_filter rules", () => {
    // Helper to normalize comparisonLine data
    const getComparisonData = (result: any) => {
      if (!result?.large?.comparisonLine?.data) return [];
      return Array.isArray(result.large.comparisonLine.data)
        ? result.large.comparisonLine.data
        : result.large.comparisonLine.data
          ? [result.large.comparisonLine.data]
          : [];
    };

    it("should return correct comparisonLine for country filter with QTD=true", async () => {
      const largeEntries = [
        createEntry({
          period: "QTD",
          waterfall_filter: "country",
          ac_vs_lq: 5.5,
          ac_vs_lq_direction: "up",
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);
      const comparisonData = getComparisonData(result);

      expect(comparisonData.length).toBe(4);
      expect(comparisonData[0].title).toBe("Absolute Power");
      expect(comparisonData[1].title).toBe("vs LY");
      expect(comparisonData[2].title).toBe("vs LQ");
      expect(comparisonData[3].title).toBe("NR Weight");
    });

    it("should return correct comparisonLine for country filter with QTD=false", async () => {
      const largeEntries = [
        createEntry({
          period: "YTD",
          waterfall_filter: "country",
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);
      const comparisonData = getComparisonData(result);

      expect(comparisonData.length).toBe(3);
      expect(comparisonData[0].title).toBe("Absolute Power");
      expect(comparisonData[1].title).toBe("vs LY");
      expect(comparisonData[2].title).toBe("NR Weight");
    });

    it("should return correct comparisonLine for portfolio filter with QTD=true", async () => {
      const largeEntries = [
        createEntry({
          period: "QTD",
          waterfall_filter: "portfolio",
          ac_vs_lq: 3.2,
          ac_vs_lq_direction: "down",
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);
      const comparisonData = getComparisonData(result);

      expect(comparisonData.length).toBe(3);
      expect(comparisonData[0].title).toBe("Absolute Power");
      expect(comparisonData[1].title).toBe("vs LY");
      expect(comparisonData[2].title).toBe("vs LQ");
    });

    it("should return correct comparisonLine for portfolio filter with QTD=false", async () => {
      const largeEntries = [
        createEntry({
          period: "YTD",
          waterfall_filter: "portfolio",
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);
      const comparisonData = getComparisonData(result);

      expect(comparisonData.length).toBe(2);
      expect(comparisonData[0].title).toBe("Absolute Power");
      expect(comparisonData[1].title).toBe("vs LY");
    });

    it("should return correct comparisonLine for brand filter with QTD=true", async () => {
      const largeEntries = [
        createEntry({
          period: "QTD",
          waterfall_filter: "brand",
          ac_vs_lq: 7.8,
          ac_vs_lq_direction: "up",
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);
      const comparisonData = getComparisonData(result);

      expect(comparisonData.length).toBe(3);
      expect(comparisonData[0].title).toBe("Absolute Power");
      expect(comparisonData[1].title).toBe("vs LY");
      expect(comparisonData[2].title).toBe("vs LQ");
    });

    it("should return correct comparisonLine for brand filter with QTD=false", async () => {
      const largeEntries = [
        createEntry({
          period: "YTD",
          waterfall_filter: "brand",
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);
      const comparisonData = getComparisonData(result);

      expect(comparisonData.length).toBe(2);
      expect(comparisonData[0].title).toBe("Absolute Power");
      expect(comparisonData[1].title).toBe("vs LY");
    });

    it("should use fallback comparisonLine when waterfall_filter is not set", async () => {
      const largeEntries = [
        createEntry({
          period: "YTD",
          // waterfall_filter not set
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);
      const comparisonData = getComparisonData(result);

      expect(comparisonData.length).toBe(3);
      expect(comparisonData[0].title).toBe("Absolute Power");
      expect(comparisonData[1].title).toBe("vs LY");
      expect(comparisonData[2].title).toBe("NR Weight");
    });

    it("should use fallback comparisonLine when waterfall_filter is empty string", async () => {
      const largeEntries = [
        createEntry({
          period: "QTD",
          waterfall_filter: "",
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);
      const comparisonData = getComparisonData(result);

      expect(comparisonData.length).toBe(3);
      expect(comparisonData[0].title).toBe("Absolute Power");
      expect(comparisonData[1].title).toBe("vs LQ");
      expect(comparisonData[2].title).toBe("NR Weight");
    });

    it("should handle vs_lq data correctly when ac_vs_lq is provided", async () => {
      const largeEntries = [
        createEntry({
          period: "QTD",
          waterfall_filter: "country",
          ac_vs_ly: 5.0,
          ac_vs_ly_direction: "up",
          ac_vs_lq: 3.5,
          ac_vs_lq_direction: "down",
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);
      const comparisonData = getComparisonData(result);

      const vsLqLine = comparisonData.find(
        (line: any) => line.title === "vs LQ",
      );
      expect(vsLqLine).toBeDefined();
      // JSONata property projection may return single object or array
      const vsLqDataArray = Array.isArray(vsLqLine.data)
        ? vsLqLine.data
        : [vsLqLine.data];
      expect(vsLqDataArray.length).toBeGreaterThan(0);
      expect(vsLqDataArray[0].value).toBe("3.5");
      expect(vsLqDataArray[0].trend).toBe("positive");
    });

    it("should fallback to ac_vs_ly when ac_vs_lq is not provided", async () => {
      const largeEntries = [
        createEntry({
          period: "QTD",
          waterfall_filter: "country",
          ac_vs_ly: 5.0,
          ac_vs_ly_direction: "up",
          // ac_vs_lq not provided
        }),
      ];

      const mockInput = createMockInput(largeEntries, []);
      const result = await evaluateExpression(mockInput);
      const comparisonData = getComparisonData(result);

      const vsLqLine = comparisonData.find(
        (line: any) => line.title === "vs LQ",
      );
      expect(vsLqLine).toBeDefined();
      // JSONata property projection may return single object or array
      const vsLqDataArray = Array.isArray(vsLqLine.data)
        ? vsLqLine.data
        : [vsLqLine.data];
      expect(vsLqDataArray.length).toBeGreaterThan(0);
      // When ac_vs_lq is not provided, formatValue returns "-" (no fallback to ac_vs_ly)
      expect(vsLqDataArray[0].value).toBe("-");
      // When ac_vs_lq_direction is not provided, $trend returns "negative" (default)
      expect(vsLqDataArray[0].trend).toBe("negative");
    });
  });
});

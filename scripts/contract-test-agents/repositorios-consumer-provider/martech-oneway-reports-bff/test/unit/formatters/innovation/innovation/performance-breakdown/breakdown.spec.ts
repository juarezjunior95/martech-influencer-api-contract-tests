import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { waterfallDataSchema } from "../../../../../../src/infrastructure/schema/components/waterfall.schema";

describe("innovation breakdown formatter", () => {
  let ajv: Ajv;
  let compiledExpression: jsonata.Expression;

  const DATASOURCE_KEY =
    "innovation_innovation_performance-breakdown_breakdown";
  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/innovation/innovation/performance-breakdown/breakdown.jsonata",
  );

  type DatasourceEntry = {
    kpi_name: string;
    brand: string;
    country: string;
    brand_image?: string;
    country_flag?: string;
    dt_ini: string;
    dt_end: string;
    le: number;
    le_total: number;
    le_ly_total?: number;
    expiration?: number;
    baseline?: number;
    le_vs_ly: number | null;
    le_vs_ly_direction: string;
    le_vs_bu: number | null;
    le_vs_bu_direction: string;
    growth_cont: number | null;
    growth_cont_direction: string;
  };

  // Helper function to create a datasource entry
  const createEntry = (
    overrides: Partial<DatasourceEntry>,
  ): DatasourceEntry => ({
    kpi_name: "innovation_volume",
    brand: "N/A",
    country: "BRA",
    country_flag: "https://example.com/BRA.png",
    dt_ini: "2025-01-01T00:00:00.000Z",
    dt_end: "2025-09-01T00:00:00.000Z",
    le: 1000,
    le_total: 5000,
    le_ly_total: 4500,
    le_vs_ly: 5.2,
    le_vs_ly_direction: "up",
    le_vs_bu: 10.5,
    le_vs_bu_direction: "up",
    growth_cont: 0.2,
    growth_cont_direction: "up",
    ...overrides,
  });

  // Helper function to create mock input
  const createMockInput = (
    datasourceKey: string,
    entries: DatasourceEntry[],
  ) => ({
    datasources: {
      [datasourceKey]: entries,
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
  });

  it("should return waterfall data when all datasources have data (country view)", async () => {
    const entries = [
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "USA",
        country_flag: "https://example.com/USA.png",
        le: 1500,
        le_total: 8000,
        le_ly_total: 7500,
        le_vs_ly: 8.5,
        le_vs_ly_direction: "up",
        le_vs_bu: 15.2,
        le_vs_bu_direction: "up",
        growth_cont: 0.1875,
        growth_cont_direction: "up",
      }),
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "BRA",
        country_flag: "https://example.com/BRA.png",
        le: 2200,
        le_total: 8000,
        le_vs_ly: -3.2,
        le_vs_ly_direction: "down",
        le_vs_bu: 12.8,
        le_vs_bu_direction: "up",
        growth_cont: 0.275,
        growth_cont_direction: "up",
      }),
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "MEX",
        country_flag: "https://example.com/MEX.png",
        le: 1800,
        le_total: 8000,
        le_vs_ly: 12.1,
        le_vs_ly_direction: "up",
        le_vs_bu: 18.5,
        le_vs_bu_direction: "up",
        growth_cont: 0.225,
        growth_cont_direction: "up",
      }),
    ];

    const mockInput = createMockInput(DATASOURCE_KEY, entries);
    const result = await evaluateExpression(mockInput);

    // Should not be empty
    expect(result.empty).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.labels).toBeDefined();
    expect(result.specialIndexes).toBeDefined();
    expect(result.comparisonLineData).toBeDefined();
    expect(result.brandsImg).toBeDefined();

    // Validate schema
    const validate = ajv.compile(waterfallDataSchema);
    const isValid = validate(result);
    if (!isValid && validate.errors) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    // Validate data array structure: [lyBar, expiration (if != 0), baseline (if != 0), ...le values, totalBar]
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBe(5); // lyBar + 3 entries + totalBar (no expiration or baseline)
    expect(result.data[0]).toBe(7500); // le_ly_total
    expect(result.data[1]).toBe(1500); // first le
    expect(result.data[2]).toBe(2200); // second le
    expect(result.data[3]).toBe(1800); // third le
    expect(result.data[4]).toBe(8000); // le_total

    // Validate labels array structure: [lyLabel, expiration (if != 0), baseline (if != 0), ...country names, cyLabel]
    expect(Array.isArray(result.labels)).toBe(true);
    expect(result.labels.length).toBe(5);
    expect(result.labels[0]).toBe("2024"); // lyLabel (dt_end year - 1)
    expect(result.labels[1]).toBe("USA");
    expect(result.labels[2]).toBe("BRA");
    expect(result.labels[3]).toBe("MEX");
    expect(result.labels[4]).toBe("2025"); // cyLabel (dt_end year)

    // Validate specialIndexes
    expect(result.specialIndexes).toBeDefined();
    expect(result.specialIndexes.first).toBe(0); // First index is always 0
    expect(result.specialIndexes.last).toBe(4); // Last index (dataArray.length - 1)
    expect(result.specialIndexes.retained).toBe(-1); // No baseline in this test

    // Validate comparison line data
    expect(Array.isArray(result.comparisonLineData)).toBe(true);
    expect(result.comparisonLineData.length).toBe(3);

    // Validate first comparison line (vs LY)
    const vsLyLine = result.comparisonLineData[0];
    expect(vsLyLine.title).toBe("Vol. % vs LY");
    expect(Array.isArray(vsLyLine.data)).toBe(true);
    expect(vsLyLine.data.length).toBe(5); // empty + 3 entries + empty (no expiration or baseline)

    // Validate second comparison line (Growth Contrib.)
    const growthContLine = result.comparisonLineData[1];
    expect(growthContLine.title).toBe("Vol. Growth Contrib.");
    expect(Array.isArray(growthContLine.data)).toBe(true);
    expect(growthContLine.data.length).toBe(5);

    // Validate third comparison line (vs BU)
    const vsBuLine = result.comparisonLineData[2];
    expect(vsBuLine.title).toBe("Vol. % vs BU");
    expect(Array.isArray(vsBuLine.data)).toBe(true);
    expect(vsBuLine.data.length).toBe(5);

    // Validate brands images
    expect(Array.isArray(result.brandsImg)).toBe(true);
    expect(result.brandsImg.length).toBe(3); // 3 entries (no expiration or baseline)
    expect(result.brandsImg[0].mainBrand.src).toBe(
      "https://example.com/USA.png",
    );
    expect(result.brandsImg[0].mainBrand.alt).toBe("USA");
    expect(result.brandsImg[0].title).toBe("USA");
  });

  it("should return waterfall data when all datasources have data (brand view)", async () => {
    const entries = [
      createEntry({
        kpi_name: "innovation_nr",
        brand: "Budweiser",
        country: "BRA",
        brand_image: "https://example.com/budweiser.png",
        le: 850,
        le_total: 3000,
        le_ly_total: 2800,
        le_vs_ly: 6.8,
        le_vs_ly_direction: "up",
        le_vs_bu: 25.3,
        le_vs_bu_direction: "up",
        growth_cont: 0.2833,
        growth_cont_direction: "up",
      }),
      createEntry({
        kpi_name: "innovation_nr",
        brand: "Stella Artois",
        country: "BRA",
        brand_image: "https://example.com/stella.png",
        le: 650,
        le_total: 3000,
        le_vs_ly: -4.2,
        le_vs_ly_direction: "down",
        le_vs_bu: 18.7,
        le_vs_bu_direction: "up",
        growth_cont: 0.2167,
        growth_cont_direction: "up",
      }),
      createEntry({
        kpi_name: "innovation_nr",
        brand: "Corona",
        country: "BRA",
        brand_image: "https://example.com/corona.png",
        le: 500,
        le_total: 3000,
        le_vs_ly: 15.5,
        le_vs_ly_direction: "up",
        le_vs_bu: 12.1,
        le_vs_bu_direction: "up",
        growth_cont: 0.1667,
        growth_cont_direction: "up",
      }),
    ];

    const mockInput = createMockInput(DATASOURCE_KEY, entries);
    const result = await evaluateExpression(mockInput);

    // Validate schema
    const validate = ajv.compile(waterfallDataSchema);
    const isValid = validate(result);
    if (!isValid && validate.errors) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    // Validate data structure
    expect(result.data.length).toBe(5); // lyBar + 3 entries + totalBar
    expect(result.labels.length).toBe(5);

    // Validate labels use brand names
    expect(result.labels[1]).toBe("Budweiser");
    expect(result.labels[2]).toBe("Stella Artois");
    expect(result.labels[3]).toBe("Corona");

    // Validate specialIndexes
    expect(result.specialIndexes).toBeDefined();
    expect(result.specialIndexes.first).toBe(0);
    expect(result.specialIndexes.last).toBe(4);
    expect(result.specialIndexes.retained).toBe(-1); // No baseline

    // Validate brands images use brand_image
    expect(result.brandsImg[0].mainBrand.src).toBe(
      "https://example.com/budweiser.png",
    );
    expect(result.brandsImg[0].mainBrand.alt).toBe("Budweiser");
    expect(result.brandsImg[0].title).toBe("Budweiser");
  });

  it("should return waterfall data when all datasources have with one item (brand view)", async () => {
    const entries = [
      createEntry({
        kpi_name: "innovation_nr",
        brand: "Budweiser",
        country: "BRA",
        brand_image: "https://example.com/budweiser.png",
        le: 850,
        le_total: 3000,
        le_ly_total: 2800,
        le_vs_ly: 6.8,
        le_vs_ly_direction: "up",
        le_vs_bu: 25.3,
        le_vs_bu_direction: "up",
        growth_cont: 0.2833,
        growth_cont_direction: "up",
      }),
    ];

    const mockInput = createMockInput(DATASOURCE_KEY, entries);
    const result = await evaluateExpression(mockInput);

    // Validate schema
    const validate = ajv.compile(waterfallDataSchema);
    const isValid = validate(result);
    if (!isValid && validate.errors) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    // Validate data structure
    expect(result.data.length).toBe(3); // lyBar + 1 entry + totalBar
    expect(result.labels.length).toBe(3);

    // Validate labels use brand names
    expect(result.labels[0]).toBe("2024");
    expect(result.labels[1]).toBe("Budweiser");
    expect(result.labels[2]).toBe("2025");

    // Validate specialIndexes
    expect(result.specialIndexes).toBeDefined();
    expect(result.specialIndexes.first).toBe(0);
    expect(result.specialIndexes.last).toBe(2);
    expect(result.specialIndexes.retained).toBe(-1); // No baseline

    // Validate brands images use brand_image
    expect(Array.isArray(result.brandsImg)).toBe(true);
    expect(result.brandsImg.length).toBe(1);
    expect(result.brandsImg[0].mainBrand.src).toBe(
      "https://example.com/budweiser.png",
    );
    expect(result.brandsImg[0].mainBrand.alt).toBe("Budweiser");
    expect(result.brandsImg[0].title).toBe("Budweiser");
  });

  it("should return empty object when datasource is empty", async () => {
    const mockInput = createMockInput(DATASOURCE_KEY, []);

    const result = await evaluateExpression(mockInput);

    expect(result).toEqual({ empty: true });
  });

  it("should handle null values in comparison line data", async () => {
    const entries = [
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "USA",
        country_flag: "https://example.com/USA.png",
        le: 1500,
        le_total: 5000,
        le_ly_total: 4500,
        le_vs_ly: null, // null value
        le_vs_ly_direction: "up",
        le_vs_bu: 15.2,
        le_vs_bu_direction: "up",
        growth_cont: 0.3,
        growth_cont_direction: "up",
      }),
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "BRA",
        country_flag: "https://example.com/BRA.png",
        le: 2000,
        le_total: 5000,
        le_vs_ly: -5.5,
        le_vs_ly_direction: "down",
        le_vs_bu: null, // null value
        le_vs_bu_direction: "up",
        growth_cont: null, // null value
        growth_cont_direction: "up",
      }),
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "MEX",
        country_flag: "https://example.com/MEX.png",
        le: 1500,
        le_total: 5000,
        le_vs_ly: 10.2,
        le_vs_ly_direction: "up",
        le_vs_bu: 20.5,
        le_vs_bu_direction: "up",
        growth_cont: 0.3,
        growth_cont_direction: "up",
      }),
    ];

    const mockInput = createMockInput(DATASOURCE_KEY, entries);
    const result = await evaluateExpression(mockInput);

    // Validate schema
    const validate = ajv.compile(waterfallDataSchema);
    const isValid = validate(result);
    if (!isValid && validate.errors) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    // Validate that null values are converted to "-" with empty measure and color
    const vsLyLine = result.comparisonLineData[0];
    // First entry has null le_vs_ly, so it should be "-"
    // Index 1 is the first data entry (no expiration or baseline in this test)
    expect(vsLyLine.data[1].value).toBe("-");
    expect(vsLyLine.data[1].measure).toBe("");
    expect(vsLyLine.data[1].color).toBe("");

    // Second entry has valid le_vs_ly
    expect(vsLyLine.data[2].value).toBe("-5.5");
    expect(vsLyLine.data[2].measure).toBe("%");
    expect(vsLyLine.data[2].color).toBe("#B91C1C"); // down direction

    // Validate growth contrib line with null
    const growthContLine = result.comparisonLineData[1];
    // Second entry has null growth_cont
    expect(growthContLine.data[2].value).toBe("-");
    expect(growthContLine.data[2].measure).toBe("");
    expect(growthContLine.data[2].color).toBe("");

    // Validate vs BU line with null
    const vsBuLine = result.comparisonLineData[2];
    // Second entry has null le_vs_bu
    expect(vsBuLine.data[2].value).toBe("-");
    expect(vsBuLine.data[2].measure).toBe("");
    expect(vsBuLine.data[2].color).toBe("");

    // Validate specialIndexes
    expect(result.specialIndexes).toBeDefined();
    expect(result.specialIndexes.first).toBe(0);
    expect(result.specialIndexes.last).toBe(4);
    expect(result.specialIndexes.retained).toBe(-1); // No baseline
  });

  it("should ensure all comparison lines start and end with emptyComparisonPoint", async () => {
    const entries = [
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "USA",
        country_flag: "https://example.com/USA.png",
        le: 1500,
        le_total: 5000,
        le_ly_total: 4500,
        le_vs_ly: 8.5,
        le_vs_ly_direction: "up",
        le_vs_bu: 15.2,
        le_vs_bu_direction: "up",
        growth_cont: 0.3,
        growth_cont_direction: "up",
      }),
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "BRA",
        country_flag: "https://example.com/BRA.png",
        le: 2000,
        le_total: 5000,
        le_vs_ly: -3.2,
        le_vs_ly_direction: "down",
        le_vs_bu: 12.8,
        le_vs_bu_direction: "up",
        growth_cont: 0.4,
        growth_cont_direction: "up",
      }),
    ];

    const mockInput = createMockInput(DATASOURCE_KEY, entries);
    const result = await evaluateExpression(mockInput);

    const emptyComparisonPoint = {
      value: "",
      measure: "",
      color: "",
    };

    // Validate all three comparison lines
    result.comparisonLineData.forEach((line: any) => {
      expect(Array.isArray(line.data)).toBe(true);
      expect(line.data.length).toBe(4); // empty + 2 entries + empty (no expiration or baseline)

      // First element should be emptyComparisonPoint
      expect(line.data[0]).toEqual(emptyComparisonPoint);

      // Last element should be emptyComparisonPoint
      expect(line.data[line.data.length - 1]).toEqual(emptyComparisonPoint);
    });

    // Specifically validate vs LY line
    const vsLyLine = result.comparisonLineData[0];
    expect(vsLyLine.data[0]).toEqual(emptyComparisonPoint);
    expect(vsLyLine.data[1].value).toBe("8.5");
    expect(vsLyLine.data[1].measure).toBe("%");
    expect(vsLyLine.data[1].color).toBe("#007800"); // up direction
    expect(vsLyLine.data[2].value).toBe("-3.2");
    expect(vsLyLine.data[2].measure).toBe("%");
    expect(vsLyLine.data[2].color).toBe("#B91C1C"); // down direction
    expect(vsLyLine.data[3]).toEqual(emptyComparisonPoint);

    // Validate Growth Contrib. line
    const growthContLine = result.comparisonLineData[1];
    expect(growthContLine.data[0]).toEqual(emptyComparisonPoint);
    expect(growthContLine.data[3]).toEqual(emptyComparisonPoint);

    // Validate vs BU line
    const vsBuLine = result.comparisonLineData[2];
    expect(vsBuLine.data[0]).toEqual(emptyComparisonPoint);
    expect(vsBuLine.data[3]).toEqual(emptyComparisonPoint);

    // Validate specialIndexes
    expect(result.specialIndexes).toBeDefined();
    expect(result.specialIndexes.first).toBe(0);
    expect(result.specialIndexes.last).toBe(3);
    expect(result.specialIndexes.retained).toBe(-1); // No baseline
  });

  it("should include expiration and baseline when values are not zero", async () => {
    const entries = [
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "USA",
        country_flag: "https://example.com/USA.png",
        le: 1500,
        le_total: 8000,
        le_ly_total: 7500,
        expiration: 500,
        baseline: 300,
        le_vs_ly: 8.5,
        le_vs_ly_direction: "up",
        le_vs_bu: 15.2,
        le_vs_bu_direction: "up",
        growth_cont: 0.1875,
        growth_cont_direction: "up",
      }),
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "BRA",
        country_flag: "https://example.com/BRA.png",
        le: 2200,
        le_total: 8000,
        le_vs_ly: -3.2,
        le_vs_ly_direction: "down",
        le_vs_bu: 12.8,
        le_vs_bu_direction: "up",
        growth_cont: 0.275,
        growth_cont_direction: "up",
      }),
    ];

    const mockInput = createMockInput(DATASOURCE_KEY, entries);
    const result = await evaluateExpression(mockInput);

    // Validate schema
    const validate = ajv.compile(waterfallDataSchema);
    const isValid = validate(result);
    if (!isValid && validate.errors) {
      console.error(
        "Validation errors:",
        JSON.stringify(validate.errors, null, 2),
      );
    }
    expect(isValid).toBe(true);

    // Validate data array structure: [lyBar, expiration, baseline, ...le values, totalBar]
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBe(6); // lyBar + expiration + baseline + 2 entries + totalBar
    expect(result.data[0]).toBe(7500); // le_ly_total
    expect(result.data[1]).toBe(500); // expiration
    expect(result.data[2]).toBe(300); // baseline
    expect(result.data[3]).toBe(1500); // first le
    expect(result.data[4]).toBe(2200); // second le
    expect(result.data[5]).toBe(8000); // le_total

    // Validate labels array structure: [lyLabel, "Expiration", "Baseline", ...country names, cyLabel]
    expect(Array.isArray(result.labels)).toBe(true);
    expect(result.labels.length).toBe(6);
    expect(result.labels[0]).toBe("2024"); // lyLabel
    expect(result.labels[1]).toBe("Expiration");
    expect(result.labels[2]).toBe("Baseline");
    expect(result.labels[3]).toBe("USA");
    expect(result.labels[4]).toBe("BRA");
    expect(result.labels[5]).toBe("2025"); // cyLabel

    // Validate comparison line data includes empty points for expiration and baseline
    const vsLyLine = result.comparisonLineData[0];
    expect(Array.isArray(vsLyLine.data)).toBe(true);
    expect(vsLyLine.data.length).toBe(6); // empty + expiration empty + baseline empty + 2 entries + empty

    const emptyComparisonPoint = {
      value: "",
      measure: "",
      color: "",
    };
    expect(vsLyLine.data[0]).toEqual(emptyComparisonPoint); // first empty
    expect(vsLyLine.data[1]).toEqual(emptyComparisonPoint); // expiration empty
    expect(vsLyLine.data[2]).toEqual(emptyComparisonPoint); // baseline empty
    expect(vsLyLine.data[5]).toEqual(emptyComparisonPoint); // last empty

    // Validate brands images include expiration and baseline entries
    expect(Array.isArray(result.brandsImg)).toBe(true);
    expect(result.brandsImg.length).toBe(4); // expiration + baseline + 2 entries
    expect(result.brandsImg[0].title).toBe("Expiration");
    expect(result.brandsImg[0].mainBrand.src).toBe("");
    expect(result.brandsImg[0].mainBrand.alt).toBe("Expiration");
    expect(result.brandsImg[1].title).toBe("Baseline");
    expect(result.brandsImg[1].mainBrand.src).toBe("");
    expect(result.brandsImg[1].mainBrand.alt).toBe("Baseline");
    expect(result.brandsImg[2].title).toBe("USA");
    expect(result.brandsImg[3].title).toBe("BRA");

    // Validate specialIndexes with baseline
    expect(result.specialIndexes).toBeDefined();
    expect(result.specialIndexes.first).toBe(0);
    expect(result.specialIndexes.last).toBe(5);
    expect(result.specialIndexes.retained).toBe(2); // Baseline is at index 2
  });

  it("should not include expiration and baseline when values are zero", async () => {
    const entries = [
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "USA",
        country_flag: "https://example.com/USA.png",
        le: 1500,
        le_total: 8000,
        le_ly_total: 7500,
        expiration: 0,
        baseline: 0,
        le_vs_ly: 8.5,
        le_vs_ly_direction: "up",
        le_vs_bu: 15.2,
        le_vs_bu_direction: "up",
        growth_cont: 0.1875,
        growth_cont_direction: "up",
      }),
      createEntry({
        kpi_name: "innovation_volume",
        brand: "N/A",
        country: "BRA",
        country_flag: "https://example.com/BRA.png",
        le: 2200,
        le_total: 8000,
        le_vs_ly: -3.2,
        le_vs_ly_direction: "down",
        le_vs_bu: 12.8,
        le_vs_bu_direction: "up",
        growth_cont: 0.275,
        growth_cont_direction: "up",
      }),
    ];

    const mockInput = createMockInput(DATASOURCE_KEY, entries);
    const result = await evaluateExpression(mockInput);

    // Validate data array structure: [lyBar, ...le values, totalBar] (no expiration or baseline)
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBe(4); // lyBar + 2 entries + totalBar
    expect(result.data[0]).toBe(7500); // le_ly_total
    expect(result.data[1]).toBe(1500); // first le
    expect(result.data[2]).toBe(2200); // second le
    expect(result.data[3]).toBe(8000); // le_total

    // Validate labels array structure: [lyLabel, ...country names, cyLabel] (no expiration or baseline)
    expect(Array.isArray(result.labels)).toBe(true);
    expect(result.labels.length).toBe(4);
    expect(result.labels[0]).toBe("2024"); // lyLabel
    expect(result.labels[1]).toBe("USA");
    expect(result.labels[2]).toBe("BRA");
    expect(result.labels[3]).toBe("2025"); // cyLabel

    // Validate comparison line data does not include empty points for expiration and baseline
    const vsLyLine = result.comparisonLineData[0];
    expect(Array.isArray(vsLyLine.data)).toBe(true);
    expect(vsLyLine.data.length).toBe(4); // empty + 2 entries + empty

    // Validate brands images do not include expiration and baseline entries
    expect(Array.isArray(result.brandsImg)).toBe(true);
    expect(result.brandsImg.length).toBe(2); // 2 entries only
    expect(result.brandsImg[0].title).toBe("USA");
    expect(result.brandsImg[1].title).toBe("BRA");

    // Validate specialIndexes without baseline
    expect(result.specialIndexes).toBeDefined();
    expect(result.specialIndexes.first).toBe(0);
    expect(result.specialIndexes.last).toBe(3);
    expect(result.specialIndexes.retained).toBe(-1); // No baseline
  });
});

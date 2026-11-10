import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { waterfallDataSchema } from "../../../../../../../src/infrastructure/schema/components/waterfall.schema";

describe("contribution waterfall formatter (finance)", () => {
  let ajv: Ajv;
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/performance-tool/drill-down/finance/contribution-waterfall.jsonata",
  );

  type DatasourceEntry = {
    kpi_name: string;
    raw_brand: string;
    country_iso_code_3: string;
    step_name: string;
    brand?: { imageSquare?: string };
    country?: { imageIcon?: string };
    portfolio?: string;
    sub_brand?: string;
    beer_price_segment?: string;
    dt_end: string;
    ac: number | null;
    ac_vs_ly: number | null;
    variationDirectionVsLy: string;
    comp_unit_of_measure?: string;
  };

  const createEntry = (
    overrides: Partial<DatasourceEntry>,
  ): DatasourceEntry => ({
    kpi_name: "value_creation",
    raw_brand: "",
    country_iso_code_3: "",
    step_name: "Total",
    dt_end: "2025-09-01T00:00:00.000Z",
    ac: 100,
    ac_vs_ly: 5.2,
    variationDirectionVsLy: "up",
    comp_unit_of_measure: "pp",
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
  ) => compiledExpression.evaluate(input);

  const normalizeLabels = (labels: unknown): unknown[] =>
    JSON.parse(JSON.stringify(Array.from(labels as Iterable<unknown>)));

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);

    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  /**
   * Finance formatter uses $dataLarge[1] (second row) to determine waterfallType.
   * Order: beer_price_segment → portfolio → sub_brand → brand_country → brand → country → "".
   * Each test uses at least 2 rows so index 1 exists for type detection.
   */
  it("should return empty object when both datasources are empty", async () => {
    const mockInput = createMockInput([], []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBe(true);
    expect(result.large).toBeUndefined();
    expect(result.small).toBeUndefined();
    expect(result.wt).toBeUndefined();
  });

  it("should return waterfall data for waterfallType beer_price_segment (plain images)", async () => {
    const largeEntries = [
      createEntry({ step_name: "LY Total", ac: 1000 }),
      createEntry({
        step_name: "Premium",
        beer_price_segment: "Premium",
        ac: 200,
      }),
      createEntry({ step_name: "Total", ac: 1200 }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();
    expect(result.large).toBeDefined();
    expect(Array.from(result.large.values)).toEqual([1000, 200, 1200]);
    expect(normalizeLabels(result.large.labels)).toEqual([
      "LY Total",
      "Premium",
      "Total",
    ]);
    expect(result.large.comparisonLine).toBeDefined();
    expect(Array.isArray(result.large.comparisonLine.data)).toBe(true);
    expect(result.large.comparisonLine.data[0].title).toBe("vs LY");
    expect(result.large.images).toBeDefined();
    expect(result.large.images.data.length).toBe(3);
    expect(result.large.images.data[0].title).toBe("LY Total");
    expect(result.large.images.data[1].title).toBe("Premium");
    expect(result.large.images.data[2].title).toBe("Total");
    expect(result.large.images.data[1].mainBrand.src).toBe("");
    expect(result.large.images.data[1].mainBrand.alt).toBe("Premium");
  });

  it("should return waterfall data for waterfallType portfolio (plain images)", async () => {
    const largeEntries = [
      createEntry({ step_name: "LY Total", ac: 800 }),
      createEntry({
        step_name: "Core",
        portfolio: "Core",
        beer_price_segment: "",
        ac: 150,
      }),
      createEntry({ step_name: "Total", ac: 950 }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();
    expect(result.large).toBeDefined();
    expect(Array.from(result.large.values)).toEqual([800, 150, 950]);
    expect(normalizeLabels(result.large.labels)).toEqual([
      "LY Total",
      "Core",
      "Total",
    ]);
    expect(result.large.images).toBeDefined();
    expect(result.large.images.data.length).toBe(3);
    expect(result.large.images.data[0].title).toBe("LY Total");
    expect(result.large.images.data[1].title).toBe("Core");
    expect(result.large.images.data[2].title).toBe("Total");
    expect(result.large.images.data[1].mainBrand.src).toBe("");
    expect(result.large.images.data[1].mainBrand.alt).toBe("Core");
  });

  it("should return waterfall data for waterfallType sub_brand (plain images)", async () => {
    const largeEntries = [
      createEntry({ step_name: "LY Total", ac: 500 }),
      createEntry({
        step_name: "Bud Light",
        sub_brand: "Bud Light",
        portfolio: "",
        beer_price_segment: "",
        ac: 80,
      }),
      createEntry({ step_name: "Total", ac: 580 }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();
    expect(result.large).toBeDefined();
    expect(Array.from(result.large.values)).toEqual([500, 80, 580]);
    expect(normalizeLabels(result.large.labels)).toEqual([
      "LY Total",
      "Bud Light",
      "Total",
    ]);
    expect(result.large.images).toBeDefined();
    expect(result.large.images.data[0].title).toBe("LY Total");
    expect(result.large.images.data[1].title).toBe("Bud Light");
    expect(result.large.images.data[2].title).toBe("Total");
    expect(result.large.images.data[1].mainBrand.src).toBe("");
    expect(result.large.images.data[1].mainBrand.alt).toBe("Bud Light");
  });

  it("should return waterfall data for waterfallType brand_country (badged images, [brand, country] labels)", async () => {
    const largeEntries = [
      createEntry({
        step_name: "LY Total",
        raw_brand: "N/A",
        country_iso_code_3: "N/A",
        ac: 3000,
      }),
      createEntry({
        step_name: "Budweiser BRA",
        raw_brand: "Budweiser",
        country_iso_code_3: "BRA",
        brand: { imageSquare: "https://example.com/budweiser.png" },
        country: { imageIcon: "https://example.com/BRA.png" },
        sub_brand: "",
        portfolio: "",
        beer_price_segment: "",
        ac: 400,
      }),
      createEntry({
        step_name: "Total",
        raw_brand: "N/A",
        country_iso_code_3: "N/A",
        ac: 3400,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();
    expect(result.large).toBeDefined();
    expect(Array.from(result.large.values)).toEqual([3000, 400, 3400]);
    expect(normalizeLabels(result.large.labels)).toEqual([
      ["N/A", "N/A"],
      ["Budweiser", "BRA"],
      ["N/A", "N/A"],
    ]);
    expect(result.large.images).toBeDefined();
    expect(result.large.images.data.length).toBe(3);
    expect(result.large.images.data[1].mainBrand.src).toBe(
      "https://example.com/budweiser.png",
    );
    expect(result.large.images.data[1].mainBrand.alt).toBe("Budweiser");
    expect(result.large.images.data[1].badgeFlag).toBeDefined();
    expect(result.large.images.data[1].badgeFlag.src).toBe(
      "https://example.com/BRA.png",
    );
    expect(result.large.images.data[1].badgeFlag.alt).toBe("BRA");
  });

  it("should return waterfall data for waterfallType brand (main_images)", async () => {
    const largeEntries = [
      createEntry({
        step_name: "LY Total",
        raw_brand: "N/A",
        country: { imageIcon: "https://example.com/total.png" },
        ac: 2000,
      }),
      createEntry({
        step_name: "Stella Artois",
        raw_brand: "Stella Artois",
        country_iso_code_3: "",
        brand: { imageSquare: "https://example.com/stella.png" },
        country: { imageIcon: "https://example.com/total.png" },
        sub_brand: "",
        portfolio: "",
        beer_price_segment: "",
        ac: 300,
      }),
      createEntry({
        step_name: "Total",
        raw_brand: "N/A",
        country: { imageIcon: "https://example.com/total.png" },
        ac: 2300,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();
    expect(result.large).toBeDefined();
    expect(Array.from(result.large.values)).toEqual([2000, 300, 2300]);
    expect(normalizeLabels(result.large.labels)).toEqual([
      ["N/A"],
      ["Stella Artois"],
      ["N/A"],
    ]);
    expect(result.large.images).toBeDefined();
    expect(result.large.images.data[1].mainBrand.src).toBe(
      "https://example.com/stella.png",
    );
    expect(result.large.images.data[1].mainBrand.alt).toBe("Stella Artois");
    expect(result.large.images.data[1].title).toBe("Stella Artois");
  });

  it("should return waterfall data for waterfallType country (main_images)", async () => {
    const largeEntries = [
      createEntry({
        step_name: "LY Total",
        raw_brand: "",
        country_iso_code_3: "N/A",
        country: { imageIcon: "https://example.com/total.png" },
        ac: 1500,
      }),
      createEntry({
        step_name: "USA",
        raw_brand: "",
        country_iso_code_3: "USA",
        country: { imageIcon: "https://example.com/USA.png" },
        sub_brand: "",
        portfolio: "",
        beer_price_segment: "",
        ac: 250,
      }),
      createEntry({
        step_name: "Total",
        raw_brand: "",
        country_iso_code_3: "N/A",
        country: { imageIcon: "https://example.com/total.png" },
        ac: 1750,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();
    expect(result.large).toBeDefined();
    expect(Array.from(result.large.values)).toEqual([1500, 250, 1750]);
    expect(normalizeLabels(result.large.labels)).toEqual([
      "LY Total",
      "USA",
      "Total",
    ]);
    expect(result.large.images).toBeDefined();
    expect(result.large.images.data[1].mainBrand.src).toBe(
      "https://example.com/USA.png",
    );
    expect(result.large.images.data[1].mainBrand.alt).toBe("USA");
    expect(result.large.images.data[1].title).toBe("USA");
  });

  it("should return waterfall data when waterfallType resolves to empty (no dimension set)", async () => {
    const largeEntries = [
      createEntry({
        step_name: "LY Total",
        raw_brand: "",
        country_iso_code_3: "",
        ac: 600,
      }),
      createEntry({
        step_name: "Other",
        raw_brand: "",
        country_iso_code_3: "",
        portfolio: "",
        sub_brand: "",
        beer_price_segment: "",
        ac: 50,
      }),
      createEntry({ step_name: "Total", ac: 650 }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();
    expect(result.large).toBeDefined();
    expect(Array.from(result.large.values)).toEqual([600, 50, 650]);
    const labels = normalizeLabels(result.large.labels);
    expect(labels.length).toBeGreaterThanOrEqual(2);
    expect(labels[0]).toBe("LY Total");
    expect(labels[labels.length - 1]).toBe("Total");
    expect(result.large.comparisonLine).toBeDefined();
    expect(result.large.comparisonLine.data).toBeDefined();
  });

  it("should handle null values and format as dash", async () => {
    const largeEntries = [
      createEntry({ step_name: "LY Total", ac: 100 }),
      createEntry({
        step_name: "Mid",
        ac: null,
        ac_vs_ly: null,
        variationDirectionVsLy: "up",
      }),
      createEntry({ step_name: "Total", ac: 100 }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.large).toBeDefined();
    const vsLyLine = result.large.comparisonLine.data[0];
    expect(vsLyLine.title).toBe("vs LY");
    const dataArr = Array.isArray(vsLyLine.data)
      ? vsLyLine.data
      : [vsLyLine.data];
    const midPoint = dataArr[1];
    expect(midPoint.value).toBe("-");
    expect(midPoint.measure).toBe("");
    expect(midPoint.trend).toBe("");
  });

  it("should format numbers and use variationDirectionVsLy for trend", async () => {
    const largeEntries = [
      createEntry({
        step_name: "A",
        ac: 1234.56,
        ac_vs_ly: 12.34,
        variationDirectionVsLy: "up",
      }),
      createEntry({
        step_name: "B",
        ac_vs_ly: -5.67,
        variationDirectionVsLy: "down",
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.large.comparisonLine.data[0].title).toBe("vs LY");
    const dataArr = result.large.comparisonLine.data[0].data;
    expect(dataArr[0].value).toBe("12.3");
    expect(dataArr[0].trend).toBe("positive");
    expect(dataArr[1].value).toContain("-5.7");
    expect(dataArr[1].trend).toBe("negative");
  });

  it("should use comp_unit_of_measure when present, else default to %", async () => {
    const largeEntries = [
      createEntry({
        step_name: "LY",
        comp_unit_of_measure: "pp",
        ac_vs_ly: 1.5,
      }),
      createEntry({
        step_name: "Total",
        comp_unit_of_measure: undefined,
        ac_vs_ly: 2,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    const dataArr = result.large.comparisonLine.data[0].data;
    expect(dataArr[0].measure).toBe("pp");
    expect(dataArr[1].measure).toBe("%");
  });

  it("should return empty structure for empty subset and handle only-large / only-small", async () => {
    const emptyInput = createMockInput([], []);
    const emptyResult = await evaluateExpression(emptyInput);
    expect(emptyResult.empty).toBe(true);

    const largeOnly = createMockInput(
      [
        createEntry({ step_name: "LY Total", ac: 100 }),
        createEntry({ step_name: "Total", ac: 100 }),
      ],
      [],
    );
    const largeOnlyResult = await evaluateExpression(largeOnly);
    expect(largeOnlyResult.large).toBeDefined();
    expect(largeOnlyResult.small).toEqual({});

    const smallOnly = createMockInput(
      [],
      [
        createEntry({ step_name: "LY Total", ac: 100 }),
        createEntry({ step_name: "Total", ac: 100 }),
      ],
    );
    const smallOnlyResult = await evaluateExpression(smallOnly);
    expect(smallOnlyResult.large).toEqual({});
    expect(smallOnlyResult.small).toBeDefined();
  });

  it("should validate large/small output against waterfallDataSchema (brand viewtype)", async () => {
    /* Use beer_price_segment data so labels are string[] (schema-compliant); formatter always adds formattedData which is not in schema, so we validate only allowed properties */
    const largeEntries = [
      createEntry({ step_name: "LY Total", ac: 1000 }),
      createEntry({
        step_name: "Premium",
        beer_price_segment: "Premium",
        ac: 200,
      }),
      createEntry({ step_name: "Total", ac: 1200 }),
    ];

    const mockInput = createMockInput(largeEntries, largeEntries.slice(0, 2));
    const result = await evaluateExpression(mockInput);

    expect(result.large).toBeDefined();
    expect(Object.keys(result.large!).length).toBeGreaterThan(0);

    /* Normalize and build schema-strict payload (only allowed properties; comparisonLineDataItem allows value, measure, color, trend) */
    const raw = {
      values: Array.from(result.large!.values),
      labels: normalizeLabels(result.large!.labels),
      comparisonLine: result.large!.comparisonLine,
      images: result.large!.images,
    };
    const normalized = JSON.parse(JSON.stringify(raw));

    const comparisonLine = normalized.comparisonLine;
    if (comparisonLine?.data) {
      comparisonLine.data = comparisonLine.data.map(
        (line: { title: string; data: unknown[] }) => ({
          title: line.title,
          data: line.data.map((item: Record<string, unknown>) => ({
            value: String(item.value ?? ""),
            measure: item.measure !== undefined ? String(item.measure) : "",
            trend: ["positive", "negative", ""].includes(
              String(item.trend ?? ""),
            )
              ? String(item.trend)
              : "",
          })),
        }),
      );
    }

    /* brandImageSchema allows only mainBrand and title; mainBrand only src and alt (alt minLength 1) */
    const images = normalized.images;
    if (images?.data) {
      images.data = images.data.map(
        (img: {
          mainBrand?: { src?: string; alt?: string };
          title?: string;
        }) => ({
          mainBrand: {
            src:
              typeof img.mainBrand?.src === "string" ? img.mainBrand.src : "",
            alt:
              typeof img.mainBrand?.alt === "string" &&
              img.mainBrand.alt.length > 0
                ? img.mainBrand.alt
                : img.title && img.title.length > 0
                  ? img.title
                  : " ",
          },
          title:
            typeof img.title === "string" && img.title.length > 0
              ? img.title
              : " ",
        }),
      );
    }

    const payloadToValidate = {
      values: normalized.values,
      labels: normalized.labels,
      comparisonLine: comparisonLine,
      images: images,
    };

    const validateLarge = ajv.compile(waterfallDataSchema);
    const isValidLarge = validateLarge(payloadToValidate);
    if (!isValidLarge && validateLarge.errors?.length) {
      throw new Error(
        `Schema validation failed: ${JSON.stringify(validateLarge.errors, null, 2)}`,
      );
    }
    expect(isValidLarge).toBe(true);
  });
});

import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("contribution waterfall formatter (net-revenue)", () => {
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/performance-tool/drill-down/finance/net-revenue/contribution-waterfall.jsonata",
  );

  type DatasourceEntry = {
    dt_end: string;
    period: string;
    label_value: string | string[];
    image_value: string;
    waterfall_filter: string;
    unit_of_measure?: string;
    comp_unit_of_measure?: string;
    ac: number;
    ac_direction: string;
    ac_delta: number;
    ac_delta_direction: string;
    ac_vs_ly: number | null;
    ac_vs_ly_direction: string;
    vol_vs_ly: number;
    vol_vs_ly_direction: string;
    nr_vs_ly: number;
    nr_vs_ly_direction: string;
    badgeFlag?: { src: string; alt: string } | undefined;
  };

  const createEntry = (
    overrides: Partial<DatasourceEntry>,
  ): DatasourceEntry => ({
    dt_end: "2025-12-01T00:00:00.000Z",
    period: "YTD'25",
    label_value: "",
    image_value: "https://example.com/image.png",
    waterfall_filter: "brand",
    unit_of_measure: "k hl",
    comp_unit_of_measure: "%",
    ac: 100,
    ac_direction: "up",
    ac_delta: 100,
    ac_delta_direction: "up",
    ac_vs_ly: 5.2,
    ac_vs_ly_direction: "up",
    vol_vs_ly: 10,
    vol_vs_ly_direction: "up",
    nr_vs_ly: 8.5,
    nr_vs_ly_direction: "up",
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
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  it("should return empty object when both datasources are empty", async () => {
    const mockInput = createMockInput([], []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBe(true);
    expect(result.large).toBeUndefined();
    expect(result.small).toBeUndefined();
  });

  it("should return waterfall data with large and small structures", async () => {
    const largeEntries = [
      createEntry({
        period: "YTD'25",
        label_value: "",
        ac_delta: 559581.7,
        ac: 559581.7,
      }),
      createEntry({
        period: "Budweiser\nABI",
        label_value: ["Budweiser"],
        image_value: "https://example.com/budweiser.png",
        ac_delta: -100,
        ac: -44956.5,
        ac_vs_ly: -100,
        vol_vs_ly: -100,
        nr_vs_ly: -9.1,
        badgeFlag: undefined,
      }),
      createEntry({
        period: "YTD'26",
        label_value: "",
        ac_delta: 45914,
        ac: 45914,
      }),
    ];

    const smallEntries = largeEntries.slice(0, 2);

    const mockInput = createMockInput(largeEntries, smallEntries);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();
    expect(result.large).toBeDefined();
    expect(result.small).toBeDefined();

    // Check values
    expect(Array.from(result.large.values)).toEqual([
      559581.7, -44956.5, 45914,
    ]);

    // Check labels - when brand, first and last are arrays [period, ""], middle uses label_value (array)
    expect(normalizeLabels(result.large.labels)).toEqual([
      ["YTD'25", ""],
      ["Budweiser"],
      ["YTD'26", ""],
    ]);

    // Check comparison line
    expect(result.large.comparisonLine).toBeDefined();
    expect(Array.isArray(result.large.comparisonLine.data)).toBe(true);
    expect(result.large.comparisonLine.data.length).toBe(3);
    expect(result.large.comparisonLine.data[0].title).toBe("vs LY");
    expect(result.large.comparisonLine.data[1].title).toBe("Vol vs LY");
    expect(result.large.comparisonLine.data[2].title).toBe("NR/hL vs LY");

    // Check images
    expect(result.large.images).toBeDefined();
    expect(result.large.images.data.length).toBe(3);
    expect(result.large.images.data[0].title).toBe("YTD'25");
    expect(result.large.images.data[1].title).toBe("Budweiser");
    expect(result.large.images.data[2].title).toBe("YTD'26");
    expect(result.large.images.data[1].mainBrand.src).toBe(
      "https://example.com/budweiser.png",
    );
    const altValue = result.large.images.data[1].mainBrand.alt;
    expect(Array.isArray(altValue) ? altValue[0] : altValue).toBe("Budweiser");
    expect(result.large.images.data[1].badgeFlag).toBeUndefined();
  });

  it("should include badgeFlag when provided", async () => {
    const largeEntries = [
      createEntry({
        period: "YTD'25",
        label_value: "",
        ac_delta: 559581.7,
        ac: 559581.7,
      }),
      createEntry({
        period: "Brahma\nBRA",
        label_value: ["Brahma"],
        image_value: "https://example.com/brahma.png",
        ac_delta: -100,
        ac: -27250.1,
        ac_vs_ly: -100,
        vol_vs_ly: -100,
        nr_vs_ly: -9,
        badgeFlag: {
          src: "https://example.com/BRA.png",
          alt: "BRA",
        },
      }),
      createEntry({
        period: "YTD'26",
        label_value: "",
        ac_delta: 45914,
        ac: 45914,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.large.images.data[1].badgeFlag).toBeDefined();
    expect(result.large.images.data[1].badgeFlag.src).toBe(
      "https://example.com/BRA.png",
    );
    expect(result.large.images.data[1].badgeFlag.alt).toBe("BRA");
  });

  it("should return empty object when no valid data", async () => {
    const largeEntries = [
      createEntry({
        ac_delta: 0,
        ac: 0,
        ac_vs_ly: null,
        vol_vs_ly: 0,
        nr_vs_ly: 0,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBe(true);
  });

  it("should format comparison values correctly", async () => {
    const largeEntries = [
      createEntry({
        period: "YTD'25",
        ac_delta: 1000,
        ac: 1000,
        ac_vs_ly: 5.5,
        vol_vs_ly: 10.2,
        nr_vs_ly: 8.3,
      }),
      createEntry({
        period: "Brand",
        ac_delta: 200,
        ac: 200,
        ac_vs_ly: -3.2,
        vol_vs_ly: -5.1,
        nr_vs_ly: -2.4,
      }),
      createEntry({
        period: "YTD'26",
        ac_delta: 1200,
        ac: 1200,
        ac_vs_ly: null,
        vol_vs_ly: 0,
        nr_vs_ly: 0,
      }),
    ];

    const mockInput = createMockInput(largeEntries, []);
    const result = await evaluateExpression(mockInput);

    const comparisonData = result.large.comparisonLine.data;
    // vs LY: [5.5, -3.2, -]
    expect(comparisonData[0].data[0].value).toBe("5.5");
    expect(comparisonData[0].data[1].value).toBe("-3.2");
    expect(comparisonData[0].data[2].value).toBe("-");
    // Vol vs LY: [10.2, -5.1, 0.0]
    expect(comparisonData[1].data[0].value).toBe("10.2");
    expect(comparisonData[1].data[1].value).toBe("-5.1");
    expect(comparisonData[1].data[2].value).toBe("0.0");
    // NR/hL vs LY: [8.3, -2.4, 0.0]
    expect(comparisonData[2].data[0].value).toBe("8.3");
    expect(comparisonData[2].data[1].value).toBe("-2.4");
    expect(comparisonData[2].data[2].value).toBe("0.0");
  });
});

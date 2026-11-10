import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";

describe("brands-by-segments bar-chart formatter", () => {
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/pr-pages/volume/brands-by-segments/bar-chart.jsonata",
  );

  type DatasourceEntry = {
    dt_ini: string;
    dt_end: string;
    period: string;
    ac: number;
    ac_vs_ly: number | null;
    ac_vs_bu: number | null;
    unit_of_measure: string;
    comp_unit_of_measure: string;
  };

  const createEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry => ({
    dt_ini: "2025-01-01",
    dt_end: "2025-12-31",
    period: "YTD'25",
    ac: 100.5,
    ac_vs_ly: 5.2,
    ac_vs_bu: 3.1,
    unit_of_measure: "k hl",
    comp_unit_of_measure: "%",
    ...overrides,
  });

  const createBudgetEntry = (
    overrides: Partial<DatasourceEntry> = {},
  ): DatasourceEntry =>
    createEntry({
      period: "BU'25",
      ac: 95.0,
      ac_vs_ly: 2.1,
      ac_vs_bu: null,
      ...overrides,
    });

  const createMockInput = (entries: DatasourceEntry[]) => ({
    datasources: {
      "bar-chart": entries,
    },
  });

  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => {
    return await compiledExpression.evaluate(input);
  };

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
  });

  it("should handle empty datasource", async () => {
    const mockInput = createMockInput([]);
    const result = await evaluateExpression(mockInput);

    expect(result).toEqual({ empty: true });
  });

  it("should format valid data correctly with BU and AC entries", async () => {
    const entries = [createBudgetEntry(), createEntry()];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.empty).toBeUndefined();
    expect(result.period).toBe("YTD");
    expect(result.legend).toBeDefined();
    expect(Array.isArray(result.legend)).toBe(true);
    expect(result.legend.length).toBe(3);

    expect(result.datasets).toBeDefined();
    expect(Array.isArray(result.datasets)).toBe(true);
    expect(result.datasets.length).toBe(1);
    expect(Array.isArray(result.datasets[0].data)).toBe(true);
    expect(result.datasets[0].data.length).toBe(2);
    expect(result.datasets[0].data[0]).toBe(95.0);
    expect(result.datasets[0].data[1]).toBe(100.5);

    expect(result.labels).toBeDefined();
    expect(Array.isArray(result.labels)).toBe(true);
    expect(result.labels.length).toBe(2);
    expect(result.labels[0]).toBe("2025'BU");
    expect(result.labels[1]).toBe("2025");

    expect(result.formattedData).toBeDefined();
    expect(Array.isArray(result.formattedData)).toBe(true);
    expect(result.formattedData.length).toBe(1);
    expect(Array.isArray(result.formattedData[0])).toBe(true);
    expect(result.formattedData[0].length).toBe(2);

    expect(result.connector).toBeUndefined();

    expect(result.stripedIndexes).toBeDefined();
    expect(Array.isArray(result.stripedIndexes)).toBe(true);

    expect(result.comparisonLine).toBeDefined();
    expect(result.comparisonLine.data).toBeDefined();
    expect(Array.isArray(result.comparisonLine.data)).toBe(true);
  });

  it("should format large numbers correctly", async () => {
    const entries = [
      createEntry({ ac: 1500000, period: "YTD'23" }),
      createEntry({ ac: 2500, period: "YTD'24" }),
      createEntry({ ac: 55.2, period: "YTD'25" }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.formattedData[0][0]).toBe("1.5M");
    expect(result.formattedData[0][1]).toBe("2.5k");
    expect(result.formattedData[0][2]).toBe("55.2");
  });

  it("should format negative numbers correctly", async () => {
    const entries = [
      createEntry({ ac: -1500000, period: "YTD'23" }),
      createEntry({ ac: -2500, period: "YTD'24" }),
      createEntry({ ac: -55.2, period: "YTD'25" }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.formattedData[0][0]).toBe("-1.5M");
    expect(result.formattedData[0][1]).toBe("-2.5k");
    expect(result.formattedData[0][2]).toBe("-55.2");
  });

  it("should include vs LY comparison for all bars including BU", async () => {
    const entries = [
      createBudgetEntry({ ac_vs_ly: 2.1 }),
      createEntry({ ac_vs_ly: 5.2 }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    const vsLy = result.comparisonLine.data.find(
      (c: { title: string }) => c.title === "vs LY",
    );
    expect(vsLy).toBeDefined();
    expect(vsLy.data.length).toBe(2);
    expect(vsLy.data[0].value).toBe("2.1");
    expect(vsLy.data[0].color).toBe("#007800");
    expect(vsLy.data[1].value).toBe("5.2");
    expect(vsLy.data[1].color).toBe("#007800");
  });

  it("should include vs BU comparison row", async () => {
    const entries = [
      createBudgetEntry({ ac_vs_bu: null }),
      createEntry({ ac_vs_bu: -1.5 }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    const vsBu = result.comparisonLine.data.find(
      (c: { title: string }) => c.title === "vs BU",
    );
    expect(vsBu).toBeDefined();
    expect(vsBu.data.length).toBe(2);
    expect(vsBu.data[0].value).toBe("-");
    expect(vsBu.data[1].value).toBe("-1.5");
    expect(vsBu.data[1].color).toBe("#B91C1C");
  });

  it("should show positive vs BU with up color", async () => {
    const entries = [createBudgetEntry(), createEntry({ ac_vs_bu: 4.3 })];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    const vsBu = result.comparisonLine.data.find(
      (c: { title: string }) => c.title === "vs BU",
    );
    expect(vsBu.data[1].value).toBe("4.3");
    expect(vsBu.data[1].color).toBe("#007800");
  });

  it("should format period labels as full year", async () => {
    const entries = [
      createEntry({ period: "YTD'22", ac: 80 }),
      createEntry({ period: "YTD'23", ac: 90 }),
      createBudgetEntry({ period: "BU'24" }),
      createEntry({ period: "YTD'24", ac: 100 }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.labels.length).toBe(4);
    expect(result.labels[0]).toBe("2022");
    expect(result.labels[1]).toBe("2023");
    expect(result.labels[2]).toBe("2024'BU");
    expect(result.labels[3]).toBe("2024");
  });

  it("should maintain data order as received from SQL", async () => {
    const entries = [
      createEntry({ ac: 80, period: "YTD'23" }),
      createEntry({ ac: 90, period: "YTD'24" }),
      createBudgetEntry({ ac: 95, period: "BU'25" }),
      createEntry({ ac: 100, period: "YTD'25" }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.datasets[0].data.length).toBe(4);
    expect(result.datasets[0].data[0]).toBe(80);
    expect(result.datasets[0].data[1]).toBe(90);
    expect(result.datasets[0].data[2]).toBe(95);
    expect(result.datasets[0].data[3]).toBe(100);
  });

  it("should apply striped index to BU bar (second-to-last)", async () => {
    const entries = [
      createEntry({ period: "YTD'23", ac: 80 }),
      createEntry({ period: "YTD'24", ac: 90 }),
      createBudgetEntry({ period: "BU'25", ac: 95 }),
      createEntry({ period: "YTD'25", ac: 100 }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.stripedIndexes).toEqual([2]);
  });

  it("should apply dark color only to last bar (current year)", async () => {
    const entries = [
      createEntry({ period: "YTD'23", ac: 80 }),
      createBudgetEntry({ period: "BU'25", ac: 95 }),
      createEntry({ period: "YTD'25", ac: 100 }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.datasets[0].backgroundColor.length).toBe(3);
    expect(result.datasets[0].backgroundColor[0]).toBe("#eddab1");
    expect(result.datasets[0].backgroundColor[1]).toBe("#eddab1");
    expect(result.datasets[0].backgroundColor[2]).toBe("#d1a33c");
  });

  it("should not include connector in output", async () => {
    const entries = [createBudgetEntry(), createEntry()];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.connector).toBeUndefined();
  });

  it("should include all required output fields", async () => {
    const entries = [createBudgetEntry(), createEntry()];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result).toHaveProperty("period");
    expect(result).toHaveProperty("legend");
    expect(result).toHaveProperty("datasets");
    expect(result).toHaveProperty("labels");
    expect(result).toHaveProperty("formattedData");
    expect(result).toHaveProperty("stripedIndexes");
    expect(result).toHaveProperty("comparisonLine");
    expect(result).not.toHaveProperty("connector");
  });

  it("should derive period from non-BU entry", async () => {
    const entries = [
      createEntry({ period: "MTD'25", ac: 80, ac_vs_bu: null }),
      createBudgetEntry({ period: "BU'25" }),
      createEntry({ period: "MTD'25", ac: 100, ac_vs_bu: 2.0 }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.period).toBe("MTD");
  });

  it("should handle vs LY with negative direction", async () => {
    const entries = [createEntry({ ac_vs_ly: -3.5, period: "YTD'25" })];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    const vsLy = result.comparisonLine.data.find(
      (c: { title: string }) => c.title === "vs LY",
    );
    expect(vsLy.data[0].value).toBe("-3.5");
    expect(vsLy.data[0].color).toBe("#B91C1C");
  });

  it("should fallback period to YTD when all periods are BU", async () => {
    const entries = [
      createBudgetEntry({ period: "BU'24" }),
      createBudgetEntry({ period: "BU'25" }),
    ];

    const mockInput = createMockInput(entries);
    const result = await evaluateExpression(mockInput);

    expect(result.period).toBe("YTD");
  });
});

import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("composition waterfall formatter (cores)", () => {
  let compiledExpression: jsonata.Expression;

  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/performance-tool/drill-down/finance/cores/composition-waterfall.jsonata",
  );

  type DatasourceEntry = {
    step_name: string;
    ac: number;
    ac_vs_ly?: number;
    ac_vs_ly_direction?: string;
    variationDirectionVsLy?: string;
    per_hl?: number;
    ac_hl_direction?: string;
    variationDirectionPerHl?: string;
    per_hl_vs_ly?: number;
    ac_hl_vs_ly_direction?: string;
    variationDirectionPerHlVsLy?: string;
    comp_unit_of_measure?: string;
  };

  const createEntry = (
    overrides: Partial<DatasourceEntry>,
  ): DatasourceEntry => ({
    step_name: "Total",
    ac: 1000,
    ac_vs_ly: 5.2,
    ac_vs_ly_direction: "up",
    variationDirectionVsLy: "up",
    per_hl: 2.5,
    ac_hl_direction: "up",
    variationDirectionPerHl: "up",
    per_hl_vs_ly: 1.8,
    ac_hl_vs_ly_direction: "up",
    variationDirectionPerHlVsLy: "up",
    comp_unit_of_measure: "%",
    ...overrides,
  });

  const createMockInput = (entries: DatasourceEntry[]) => ({
    datasources: {
      composition: entries,
    },
  });

  const evaluateExpression = async (
    input: ReturnType<typeof createMockInput>,
  ) => compiledExpression.evaluate(input);

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  describe("empty data scenarios", () => {
    it("should return empty object when datasource is empty", async () => {
      const mockInput = createMockInput([]);
      const result = await evaluateExpression(mockInput);

      expect(result.empty).toBe(true);
      expect(result.values).toBeUndefined();
      expect(result.labels).toBeUndefined();
    });

    it("should return empty object when datasource is undefined", async () => {
      const result = await compiledExpression.evaluate({
        datasources: {},
      });

      expect(result.empty).toBe(true);
    });

    it("should return empty object when all ac values are zero", async () => {
      const entries = [createEntry({ ac: 0 }), createEntry({ ac: 0 })];
      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      expect(result.empty).toBe(true);
    });
  });

  describe("basic functionality", () => {
    it("should return waterfall structure with valid data", async () => {
      const entries = [
        createEntry({
          step_name: "Total",
          ac: 1000,
          ac_vs_ly: 5.2,
          per_hl: 2.5,
          per_hl_vs_ly: 1.8,
        }),
        createEntry({
          step_name: "Brand A",
          ac: 500,
          ac_vs_ly: 3.1,
          per_hl: 1.2,
          per_hl_vs_ly: 0.8,
        }),
        createEntry({
          step_name: "Brand B",
          ac: 300,
          ac_vs_ly: -2.5,
          per_hl: 0.8,
          per_hl_vs_ly: -0.3,
        }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      expect(result.empty).toBeUndefined();
      expect(result.values).toBeDefined();
      expect(result.labels).toBeDefined();
      expect(result.formattedData).toBeDefined();
      expect(result.comparisonLine).toBeDefined();
    });

    it("should use step_name for all labels", async () => {
      const entries = [
        createEntry({ step_name: "Total", ac: 1000 }),
        createEntry({ step_name: "Brand A", ac: 500 }),
        createEntry({ step_name: "Brand B", ac: 300 }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      expect(Array.from(result.labels)).toEqual([
        "Total",
        "Brand A",
        "Brand B",
      ]);
    });

    it("should use ac values for all values", async () => {
      const entries = [
        createEntry({ step_name: "Total", ac: 1000 }),
        createEntry({ step_name: "Brand A", ac: 500 }),
        createEntry({ step_name: "Brand B", ac: 300 }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      expect(Array.from(result.values)).toEqual([1000, 500, 300]);
    });

    it("should handle missing step_name with empty string", async () => {
      const entries = [
        createEntry({ step_name: "Total", ac: 1000 }),
        createEntry({ step_name: "", ac: 500 }),
        createEntry({ step_name: "Brand B", ac: 300 }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      expect(Array.from(result.labels)).toEqual(["Total", "", "Brand B"]);
    });
  });

  describe("comparisonLine structure", () => {
    it("should return comparisonLine with three items: vs LY, /hl, /hl vs LY", async () => {
      const entries = [
        createEntry({
          step_name: "Total",
          ac: 1000,
          ac_vs_ly: 5.2,
          per_hl: 2.5,
          per_hl_vs_ly: 1.8,
        }),
        createEntry({
          step_name: "Brand A",
          ac: 500,
          ac_vs_ly: 3.1,
          per_hl: 1.2,
          per_hl_vs_ly: 0.8,
        }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      expect(result.comparisonLine).toBeDefined();
      expect(result.comparisonLine.data).toBeDefined();
      expect(Array.isArray(result.comparisonLine.data)).toBe(true);
      expect(result.comparisonLine.data.length).toBe(3);

      expect(result.comparisonLine.data[0].title).toBe("vs LY");
      expect(result.comparisonLine.data[1].title).toBe("/hl");
      expect(result.comparisonLine.data[2].title).toBe("/hl vs LY");
    });

    it("should format comparison values correctly", async () => {
      const entries = [
        createEntry({
          step_name: "Total",
          ac: 1000,
          ac_vs_ly: 5.5,
          per_hl: 2.5,
          per_hl_vs_ly: 1.8,
        }),
        createEntry({
          step_name: "Brand A",
          ac: 500,
          ac_vs_ly: -3.2,
          per_hl: 1.2,
          per_hl_vs_ly: -0.5,
        }),
        createEntry({
          step_name: "Brand B",
          ac: 300,
          ac_vs_ly: 0,
          per_hl: 0.8,
          per_hl_vs_ly: 0,
        }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      const comparisonData = result.comparisonLine.data;

      // vs LY
      expect(comparisonData[0].data[0].value).toBe("5.5");
      expect(comparisonData[0].data[1].value).toBe("-3.2");
      expect(comparisonData[0].data[2].value).toBe("0.0");

      // /hl
      expect(comparisonData[1].data[0].value).toBe("2.5");
      expect(comparisonData[1].data[1].value).toBe("1.2");
      expect(comparisonData[1].data[2].value).toBe("0.8");

      // /hl vs LY
      expect(comparisonData[2].data[0].value).toBe("1.8");
      expect(comparisonData[2].data[1].value).toBe("-0.5");
      expect(comparisonData[2].data[2].value).toBe("0.0");
    });

    it("should use default measure when comp_unit_of_measure is missing", async () => {
      const entries = [
        createEntry({
          step_name: "Total",
          ac: 1000,
          ac_vs_ly: 5.2,
          per_hl: 2.5,
          per_hl_vs_ly: 1.8,
          comp_unit_of_measure: undefined,
        }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      const comparisonData = result.comparisonLine.data;
      expect(comparisonData[0].data[0].measure).toBe("%");
      expect(comparisonData[1].data[0].measure).toBe("");
      expect(comparisonData[2].data[0].measure).toBe("%");
    });

    it("should use custom comp_unit_of_measure when provided", async () => {
      const entries = [
        createEntry({
          step_name: "Total",
          ac: 1000,
          ac_vs_ly: 5.2,
          per_hl: 2.5,
          per_hl_vs_ly: 1.8,
          comp_unit_of_measure: "pp",
        }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      const comparisonData = result.comparisonLine.data;
      expect(comparisonData[0].data[0].measure).toBe("pp");
      expect(comparisonData[1].data[0].measure).toBe("");
      expect(comparisonData[2].data[0].measure).toBe("pp");
    });

    it("should set trend correctly based on direction", async () => {
      const entries = [
        createEntry({
          step_name: "Total",
          ac: 1000,
          ac_vs_ly: 5.2,
          variationDirectionVsLy: "up",
          per_hl: 2.5,
          variationDirectionPerHl: "up",
          per_hl_vs_ly: 1.8,
          variationDirectionPerHlVsLy: "up",
        }),
        createEntry({
          step_name: "Brand A",
          ac: 500,
          ac_vs_ly: -3.2,
          variationDirectionVsLy: "down",
          per_hl: 1.2,
          variationDirectionPerHl: "down",
          per_hl_vs_ly: -0.5,
          variationDirectionPerHlVsLy: "down",
        }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      const comparisonData = result.comparisonLine.data;

      // vs LY trends
      expect(comparisonData[0].data[0].trend).toBe("positive");
      expect(comparisonData[0].data[1].trend).toBe("negative");

      // /hl trends
      expect(comparisonData[1].data[0].trend).toBe("");
      expect(comparisonData[1].data[1].trend).toBe("");

      // /hl vs LY trends
      expect(comparisonData[2].data[0].trend).toBe("positive");
      expect(comparisonData[2].data[1].trend).toBe("negative");
    });
  });

  describe("value formatting", () => {
    it("should format values with finance helper (compact K/M/B or #,##0.0)", async () => {
      const entries = [
        createEntry({
          step_name: "Total",
          ac: 1234.567,
        }),
        createEntry({
          step_name: "Brand A",
          ac: 987.654,
        }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      expect(result.formattedData).toEqual([["1.2K", "987.7"]]);
    });

    it("should format comparison values with comma separators", async () => {
      const entries = [
        createEntry({
          step_name: "Total",
          ac: 1000,
          ac_vs_ly: 1234.5,
          per_hl: 567.8,
          per_hl_vs_ly: 901.2,
        }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      const comparisonData = result.comparisonLine.data;
      expect(comparisonData[0].data[0].value).toBe("1,234.5");
      expect(comparisonData[1].data[0].value).toBe("567.8");
      expect(comparisonData[2].data[0].value).toBe("901.2");
    });

    it("should handle null/undefined values as dash", async () => {
      const entries = [
        createEntry({
          step_name: "Total",
          ac: 1000,
          ac_vs_ly: undefined as any,
          per_hl: undefined as any,
          per_hl_vs_ly: undefined as any,
        }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      const comparisonData = result.comparisonLine.data;
      expect(comparisonData[0].data[0].value).toBe("-");
      expect(comparisonData[1].data[0].value).toBe("-");
      expect(comparisonData[2].data[0].value).toBe("-");
    });
  });

  describe("edge cases", () => {
    it("should handle single entry", async () => {
      const entries = [
        createEntry({
          step_name: "Total",
          ac: 1000,
          ac_vs_ly: 5.2,
          per_hl: 2.5,
          per_hl_vs_ly: 1.8,
        }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      expect(Array.from(result.values)).toEqual([1000]);
      expect(Array.from(result.labels)).toEqual(["Total"]);
      expect(result.comparisonLine.data.length).toBe(3);
    });

    it("should handle non-numeric ac values as zero", async () => {
      const entries = [
        createEntry({
          step_name: "Total",
          ac: "invalid" as any,
        }),
        createEntry({
          step_name: "Brand A",
          ac: 500,
        }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      expect(Array.from(result.values)).toEqual([0, 500]);
    });

    it("should handle missing ac field", async () => {
      const entries = [
        {
          step_name: "Total",
        } as any,
        createEntry({
          step_name: "Brand A",
          ac: 500,
        }),
      ];

      const mockInput = createMockInput(entries);
      const result = await evaluateExpression(mockInput);

      expect(Array.from(result.values)).toEqual([0, 500]);
    });
  });
});

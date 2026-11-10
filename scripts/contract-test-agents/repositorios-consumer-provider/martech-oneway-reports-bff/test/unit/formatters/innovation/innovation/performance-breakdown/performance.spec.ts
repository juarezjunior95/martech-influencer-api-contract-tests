import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { waterfallDataSchema } from "../../../../../../src/infrastructure/schema/components/waterfall.schema";

describe("innovation performance formatter", () => {
  let ajv: Ajv;
  let compiledExpression: jsonata.Expression;

  const YOY_GROWTH_KEY =
    "innovation_innovation_performance-breakdown_yoy-growth";
  const YOY_CONTRIBUTION_KEY =
    "innovation_innovation_performance-breakdown_yoy-growth-contribution";
  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/innovation/innovation/performance-breakdown/performance.jsonata",
  );

  type ChartDataEntry = {
    kpi_name: string;
    dt_ini: string;
    dt_end: string;
    country: string;
    label: string;
    value: number;
    unit_of_measure: string;
  };

  type ComparisonDataEntry = {
    kpi_name: string;
    dt_ini: string;
    dt_end: string;
    country: string;
    label: string;
    contribution: number | null;
    variationDirectionContribution: string;
  };

  // Helper function to create a chart data entry
  const createChartEntry = (
    overrides: Partial<ChartDataEntry>,
  ): ChartDataEntry => ({
    kpi_name: "innovation_volume",
    dt_ini: "2023-01-01T00:00:00.000Z",
    dt_end: "2023-12-01T00:00:00.000Z",
    country: "BRA",
    label: "FY_YEAR-2",
    value: 1000,
    unit_of_measure: "%",
    ...overrides,
  });

  // Helper function to create a comparison data entry
  const createComparisonEntry = (
    overrides: Partial<ComparisonDataEntry>,
  ): ComparisonDataEntry => ({
    kpi_name: "innovation_volume",
    dt_ini: "2025-01-01T00:00:00.000Z",
    dt_end: "2025-09-01T00:00:00.000Z",
    country: "BRA",
    label: "LAUNCHES",
    contribution: 3.2,
    variationDirectionContribution: "up",
    ...overrides,
  });

  // Helper function to create mock input
  const createMockInput = (
    chartData: ChartDataEntry[],
    comparisonData: ComparisonDataEntry[],
  ) => ({
    datasources: {
      [YOY_GROWTH_KEY]: chartData,
      [YOY_CONTRIBUTION_KEY]: comparisonData,
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

  describe("Optimal outcome scenario", () => {
    it("should return complete waterfall data when everything goes right", async () => {
      const chartData = [
        createChartEntry({
          label: "FY_YEAR-2",
          dt_end: "2023-12-01T00:00:00.000Z",
          value: 18723.5,
        }),
        createChartEntry({
          label: "FY_YEAR-1",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 14256.8,
        }),
        createChartEntry({
          label: "EXPIRATION",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 5234.1,
        }),
        createChartEntry({
          label: "BASELINE",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 9876.2,
        }),
        createChartEntry({
          label: "LAUNCHES",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 456.7,
        }),
        createChartEntry({
          label: "Y1-Y2",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 1456.9,
        }),
        createChartEntry({
          label: "Y2-Y3",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 234.5,
        }),
        createChartEntry({
          label: "Y3-Y4",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 312.4,
        }),
        createChartEntry({
          label: "Y4-Y5",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: -4234.8,
        }),
        createChartEntry({
          label: "LE_YEAR",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 15234.1,
        }),
      ];

      const comparisonData = [
        createComparisonEntry({
          label: "LAUNCHES",
          contribution: 3.2,
          variationDirectionContribution: "up",
        }),
        createComparisonEntry({
          label: "Y1-Y2",
          contribution: 14.5,
          variationDirectionContribution: "up",
        }),
        createComparisonEntry({
          label: "Y2-Y3",
          contribution: 13.7,
          variationDirectionContribution: "up",
        }),
        createComparisonEntry({
          label: "Y3-Y4",
          contribution: 32.4,
          variationDirectionContribution: "up",
        }),
        createComparisonEntry({
          label: "Y4-Y5",
          contribution: 51.8,
          variationDirectionContribution: "up",
        }),
      ];

      const mockInput = createMockInput(chartData, comparisonData);
      const result = await evaluateExpression(mockInput);

      // Should not be empty
      expect(result.empty).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(result.labels).toBeDefined();
      expect(result.comparisonLineData).toBeDefined();
      expect(result.connector).toBeDefined();
      expect(result.specialIndexes).toBeDefined();
      expect(result.clickableIndexes).toBeDefined();

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

      // Validate data array
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBe(10);
      expect(result.data[0]).toBe(18723.5);
      expect(result.data[9]).toBe(15234.1);

      // Validate labels array
      expect(Array.isArray(result.labels)).toBe(true);
      expect(result.labels.length).toBe(10);
      expect(result.labels[0]).toBe("Vol. 23'FY");
      expect(result.labels[1]).toBe("Vol. 24'FY");
      expect(result.labels[2]).toBe("Expiration");
      expect(result.labels[3]).toBe("Baseline 24'");
      expect(result.labels[4]).toBe("Launches");
      expect(result.labels[5]).toBe("Y1-Y2");
      expect(result.labels[6]).toBe("Y2-Y3");
      expect(result.labels[7]).toBe("Y3-Y4");
      expect(result.labels[8]).toBe("Y4-Y5");
      expect(result.labels[9]).toBe("Vol. 25'LE");

      // Validate specialIndexes
      expect(result.specialIndexes.first).toBe(1); // FY_YEAR-1
      expect(result.specialIndexes.last).toBe(9);
      expect(result.specialIndexes.retained).toBe(3); // BASELINE

      // Validate clickableIndexes
      expect(Array.isArray(result.clickableIndexes)).toBe(true);
      expect(result.clickableIndexes).toEqual([
        { index: 4, value: "y1" },
        { index: 5, value: "y2" },
        { index: 6, value: "y3" },
        { index: 7, value: "y4" },
        { index: 8, value: "y5" },
      ]);

      // Validate comparison line data
      expect(Array.isArray(result.comparisonLineData)).toBe(true);
      expect(result.comparisonLineData.length).toBe(1);
      expect(result.comparisonLineData[0].title).toBe("Vol. Contrib.");
      expect(result.comparisonLineData[0].data.length).toBe(10);

      // Validate connector (delta = LE_YEAR - FY_YEAR-1)
      expect(result.connector.value).toBeCloseTo(977.3);
      expect(result.connector.from).toBe("Vol. 24'FY");
      expect(result.connector.to).toBe("Vol. 25'LE");
      expect(result.connector.measure).toBe("%");
    });
  });

  describe("KPI name prefix labels", () => {
    it("should use correct labels for innovation_volume", async () => {
      const chartData = [
        createChartEntry({
          kpi_name: "innovation_volume",
          label: "FY_YEAR-2",
          dt_end: "2023-12-01T00:00:00.000Z",
          value: 1000,
        }),
        createChartEntry({
          kpi_name: "innovation_volume",
          label: "FY_YEAR-1",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 2000,
        }),
        createChartEntry({
          kpi_name: "innovation_volume",
          label: "EXPIRATION",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 500,
        }),
        createChartEntry({
          kpi_name: "innovation_volume",
          label: "BASELINE",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1500,
        }),
        createChartEntry({
          kpi_name: "innovation_volume",
          label: "LAUNCHES",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 500,
        }),
        createChartEntry({
          kpi_name: "innovation_volume",
          label: "LE_YEAR",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 3000,
        }),
      ];

      const comparisonData = [
        createComparisonEntry({
          label: "LAUNCHES",
          contribution: 3,
          variationDirectionContribution: "up",
        }),
        createComparisonEntry({
          label: "LE_YEAR",
          contribution: 5,
          variationDirectionContribution: "up",
        }),
      ];

      const mockInput = createMockInput(chartData, comparisonData);
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

      expect(result.labels[0]).toBe("Vol. 23'FY");
      expect(result.labels[1]).toBe("Vol. 24'FY");
      expect(result.labels[2]).toBe("Expiration");
      expect(result.labels[3]).toBe("Baseline 24'");
      expect(result.labels[4]).toBe("Launches");
      expect(result.labels[5]).toBe("Vol. 25'LE");
      expect(result.comparisonLineData[0].title).toBe("Vol. Contrib.");
    });

    it("should use correct labels for innovation_nr", async () => {
      const chartData = [
        createChartEntry({
          kpi_name: "innovation_nr",
          label: "FY_YEAR-2",
          dt_end: "2023-12-01T00:00:00.000Z",
          value: 1000,
        }),
        createChartEntry({
          kpi_name: "innovation_nr",
          label: "FY_YEAR-1",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 2000,
        }),
        createChartEntry({
          kpi_name: "innovation_nr",
          label: "EXPIRATION",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 500,
        }),
        createChartEntry({
          kpi_name: "innovation_nr",
          label: "BASELINE",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1500,
        }),
        createChartEntry({
          kpi_name: "innovation_nr",
          label: "LAUNCHES",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 500,
        }),
        createChartEntry({
          kpi_name: "innovation_nr",
          label: "LE_YEAR",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 3000,
        }),
      ];

      const comparisonData = [
        createComparisonEntry({
          label: "LAUNCHES",
          contribution: 3,
          variationDirectionContribution: "up",
        }),
        createComparisonEntry({
          label: "LE_YEAR",
          contribution: 5,
          variationDirectionContribution: "up",
        }),
      ];

      const mockInput = createMockInput(chartData, comparisonData);
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

      expect(result.labels[0]).toBe("Net Rev. 23'FY");
      expect(result.labels[1]).toBe("Net Rev. 24'FY");
      expect(result.labels[2]).toBe("Expiration");
      expect(result.labels[3]).toBe("Baseline 24'");
      expect(result.labels[4]).toBe("Launches");
      expect(result.labels[5]).toBe("Net Rev. 25'LE");
      expect(result.comparisonLineData[0].title).toBe("Net Rev. Contrib.");
    });

    it("should use correct labels for innovation_maco", async () => {
      const chartData = [
        createChartEntry({
          kpi_name: "innovation_maco",
          label: "FY_YEAR-2",
          dt_end: "2023-12-01T00:00:00.000Z",
          value: 1000,
        }),
        createChartEntry({
          kpi_name: "innovation_maco",
          label: "FY_YEAR-1",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 2000,
        }),
        createChartEntry({
          kpi_name: "innovation_maco",
          label: "EXPIRATION",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 500,
        }),
        createChartEntry({
          kpi_name: "innovation_maco",
          label: "BASELINE",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1500,
        }),
        createChartEntry({
          kpi_name: "innovation_maco",
          label: "LAUNCHES",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 500,
        }),
        createChartEntry({
          kpi_name: "innovation_maco",
          label: "LE_YEAR",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 3000,
        }),
      ];

      const comparisonData = [
        createComparisonEntry({
          label: "LAUNCHES",
          contribution: 3,
          variationDirectionContribution: "up",
        }),
        createComparisonEntry({
          label: "LE_YEAR",
          contribution: 5,
          variationDirectionContribution: "up",
        }),
      ];

      const mockInput = createMockInput(chartData, comparisonData);
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

      expect(result.labels[0]).toBe("MACO 23'FY");
      expect(result.labels[1]).toBe("MACO 24'FY");
      expect(result.labels[2]).toBe("Expiration");
      expect(result.labels[3]).toBe("Baseline 24'");
      expect(result.labels[4]).toBe("Launches");
      expect(result.labels[5]).toBe("MACO 25'LE");
      expect(result.comparisonLineData[0].title).toBe("MACO Contrib.");
    });
  });

  describe("Connector colors", () => {
    it("should use correct colors for connector when direction is up", async () => {
      const chartData = [
        createChartEntry({
          label: "FY_YEAR-1",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1000,
        }),
        createChartEntry({
          label: "BASELINE",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1500,
        }),
        createChartEntry({
          label: "LAUNCHES",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 500,
        }),
        createChartEntry({
          label: "LE_YEAR",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 2000,
        }),
      ];

      const comparisonData = [
        createComparisonEntry({
          label: "LAUNCHES",
          contribution: 10,
          variationDirectionContribution: "up",
        }),
        createComparisonEntry({
          label: "LE_YEAR",
          contribution: 10,
          variationDirectionContribution: "up",
        }),
      ];

      const mockInput = createMockInput(chartData, comparisonData);
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

      expect(result.connector.backgroundColor).toBe("#E6F9E6"); // up bg color
      expect(result.connector.textColor).toBe("#007800"); // up text color
    });

    it("should use correct colors for connector when direction is down", async () => {
      const chartData = [
        createChartEntry({
          label: "FY_YEAR-1",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 2000,
        }),
        createChartEntry({
          label: "BASELINE",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1500,
        }),
        createChartEntry({
          label: "LAUNCHES",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 500,
        }),
        createChartEntry({
          label: "LE_YEAR",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 1000,
        }),
      ];

      const comparisonData = [
        createComparisonEntry({
          label: "LAUNCHES",
          contribution: -5,
          variationDirectionContribution: "down",
        }),
        createComparisonEntry({
          label: "LE_YEAR",
          contribution: -5,
          variationDirectionContribution: "down",
        }),
      ];

      const mockInput = createMockInput(chartData, comparisonData);
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

      expect(result.connector.backgroundColor).toBe("#FFE6E6"); // down bg color
      expect(result.connector.textColor).toBe("#BA0B0B"); // down text color
    });
  });

  describe("Empty return", () => {
    it("should return empty object when chart data is empty", async () => {
      const chartData: ChartDataEntry[] = [];
      const comparisonData: ComparisonDataEntry[] = [];

      const mockInput = createMockInput(chartData, comparisonData);
      const result = await evaluateExpression(mockInput);

      expect(result).toEqual({ empty: true });
    });

    it("should handle missing contribution datasource", async () => {
      const chartData = [
        createChartEntry({
          label: "FY_YEAR-1",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1000,
        }),
        createChartEntry({
          label: "LE_YEAR",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 2000,
        }),
      ];

      const result = await compiledExpression.evaluate({
        datasources: {
          [YOY_GROWTH_KEY]: chartData,
        },
      });

      expect(result.comparisonLineData[0].data).toHaveLength(2);
      expect(
        result.comparisonLineData[0].data.every((item) => item.value === ""),
      ).toBe(true);
      expect(result.connector.value).toBe(1000);
    });
  });

  describe("Comparison line number formatting", () => {
    it("should format numbers correctly in comparison line", async () => {
      const chartData = [
        createChartEntry({
          label: "FY_YEAR-1",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1000,
        }),
        createChartEntry({
          label: "BASELINE",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1500,
        }),
        createChartEntry({
          label: "LAUNCHES",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 200,
        }),
        createChartEntry({
          label: "Y1-Y2",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 300,
        }),
        createChartEntry({
          label: "LE_YEAR",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 1500,
        }),
      ];

      const comparisonData = [
        createComparisonEntry({
          label: "LAUNCHES",
          contribution: 3.2,
          variationDirectionContribution: "up",
        }),
        createComparisonEntry({
          label: "Y1-Y2",
          contribution: 14.567,
          variationDirectionContribution: "up",
        }),
      ];

      const mockInput = createMockInput(chartData, comparisonData);
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

      const comparisonLine = result.comparisonLineData[0];

      // First entry (FY_YEAR-1) should be empty
      expect(comparisonLine.data[0].value).toBe("");
      expect(comparisonLine.data[0].measure).toBe("");
      expect(comparisonLine.data[0].color).toBe("");

      // Second entry (BASELINE) should be empty
      expect(comparisonLine.data[1].value).toBe("");
      expect(comparisonLine.data[1].measure).toBe("");
      expect(comparisonLine.data[1].color).toBe("");

      // Third entry (LAUNCHES) should have formatted number
      expect(comparisonLine.data[2].value).toBe("3.2");
      expect(comparisonLine.data[2].measure).toBe("%");
      expect(comparisonLine.data[2].color).toBe("#007800"); // up direction

      // Fourth entry (Y1-Y2) should have formatted number with one decimal
      expect(comparisonLine.data[3].value).toBe("14.6"); // rounded to one decimal
      expect(comparisonLine.data[3].measure).toBe("%");
      expect(comparisonLine.data[3].color).toBe("#007800");

      // Last entry (LE_YEAR) should have value
      expect(comparisonLine.data[4].value).toBe("");
      expect(comparisonLine.data[4].measure).toBe("");
      expect(comparisonLine.data[4].color).toBe("");
    });

    it("should format negative numbers correctly in comparison line", async () => {
      const chartData = [
        createChartEntry({
          label: "FY_YEAR-1",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1000,
        }),
        createChartEntry({
          label: "LAUNCHES",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 200,
        }),
        createChartEntry({
          label: "LE_YEAR",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 1500,
        }),
      ];

      const comparisonData = [
        createComparisonEntry({
          label: "LAUNCHES",
          contribution: -5.7,
          variationDirectionContribution: "down",
        }),
        createComparisonEntry({
          label: "LE_YEAR",
          contribution: 5,
          variationDirectionContribution: "up",
        }),
      ];

      const mockInput = createMockInput(chartData, comparisonData);
      const result = await evaluateExpression(mockInput);

      const comparisonLine = result.comparisonLineData[0];

      expect(comparisonLine.data[1].value).toBe("-5.7");
      expect(comparisonLine.data[1].measure).toBe("%");
      expect(comparisonLine.data[1].color).toBe("#B91C1C"); // down direction
    });

    it("should return '-' when contribution is null", async () => {
      const chartData = [
        createChartEntry({
          label: "FY_YEAR-1",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1000,
        }),
        createChartEntry({
          label: "BASELINE",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1500,
        }),
        createChartEntry({
          label: "LAUNCHES",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 200,
        }),
        createChartEntry({
          label: "LE_YEAR",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 1500,
        }),
      ];

      const comparisonData = [
        createComparisonEntry({
          label: "LAUNCHES",
          contribution: null,
          variationDirectionContribution: "up",
        }),
        createComparisonEntry({
          label: "LE_YEAR",
          contribution: 5,
          variationDirectionContribution: "up",
        }),
      ];

      const mockInput = createMockInput(chartData, comparisonData);
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

      const comparisonLine = result.comparisonLineData[0];

      expect(comparisonLine.data[2].value).toBe("-");
      expect(comparisonLine.data[2].measure).toBe("");
      expect(comparisonLine.data[2].color).toBe("#5C5C5C"); // gray color for null
    });

    it("should return '-' when comparison data entry is missing for a label", async () => {
      const chartData = [
        createChartEntry({
          label: "FY_YEAR-1",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1000,
        }),
        createChartEntry({
          label: "BASELINE",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1500,
        }),
        createChartEntry({
          label: "LAUNCHES",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 200,
        }),
        createChartEntry({
          label: "Y1-Y2",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 300,
        }),
        createChartEntry({
          label: "LE_YEAR",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 1500,
        }),
      ];

      // Only provide comparison data for LAUNCHES, not for Y1-Y2
      const comparisonData = [
        createComparisonEntry({
          label: "LAUNCHES",
          contribution: 3.2,
          variationDirectionContribution: "up",
        }),
        createComparisonEntry({
          label: "LE_YEAR",
          contribution: 5,
          variationDirectionContribution: "up",
        }),
      ];

      const mockInput = createMockInput(chartData, comparisonData);
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

      const comparisonLine = result.comparisonLineData[0];

      // LAUNCHES should have value
      expect(comparisonLine.data[2].value).toBe("3.2");
      expect(comparisonLine.data[2].measure).toBe("%");
      expect(comparisonLine.data[2].color).toBe("#007800");

      // Y1-Y2 should be empty (missing comparison data)
      expect(comparisonLine.data[3].value).toBe("");
      expect(comparisonLine.data[3].measure).toBe("");
      expect(comparisonLine.data[3].color).toBe("");
    });

    it("should handle zero values correctly", async () => {
      const chartData = [
        createChartEntry({
          label: "FY_YEAR-1",
          dt_end: "2024-12-01T00:00:00.000Z",
          value: 1000,
        }),
        createChartEntry({
          label: "LAUNCHES",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 200,
        }),
        createChartEntry({
          label: "LE_YEAR",
          dt_end: "2025-09-01T00:00:00.000Z",
          value: 1500,
        }),
      ];

      const comparisonData = [
        createComparisonEntry({
          label: "LAUNCHES",
          contribution: 0,
          variationDirectionContribution: "up",
        }),
        createComparisonEntry({
          label: "LE_YEAR",
          contribution: 5,
          variationDirectionContribution: "up",
        }),
      ];

      const mockInput = createMockInput(chartData, comparisonData);
      const result = await evaluateExpression(mockInput);

      const comparisonLine = result.comparisonLineData[0];

      expect(comparisonLine.data[1].value).toBe("0.0");
      expect(comparisonLine.data[1].measure).toBe("%");
      expect(comparisonLine.data[1].color).toBe("#007800");
    });
  });
});

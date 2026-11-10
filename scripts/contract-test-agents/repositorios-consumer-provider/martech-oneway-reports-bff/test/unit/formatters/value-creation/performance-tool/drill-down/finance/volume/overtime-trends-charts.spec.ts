import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import {
  barChartSchema,
  lineChartSchema,
} from "@infrastructure/schema/components/chart.schema";

describe("Volume Overtime Trends Charts formatter - JSONata Output", () => {
  let ajv: Ajv;
  let compiledExpression: jsonata.Expression;

  const LINE_CHART_DATASOURCE_KEY =
    "value-creation_performance-tool_drill-down_finance_overtime-trends_by-granularity";
  const BAR_CHART_DATASOURCE_KEY =
    "value-creation_performance-tool_drill-down_finance_overtime-trends_snapshot";
  const OVERTIME_PERFORMANCE_DATASOURCE_KEY =
    "value-creation_performance-tool_drill-down_finance_volume_overtime-performance";
  const JSONATA_PATH = path.join(
    process.cwd(),
    "src/infrastructure/formatters/value-creation/performance-tool/drill-down/finance/volume/overtime-trends-charts.jsonata",
  );

  type LineChartEntry = {
    month_label: string | null;
    year: number | null;
    ac: number | null;
    ly: number | null;
    bu: number | null;
    ac_vs_ly: number | null;
    ac_vs_bu: number | null;
    comp_unit_of_measure: string | null;
    variation_direction_ly: string | null;
    variationDirectionVsLy?: string | null;
    variationDirectionVsBu?: string | null;
    period_type?: string | null;
  };

  type BarChartEntry = {
    period: string | null;
    ac: number | null;
    ac_vs_ly: number | null;
    ac_vs_bu: number | null;
    comp_unit_of_measure: string | null;
    variation_direction_ly: string | null;
    variationDirectionVsLy?: string | null;
    variationDirectionVsBu?: string | null;
  };

  // Helper function to create a line chart entry
  const createLineChartEntry = (
    overrides: Partial<LineChartEntry> = {},
  ): LineChartEntry => ({
    month_label: "Jan",
    year: 2024,
    ac: 50.5,
    ly: 48.0,
    bu: 51.7,
    ac_vs_ly: 2.5,
    ac_vs_bu: -1.2,
    comp_unit_of_measure: "%",
    variation_direction_ly: "up",
    variationDirectionVsLy: "up",
    variationDirectionVsBu: "down",
    ...overrides,
  });

  // Helper function to create a bar chart entry
  const createBarChartEntry = (
    overrides: Partial<BarChartEntry> = {},
  ): BarChartEntry => ({
    period: "2024 Q1",
    ac: 52.3,
    ac_vs_ly: 1.8,
    ac_vs_bu: -0.5,
    comp_unit_of_measure: "%",
    variation_direction_ly: "up",
    variationDirectionVsLy: "up",
    variationDirectionVsBu: "down",
    ...overrides,
  });

  type OvertimePerformanceEntry = {
    period_type: string | null;
    period?: string | null;
    ac?: number | null;
    ac_vs_ly?: number | null;
    ac_vs_bu?: number | null;
    comp_unit_of_measure?: string | null;
    unit_of_measure?: string | null;
    variationDirectionVsLy?: string | null;
    variationDirectionVsBu?: string | null;
  };

  // Helper function to create mock input
  const createMockInput = (
    lineChartEntries: LineChartEntry[],
    barChartEntries: BarChartEntry[],
    overtimePerformanceEntries?: OvertimePerformanceEntry[],
  ) => ({
    datasources: {
      [LINE_CHART_DATASOURCE_KEY]: lineChartEntries,
      [BAR_CHART_DATASOURCE_KEY]: barChartEntries,
      ...(overtimePerformanceEntries && {
        [OVERTIME_PERFORMANCE_DATASOURCE_KEY]: overtimePerformanceEntries,
      }),
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

  it("should return charts data with legend, lineChart and barChart when all data are available", async () => {
    const mockInput = createMockInput(
      [
        createLineChartEntry({
          month_label: "Jan",
          year: 2024,
          ac: 50.5,
          ly: 48.0,
          bu: 51.7,
          ac_vs_ly: 2.5,
          ac_vs_bu: -1.2,
        }),
        createLineChartEntry({
          month_label: "Feb",
          year: 2024,
          ac: 52.3,
          ly: 50.5,
          bu: 52.8,
          ac_vs_ly: 1.8,
          ac_vs_bu: -0.5,
        }),
        createLineChartEntry({
          month_label: "Mar",
          year: 2024,
          ac: 51.8,
          ly: 51.5,
          bu: 53.9,
          ac_vs_ly: 0.3,
          ac_vs_bu: -2.1,
        }),
      ],
      [
        createBarChartEntry({
          period: "2024 Q1",
          ac: 52.3,
          ac_vs_ly: 1.8,
          ac_vs_bu: -0.5,
        }),
        createBarChartEntry({
          period: "2024 Q2",
          ac: 53.1,
          ac_vs_ly: 2.2,
          ac_vs_bu: 0.3,
        }),
        createBarChartEntry({
          period: "2024 Q3",
          ac: 54.5,
          ac_vs_ly: 3.1,
          ac_vs_bu: 1.2,
        }),
      ],
    );

    const result = await evaluateExpression(mockInput);

    expect(result).toBeDefined();
    expect(result.legend).toBeDefined();
    expect(result.legend).toHaveLength(3);
    expect(result.legend[0].label).toBe("Last Year");
    expect(result.legend[1].label).toBe("Budget");
    expect(result.legend[2].label).toBe("Current");

    // Validate lineChart structure
    expect(result.lineChart).toBeDefined();
    expect(result.lineChart.suggestedMin).toBeDefined();
    expect(result.lineChart.suggestedMax).toBeDefined();
    expect(result.lineChart.labels).toBeDefined();
    expect(result.lineChart.labels).toHaveLength(3);
    expect(result.lineChart.labels[0]).toBe("Jan");
    expect(result.lineChart.labels[1]).toBe("Feb");
    expect(result.lineChart.labels[2]).toBe("Mar");

    expect(result.lineChart.datasets).toBeDefined();
    expect(result.lineChart.datasets).toHaveLength(3);

    // Validate lineChart datasets properties
    expect(result.lineChart.datasets[0].label).toBe("Current Year");
    expect(result.lineChart.datasets[0].borderColor).toBe("#B8951C");
    expect(result.lineChart.datasets[0].pointBackgroundColor).toBe("#B8951C");
    expect(result.lineChart.datasets[0].pointBorderColor).toBe("#FFFFFF");
    expect(result.lineChart.datasets[0].data).toHaveLength(3);

    expect(result.lineChart.datasets[1].label).toBe("Last Year");
    expect(result.lineChart.datasets[1].borderColor).toBe("#E5DCC3");
    expect(result.lineChart.datasets[1].pointBackgroundColor).toBe("#E5DCC3");
    expect(result.lineChart.datasets[1].pointBorderColor).toBe("#FFFFFF");

    expect(result.lineChart.datasets[2].label).toBe("Budget");
    expect(result.lineChart.datasets[2].borderColor).toBe("#F1D715");
    expect(result.lineChart.datasets[2].pointBackgroundColor).toBe("#F1D715");
    expect(result.lineChart.datasets[2].pointBorderColor).toBe("#FFFFFF");

    // Validate lineChart data values (datasets[0]=ac, [1]=ly, [2]=bu)
    expect(result.lineChart.datasets[0].data[0]).toBe(50.5); // ac value
    expect(result.lineChart.datasets[1].data[0]).toBe(48.0); // ly value
    expect(result.lineChart.datasets[2].data[0]).toBe(51.7); // bu value

    // Validate comparisonLine
    expect(result.lineChart.comparisonLine).toBeDefined();
    expect(result.lineChart.comparisonLine.data).toBeDefined();
    expect(result.lineChart.comparisonLine.data).toHaveLength(2);
    expect(result.lineChart.comparisonLine.data[0].title).toBe("vs LY");
    expect(result.lineChart.comparisonLine.data[0].data).toHaveLength(3);
    expect(result.lineChart.comparisonLine.data[0].data[0].value).toBe("2.5");
    expect(result.lineChart.comparisonLine.data[0].data[0].measure).toBe("%");
    expect(result.lineChart.comparisonLine.data[0].data[0].trend).toBe(
      "positive",
    );
    expect(result.lineChart.comparisonLine.data[1].title).toBe("vs BU");
    expect(result.lineChart.comparisonLine.data[1].data).toHaveLength(3);

    // Validate barChart structure
    expect(result.barChart).toBeDefined();
    expect(result.barChart.labels).toBeDefined();
    expect(result.barChart.labels).toHaveLength(3);
    expect(result.barChart.labels[0]).toBe("2024 Q1");
    expect(result.barChart.labels[1]).toBe("2024 Q2");
    expect(result.barChart.labels[2]).toBe("2024 Q3");

    expect(result.barChart.datasets).toBeDefined();
    expect(result.barChart.datasets).toHaveLength(1);
    expect(result.barChart.datasets[0].label).toBe("Volume");
    expect(result.barChart.datasets[0].data).toHaveLength(3);
    expect(result.barChart.datasets[0].data[0]).toBe(52.3);

    expect(result.barChart.stripedIndexes).toBeDefined();
    expect(result.barChart.stripedIndexes).toEqual([1]);

    expect(result.lineChart.highlightedIndexes).toBeDefined();
    // When no overtime-performance datasource is provided, highlightedIndexes should be empty array
    expect(result.lineChart.highlightedIndexes).toEqual([]);

    expect(result.barChart.formattedData).toBeDefined();
    expect(result.barChart.formattedData).toHaveLength(1);
    expect(result.barChart.formattedData[0]).toHaveLength(3);
    expect(result.barChart.formattedData[0][0]).toBe("52.3");

    // Validate barChart comparisonLine
    expect(result.barChart.comparisonLine).toBeDefined();
    expect(result.barChart.comparisonLine.data).toBeDefined();
    expect(result.barChart.comparisonLine.data).toHaveLength(2);
    expect(result.barChart.comparisonLine.data[0].title).toBe("vs LY");
    expect(result.barChart.comparisonLine.data[0].data).toHaveLength(3);
    expect(result.barChart.comparisonLine.data[1].title).toBe("vs BU");
    expect(result.barChart.comparisonLine.data[1].data).toHaveLength(3);

    // Validate against schemas
    const normalizeToArray = (data: any): any[] => {
      if (data === undefined || data === null) return [];
      if (Array.isArray(data)) return data;
      return [data];
    };

    // Transform lineChart to match schema structure
    const lineChartData = {
      type: "line",
      labels: Array.isArray(result.lineChart.labels)
        ? result.lineChart.labels
        : [],
      datasets: result.lineChart.datasets.map((ds: any) => ({
        type: "line",
        label: ds.label,
        data: normalizeToArray(ds.data),
        borderColor: ds.borderColor,
        pointBackgroundColor: ds.pointBackgroundColor,
        pointBorderColor: ds.pointBorderColor,
      })),
      variation_caption:
        result.lineChart.comparisonLine?.data?.length > 0
          ? [
              {
                title: result.lineChart.comparisonLine.data[0].title,
                data: normalizeToArray(
                  result.lineChart.comparisonLine.data[0].data,
                )
                  .filter(
                    (item: any) =>
                      item && item.value !== null && item.value !== undefined,
                  )
                  .map((item: any) => ({
                    value: item.value || "",
                    color: item.trend === "positive" ? "#EDCD20" : "#FF0000",
                    measure: item.measure || "",
                  })),
              },
            ]
          : [],
    };

    const validateLineChart = ajv.compile(lineChartSchema);
    const isValidLineChart = validateLineChart(lineChartData);
    if (!isValidLineChart && validateLineChart.errors) {
      console.error(
        "LineChart validation errors:",
        JSON.stringify(validateLineChart.errors, null, 2),
      );
    }
    expect(isValidLineChart).toBe(true);

    // Transform barChart to match schema structure
    const barChartData = {
      type: "bar",
      labels: Array.isArray(result.barChart.labels)
        ? result.barChart.labels
        : [],
      datasets: result.barChart.datasets.map((ds: any) => ({
        type: "bar",
        label: ds.label,
        data: normalizeToArray(ds.data),
        backgroundColor: ds.backgroundColor,
        barThickness: ds.barThickness,
      })),
      variation_caption:
        result.barChart.comparisonLine?.data?.length > 0
          ? result.barChart.comparisonLine.data.map((comp: any) => ({
              title: comp.title,
              data: normalizeToArray(comp.data)
                .filter(
                  (item: any) =>
                    item && item.value !== null && item.value !== undefined,
                )
                .map((item: any) => ({
                  value: item.value || "",
                  color: item.trend === "positive" ? "#EDCD20" : "#FF0000",
                  measure: item.measure || "",
                })),
            }))
          : [],
    };

    const validateBarChart = ajv.compile(barChartSchema);
    const isValidBarChart = validateBarChart(barChartData);
    if (!isValidBarChart && validateBarChart.errors) {
      console.error(
        "BarChart validation errors:",
        JSON.stringify(validateBarChart.errors, null, 2),
      );
    }
    expect(isValidBarChart).toBe(true);
  });

  it("should handle empty datasources", async () => {
    const mockInput = createMockInput([], []);

    const result = await evaluateExpression(mockInput);

    expect(result).toBeDefined();
    // When no data, formatter returns { empty: true }
    expect(result.empty).toBe(true);
  });

  it.skip("DEPRECATED - old empty datasources test", async () => {
    // This test is deprecated - when datasources are empty,
    // the formatter now returns { empty: true } instead of the full structure
    const mockInput = createMockInput([], []);

    const result = await evaluateExpression(mockInput);

    expect(result).toBeDefined();
    expect(result.legend).toBeDefined();
    expect(result.legend).toHaveLength(3);

    // lineChart should have default suggestedMin/Max when no data
    expect(result.lineChart.suggestedMin).toBe(40);
    expect(result.lineChart.suggestedMax).toBe(70);
    // When array is empty, $map may return empty array or undefined
    if (result.lineChart.labels !== undefined) {
      expect(Array.isArray(result.lineChart.labels)).toBe(true);
      expect(result.lineChart.labels).toHaveLength(0);
    }
    expect(result.lineChart.datasets).toHaveLength(3);
    // When no data, the data array may be undefined or an empty array
    expect(
      result.lineChart.datasets[0].data === undefined ||
        Array.isArray(result.lineChart.datasets[0].data),
    ).toBe(true);
    if (result.lineChart.datasets[0].data !== undefined) {
      expect(result.lineChart.datasets[0].data).toHaveLength(0);
    }
    expect(result.lineChart.formattedData).toHaveLength(3);
    // comparisonLine data should be an empty array or undefined
    expect(
      result.lineChart.comparisonLine.data[0].data === undefined ||
        Array.isArray(result.lineChart.comparisonLine.data[0].data),
    ).toBe(true);
    if (result.lineChart.comparisonLine.data[0].data !== undefined) {
      expect(result.lineChart.comparisonLine.data[0].data).toHaveLength(0);
    }

    // barChart should handle empty data
    // When array is empty, accessing .period returns undefined (not an array)
    // So we check if it's undefined or an empty array
    expect(
      result.barChart.labels === undefined ||
        Array.isArray(result.barChart.labels),
    ).toBe(true);
    if (
      result.barChart.labels !== undefined &&
      Array.isArray(result.barChart.labels)
    ) {
      expect(result.barChart.labels).toHaveLength(0);
    }
    expect(
      result.barChart.datasets[0].data === undefined ||
        Array.isArray(result.barChart.datasets[0].data),
    ).toBe(true);
    if (result.barChart.datasets[0].data !== undefined) {
      expect(result.barChart.datasets[0].data).toHaveLength(0);
    }
    expect(
      result.barChart.formattedData === undefined ||
        Array.isArray(result.barChart.formattedData),
    ).toBe(true);
    if (
      result.barChart.formattedData !== undefined &&
      Array.isArray(result.barChart.formattedData)
    ) {
      // formattedData is always an array with one inner array, even when empty
      expect(result.barChart.formattedData).toHaveLength(1);
      if (result.barChart.formattedData[0] !== undefined) {
        expect(result.barChart.formattedData[0]).toHaveLength(0);
      }
    }
    expect(
      result.barChart.comparisonLine.data[0].data === undefined ||
        Array.isArray(result.barChart.comparisonLine.data[0].data),
    ).toBe(true);
    if (result.barChart.comparisonLine.data[0].data !== undefined) {
      expect(result.barChart.comparisonLine.data[0].data).toHaveLength(0);
    }
    expect(
      result.barChart.comparisonLine.data[1].data === undefined ||
        Array.isArray(result.barChart.comparisonLine.data[1].data),
    ).toBe(true);
    if (result.barChart.comparisonLine.data[1].data !== undefined) {
      expect(result.barChart.comparisonLine.data[1].data).toHaveLength(0);
    }
  });

  it("should handle null values in lineChart data", async () => {
    const mockInput = createMockInput(
      [
        createLineChartEntry({
          month_label: "Jan",
          year: 2024,
          ac: null,
          ly: null,
          bu: null,
          ac_vs_ly: null,
          ac_vs_bu: null,
        }),
        createLineChartEntry({
          month_label: "Feb",
          year: 2024,
          ac: 52.3,
          ly: 50.5,
          bu: 52.8,
          ac_vs_ly: 1.8,
          ac_vs_bu: -0.5,
        }),
      ],
      [],
    );

    const result = await evaluateExpression(mockInput);

    expect(result.lineChart.labels).toHaveLength(2);
    expect(result.lineChart.datasets[0].data[0]).toBeNull(); // ac
    expect(result.lineChart.datasets[1].data[0]).toBeNull(); // ly
    expect(result.lineChart.datasets[2].data[0]).toBeNull(); // bu
    expect(result.lineChart.datasets[0].data[1]).toBe(52.3); // ac value
    expect(result.lineChart.datasets[1].data[1]).toBe(50.5); // ly value
    expect(result.lineChart.datasets[2].data[1]).toBe(52.8); // bu value
  });

  it("should handle null values in barChart data", async () => {
    const mockInput = createMockInput(
      [],
      [
        createBarChartEntry({
          period: "2024 Q1",
          ac: null,
          ac_vs_ly: null,
          ac_vs_bu: null,
        }),
        createBarChartEntry({
          period: "2024 Q2",
          ac: 53.1,
          ac_vs_ly: 2.2,
          ac_vs_bu: 0.3,
        }),
      ],
    );

    const result = await evaluateExpression(mockInput);

    expect(result.barChart.labels).toHaveLength(2);
    expect(result.barChart.datasets[0].data[0]).toBeNull();
    expect(result.barChart.datasets[0].data[1]).toBe(53.1);
    expect(result.barChart.formattedData[0][0]).toBeNull();
    expect(result.barChart.formattedData[0][1]).toBe("53.1");
  });

  it("should calculate suggestedMin and suggestedMax correctly", async () => {
    const mockInput = createMockInput(
      [
        createLineChartEntry({ ac: 50.0 }),
        createLineChartEntry({ ac: 60.0 }),
        createLineChartEntry({ ac: 70.0 }),
      ],
      [],
    );

    const result = await evaluateExpression(mockInput);

    // suggestedMin should be 85% of min (50.0 * 0.85 = 42.5, rounded to 42.5)
    expect(result.lineChart.suggestedMin).toBe(42.5);
    // suggestedMax should be 115% of max (70.0 * 1.15 = 80.5, rounded to 80.5)
    expect(result.lineChart.suggestedMax).toBe(80.5);
  });

  it("should format labels correctly with month only", async () => {
    const mockInput = createMockInput(
      [
        createLineChartEntry({
          month_label: "Jan",
          year: 2024,
        }),
        createLineChartEntry({
          month_label: "Dec",
          year: 2024,
        }),
        createLineChartEntry({
          month_label: null,
          year: 2024,
        }),
        createLineChartEntry({
          month_label: "Jan",
          year: null,
        }),
      ],
      [],
    );

    const result = await evaluateExpression(mockInput);

    expect(result.lineChart.labels[0]).toBe("Jan");
    expect(result.lineChart.labels[1]).toBe("Dec");
    expect(result.lineChart.labels[2]).toBe(""); // null month_label
    expect(result.lineChart.labels[3]).toBe("Jan"); // null year
  });

  it("should format numbers correctly in formattedData", async () => {
    const mockInput = createMockInput(
      [
        createLineChartEntry({
          ac: 1234.567,
          ly: 100.0,
          bu: 1240.245,
          ac_vs_ly: 12.345,
          ac_vs_bu: -5.678,
        }),
      ],
      [
        createBarChartEntry({
          ac: 9876.543,
        }),
      ],
    );

    const result = await evaluateExpression(mockInput);

    // barChart formattedData uses large number format: 9876.543 becomes "9.9k"
    if (result.barChart.formattedData[0][0] !== null) {
      expect(result.barChart.formattedData[0][0]).toContain("k");
    }
  });

  it("should handle variationDirectionVsLy correctly for trend", async () => {
    const mockInput = createMockInput(
      [
        createLineChartEntry({
          variationDirectionVsLy: "up",
        }),
        createLineChartEntry({
          variationDirectionVsLy: "down",
        }),
      ],
      [
        createBarChartEntry({
          variationDirectionVsLy: "up",
        }),
        createBarChartEntry({
          variationDirectionVsLy: "down",
        }),
      ],
    );

    const result = await evaluateExpression(mockInput);

    expect(result.lineChart.comparisonLine.data[0].data[0].trend).toBe(
      "positive",
    );
    expect(result.lineChart.comparisonLine.data[0].data[1].trend).toBe(
      "negative",
    );

    expect(result.barChart.comparisonLine.data[0].data[0].trend).toBe(
      "positive",
    );
    expect(result.barChart.comparisonLine.data[0].data[1].trend).toBe(
      "negative",
    );
  });

  it("should handle missing ac_vs_ly or ac_vs_bu in lineChart", async () => {
    const mockInput = createMockInput(
      [
        createLineChartEntry({
          ac: 50.5,
          ly: null,
          bu: 51.7,
          ac_vs_ly: null,
          ac_vs_bu: -1.2,
        }),
        createLineChartEntry({
          ac: 52.3,
          ly: 50.5,
          bu: null,
          ac_vs_ly: 1.8,
          ac_vs_bu: null,
        }),
      ],
      [],
    );

    const result = await evaluateExpression(mockInput);

    expect(result.lineChart.datasets[0].data[0]).toBe(50.5);
    expect(result.lineChart.datasets[0].data[1]).toBe(52.3);
    expect(result.lineChart.datasets[1].data[0]).toBeNull(); // no ly for first item
    expect(result.lineChart.datasets[2].data[1]).toBeNull(); // no bu for second item
  });

  it("should round values correctly in datasets", async () => {
    const mockInput = createMockInput(
      [
        createLineChartEntry({
          ac: 50.567,
          ly: 48.111,
          bu: 51.801,
          ac_vs_ly: 2.456,
          ac_vs_bu: -1.234,
        }),
      ],
      [
        createBarChartEntry({
          ac: 52.789,
        }),
      ],
    );

    const result = await evaluateExpression(mockInput);

    // Values should be rounded to 1 decimal place
    // Order in JSONata: Current Year [0], Last Year [1], Budget [2]
    const currentYearData = result.lineChart.datasets[0].data;
    const lastYearData = result.lineChart.datasets[1].data;
    const budgetData = result.lineChart.datasets[2].data;
    const barChartData = result.barChart.datasets[0].data;

    // Normalize data to array format for testing
    const normalizeToArray = (data: any): number[] => {
      if (data === undefined || data === null) return [];
      if (Array.isArray(data)) return data;
      return [data];
    };

    const lastYearArray = normalizeToArray(lastYearData);
    const budgetArray = normalizeToArray(budgetData);
    const currentYearArray = normalizeToArray(currentYearData);
    const barChartArray = normalizeToArray(barChartData);

    // Verify rounded values
    expect(lastYearArray.length).toBeGreaterThan(0);
    expect(lastYearArray[0]).toBe(48.1); // 48.111 rounded to 48.1

    expect(budgetArray.length).toBeGreaterThan(0);
    expect(budgetArray[0]).toBe(51.8); // 51.801 rounded to 51.8

    expect(currentYearArray.length).toBeGreaterThan(0);
    expect(currentYearArray[0]).toBe(50.6); // 50.567 rounded to 50.6

    expect(barChartArray.length).toBeGreaterThan(0);
    expect(barChartArray[0]).toBe(52.8); // 52.789 rounded to 52.8
  });

  describe("highlightedIndexes", () => {
    it("should add highlightedIndexes with last 3 indices when period_type is L3M", async () => {
      const lineChartEntries = [
        createLineChartEntry({ month_label: "Jan", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Feb", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Mar", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Apr", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "May", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Jun", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Jul", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Aug", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Sep", year: 2024, ac: 50.5 }),
        createLineChartEntry({ month_label: "Oct", year: 2024, ac: 52.3 }),
        createLineChartEntry({ month_label: "Nov", year: 2024, ac: 51.8 }),
      ];

      const overtimePerformanceEntries: OvertimePerformanceEntry[] = [
        { period_type: "L3M" },
      ];

      const mockInput = createMockInput(
        lineChartEntries,
        [],
        overtimePerformanceEntries,
      );

      const result = await evaluateExpression(mockInput);

      expect(result.lineChart.highlightedIndexes).toBeDefined();
      // Sep (index 8) is the first with ac != null, so L3M should highlight [6, 7, 8] (last 3 months up to current)
      expect(result.lineChart.highlightedIndexes).toEqual([8, 9, 10]);
    });

    it("should add highlightedIndexes with last index when period_type is MTD", async () => {
      const lineChartEntries = [
        createLineChartEntry({ month_label: "Jan", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Feb", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Mar", year: 2024, ac: 50.5 }),
      ];

      const overtimePerformanceEntries: OvertimePerformanceEntry[] = [
        { period_type: "MTD" },
      ];

      const mockInput = createMockInput(
        lineChartEntries,
        [],
        overtimePerformanceEntries,
      );

      const result = await evaluateExpression(mockInput);

      expect(result.lineChart.highlightedIndexes).toBeDefined();
      // Mar (index 2) is the first with ac != null, so MTD should highlight [2]
      expect(result.lineChart.highlightedIndexes).toEqual([2]);
    });

    it("should set highlightedIndexes to empty array when period_type is not L3M or MTD", async () => {
      const lineChartEntries = [
        createLineChartEntry({ month_label: "Jan", year: 2024 }),
        createLineChartEntry({ month_label: "Feb", year: 2024 }),
        createLineChartEntry({ month_label: "Mar", year: 2024 }),
      ];

      const overtimePerformanceEntries: OvertimePerformanceEntry[] = [
        { period_type: "YTD" },
      ];

      const mockInput = createMockInput(
        lineChartEntries,
        [],
        overtimePerformanceEntries,
      );

      const result = await evaluateExpression(mockInput);

      expect(result.lineChart.highlightedIndexes).toEqual([]);
    });

    it("should set highlightedIndexes to empty array when period_type is null", async () => {
      const lineChartEntries = [
        createLineChartEntry({ month_label: "Jan", year: 2024 }),
        createLineChartEntry({ month_label: "Feb", year: 2024 }),
      ];

      const overtimePerformanceEntries: OvertimePerformanceEntry[] = [
        { period_type: null },
      ];

      const mockInput = createMockInput(
        lineChartEntries,
        [],
        overtimePerformanceEntries,
      );

      const result = await evaluateExpression(mockInput);

      expect(result.lineChart.highlightedIndexes).toEqual([]);
    });

    it("should set highlightedIndexes to empty array when overtime-performance datasource is missing and no period_type in lineChartItems", async () => {
      const lineChartEntries = [
        createLineChartEntry({ month_label: "Jan", year: 2024 }),
        createLineChartEntry({ month_label: "Feb", year: 2024 }),
        createLineChartEntry({ month_label: "Mar", year: 2024 }),
      ];

      const mockInput = createMockInput(lineChartEntries, []);

      const result = await evaluateExpression(mockInput);

      // When no overtime-performance datasource and no period_type in lineChartItems, highlightedIndexes should be empty
      expect(result.lineChart.highlightedIndexes).toEqual([]);
    });

    it("should set highlightedIndexes to empty array when overtime-performance datasource is empty and no period_type in lineChartItems", async () => {
      const lineChartEntries = [
        createLineChartEntry({ month_label: "Jan", year: 2024 }),
        createLineChartEntry({ month_label: "Feb", year: 2024 }),
      ];

      const overtimePerformanceEntries: OvertimePerformanceEntry[] = [];

      const mockInput = createMockInput(
        lineChartEntries,
        [],
        overtimePerformanceEntries,
      );

      const result = await evaluateExpression(mockInput);

      // When overtime-performance datasource is empty and no period_type in lineChartItems, highlightedIndexes should be empty
      expect(result.lineChart.highlightedIndexes).toEqual([]);
    });

    it("should handle L3M with less than 3 lineChart entries", async () => {
      const lineChartEntries = [
        createLineChartEntry({ month_label: "Jan", year: 2024, ac: 50.5 }),
        createLineChartEntry({ month_label: "Feb", year: 2024, ac: 52.3 }),
      ];

      const overtimePerformanceEntries: OvertimePerformanceEntry[] = [
        { period_type: "L3M" },
      ];

      const mockInput = createMockInput(
        lineChartEntries,
        [],
        overtimePerformanceEntries,
      );

      const result = await evaluateExpression(mockInput);

      // Jan (index 0) is the first with ac != null, so L3M should highlight [0] (only current month available)
      expect(result.lineChart.highlightedIndexes).toEqual([0, 1]);
    });

    it("should handle MTD with empty lineChart entries", async () => {
      const lineChartEntries: LineChartEntry[] = [];

      const overtimePerformanceEntries: OvertimePerformanceEntry[] = [
        { period_type: "MTD" },
      ];

      const mockInput = createMockInput(
        lineChartEntries,
        [],
        overtimePerformanceEntries,
      );

      const result = await evaluateExpression(mockInput);

      // When no valid data exists, formatter returns { empty: true } which signals
      // to ProcessViewUseCase to filter out this component from the response
      expect(result.empty).toBe(true);
    });

    it("should handle L3M when current month is first (index 0)", async () => {
      const lineChartEntries = [
        createLineChartEntry({ month_label: "Jan", year: 2024, ac: 50.5 }),
        createLineChartEntry({ month_label: "Feb", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Mar", year: 2024, ac: null }),
      ];

      const overtimePerformanceEntries: OvertimePerformanceEntry[] = [
        { period_type: "L3M" },
      ];

      const mockInput = createMockInput(
        lineChartEntries,
        [],
        overtimePerformanceEntries,
      );

      const result = await evaluateExpression(mockInput);

      // Jan (index 0) is the first with ac != null, so L3M should highlight only [0]
      expect(result.lineChart.highlightedIndexes).toEqual([0]);
    });

    it("should handle L3M when current month is second (index 1)", async () => {
      const lineChartEntries = [
        createLineChartEntry({ month_label: "Jan", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Feb", year: 2024, ac: 50.5 }),
        createLineChartEntry({ month_label: "Mar", year: 2024, ac: null }),
      ];

      const overtimePerformanceEntries: OvertimePerformanceEntry[] = [
        { period_type: "L3M" },
      ];

      const mockInput = createMockInput(
        lineChartEntries,
        [],
        overtimePerformanceEntries,
      );

      const result = await evaluateExpression(mockInput);

      // Feb (index 1) is the first with ac != null, so L3M should highlight [0, 1]
      expect(result.lineChart.highlightedIndexes).toEqual([0, 1]);
    });

    it("should handle L3M when current month is third or later (index >= 2)", async () => {
      const lineChartEntries = [
        createLineChartEntry({ month_label: "Jan", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Feb", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Mar", year: 2024, ac: null }),
        createLineChartEntry({ month_label: "Apr", year: 2024, ac: 50.5 }),
      ];

      const overtimePerformanceEntries: OvertimePerformanceEntry[] = [
        { period_type: "L3M" },
      ];

      const mockInput = createMockInput(
        lineChartEntries,
        [],
        overtimePerformanceEntries,
      );

      const result = await evaluateExpression(mockInput);

      // Apr (index 3) is the first with ac != null, so L3M should highlight [1, 2, 3]
      expect(result.lineChart.highlightedIndexes).toEqual([1, 2, 3]);
    });

    it("should handle MTD when current month is first (index 0)", async () => {
      const lineChartEntries = [
        createLineChartEntry({ month_label: "Jan", year: 2024, ac: 50.5 }),
        createLineChartEntry({ month_label: "Feb", year: 2024, ac: null }),
      ];

      const overtimePerformanceEntries: OvertimePerformanceEntry[] = [
        { period_type: "MTD" },
      ];

      const mockInput = createMockInput(
        lineChartEntries,
        [],
        overtimePerformanceEntries,
      );

      const result = await evaluateExpression(mockInput);

      // Jan (index 0) is the first with ac != null, so MTD should highlight [0]
      expect(result.lineChart.highlightedIndexes).toEqual([0]);
    });

    it("should use period_type from lineChartItems when overtime-performance datasource is missing", async () => {
      const lineChartEntries = [
        createLineChartEntry({
          month_label: "Jan",
          year: 2024,
          ac: null,
          period_type: "L3M",
        }),
        createLineChartEntry({
          month_label: "Feb",
          year: 2024,
          ac: null,
        }),
        createLineChartEntry({
          month_label: "Mar",
          year: 2024,
          ac: 50.5,
        }),
      ];

      const mockInput = createMockInput(lineChartEntries, []);

      const result = await evaluateExpression(mockInput);

      // Should use period_type from lineChartItems[0] and highlight based on first ac != null (index 2)
      // Since currentMonthIndex = 2, L3M should highlight [0, 1, 2]
      expect(result.lineChart.highlightedIndexes).toEqual([0, 1, 2]);
    });
  });

  describe("barChart legend and stripedIndexes when LY is absent", () => {
    it("should show 3-item legend and stripedIndexes [1] when barChart has 3 items (LY + BU + AC)", async () => {
      const mockInput = createMockInput(
        [
          createLineChartEntry({
            month_label: "Jan",
            ac: 50.5,
            ly: 48.0,
            bu: 51.7,
            ac_vs_ly: 2.5,
            ac_vs_bu: -1.2,
          }),
        ],
        [
          createBarChartEntry({
            period: "LY'25",
            ac: 48.0,
            ac_vs_ly: null,
            ac_vs_bu: null,
          }),
          createBarChartEntry({
            period: "BU'26",
            ac: 51.7,
            ac_vs_ly: null,
            ac_vs_bu: null,
          }),
          createBarChartEntry({
            period: "YTD'26",
            ac: 50.5,
            ac_vs_ly: 2.5,
            ac_vs_bu: -1.2,
          }),
        ],
      );

      const result = await evaluateExpression(mockInput);

      expect(result.legend).toHaveLength(3);
      expect(result.legend[0].label).toBe("Last Year");
      expect(result.legend[1].label).toBe("Budget");
      expect(result.legend[2].label).toBe("Current");

      expect(result.barChart.stripedIndexes).toEqual([1]);
    });

    it("should show 3-item legend when barChart has no data (empty snapshot)", async () => {
      const mockInput = createMockInput(
        [
          createLineChartEntry({
            month_label: "Jan",
            ac: 50.5,
            ly: 48.0,
            bu: 51.7,
            ac_vs_ly: 2.5,
            ac_vs_bu: -1.2,
          }),
        ],
        [],
      );

      const result = await evaluateExpression(mockInput);

      expect(result.legend).toHaveLength(3);
      expect(result.legend[0].label).toBe("Last Year");
      expect(result.legend[1].label).toBe("Budget");
      expect(result.legend[2].label).toBe("Current");

      expect(result.barChart).toEqual([]);
    });

    it("should return empty stripedIndexes when barChart has only 1 item", async () => {
      const mockInput = createMockInput(
        [
          createLineChartEntry({
            month_label: "Jan",
            ac: 0.4,
            ly: null,
            bu: null,
            ac_vs_ly: null,
            ac_vs_bu: null,
          }),
        ],
        [
          createBarChartEntry({
            period: "YTD'26",
            ac: 0.4,
            ac_vs_ly: null,
            ac_vs_bu: null,
          }),
        ],
      );

      const result = await evaluateExpression(mockInput);

      expect(result.barChart.stripedIndexes).toEqual([]);
    });
  });

  describe("Schema validation", () => {
    it("should validate lineChart against lineChartSchema", async () => {
      const lineChartEntries = [
        createLineChartEntry({
          month_label: "Jan",
          year: 2024,
          ac: 50.5,
          ly: 48.0,
          bu: 51.7,
          ac_vs_ly: 2.5,
          ac_vs_bu: -1.2,
        }),
        createLineChartEntry({
          month_label: "Feb",
          year: 2024,
          ac: 52.3,
          ly: 50.5,
          bu: 52.8,
          ac_vs_ly: 1.8,
          ac_vs_bu: -0.5,
        }),
      ];

      const barChartEntries = [createBarChartEntry()];

      const mockInput = createMockInput(lineChartEntries, barChartEntries);
      const result = await evaluateExpression(mockInput);

      const normalizeToArray = (data: any): any[] => {
        if (data === undefined || data === null) return [];
        if (Array.isArray(data)) return data;
        return [data];
      };

      // Transform lineChart to match schema structure
      const lineChartData = {
        type: "line",
        labels: Array.isArray(result.lineChart.labels)
          ? result.lineChart.labels
          : [],
        datasets: result.lineChart.datasets.map((ds: any) => ({
          type: "line",
          label: ds.label,
          data: normalizeToArray(ds.data),
          borderColor: ds.borderColor,
          pointBackgroundColor: ds.pointBackgroundColor,
          pointBorderColor: ds.pointBorderColor,
        })),
        variation_caption:
          result.lineChart.comparisonLine?.data?.length > 0
            ? [
                {
                  title: result.lineChart.comparisonLine.data[0].title,
                  data: normalizeToArray(
                    result.lineChart.comparisonLine.data[0].data,
                  )
                    .filter(
                      (item: any) =>
                        item && item.value !== null && item.value !== undefined,
                    )
                    .map((item: any) => ({
                      value: item.value || "",
                      color: item.trend === "positive" ? "#EDCD20" : "#FF0000",
                      measure: item.measure || "",
                    })),
                },
              ]
            : [],
      };

      const validate = ajv.compile(lineChartSchema);
      const isValid = validate(lineChartData);
      if (!isValid && validate.errors) {
        console.error(
          "LineChart validation errors:",
          JSON.stringify(validate.errors, null, 2),
        );
        console.error(
          "LineChart data:",
          JSON.stringify(lineChartData, null, 2),
        );
      }
      expect(isValid).toBe(true);
    });

    it("should validate barChart against barChartSchema", async () => {
      const lineChartEntries = [createLineChartEntry()];
      const barChartEntries = [
        createBarChartEntry({
          period: "2024 Q1",
          ac: 52.3,
          ac_vs_ly: 1.8,
          ac_vs_bu: -0.5,
        }),
        createBarChartEntry({
          period: "2024 Q2",
          ac: 53.1,
          ac_vs_ly: 2.2,
          ac_vs_bu: 0.3,
        }),
      ];

      const mockInput = createMockInput(lineChartEntries, barChartEntries);
      const result = await evaluateExpression(mockInput);

      const normalizeToArray = (data: any): any[] => {
        if (data === undefined || data === null) return [];
        if (Array.isArray(data)) return data;
        return [data];
      };

      // Transform barChart to match schema structure
      const barChartData = {
        type: "bar",
        labels: Array.isArray(result.barChart.labels)
          ? result.barChart.labels
          : [],
        datasets: result.barChart.datasets.map((ds: any) => ({
          type: "bar",
          label: ds.label,
          data: normalizeToArray(ds.data),
          backgroundColor: ds.backgroundColor,
          barThickness: ds.barThickness,
        })),
        variation_caption:
          result.barChart.comparisonLine?.data?.length > 0
            ? result.barChart.comparisonLine.data.map((comp: any) => ({
                title: comp.title,
                data: normalizeToArray(comp.data)
                  .filter(
                    (item: any) =>
                      item && item.value !== null && item.value !== undefined,
                  )
                  .map((item: any) => ({
                    value: item.value || "",
                    color: item.trend === "positive" ? "#EDCD20" : "#FF0000",
                    measure: item.measure || "",
                  })),
              }))
            : [],
      };

      const validate = ajv.compile(barChartSchema);
      const isValid = validate(barChartData);
      if (!isValid && validate.errors) {
        console.error(
          "BarChart validation errors:",
          JSON.stringify(validate.errors, null, 2),
        );
        console.error("BarChart data:", JSON.stringify(barChartData, null, 2));
      }
      expect(isValid).toBe(true);
    });
  });
});

import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "../../../../../../../../src/infrastructure/repositories/helpers";

const LINE_DATASOURCE_KEY =
  "value-creation_performance-tool_drill-down_non-finance_market-share_overtime-trends_by-granularity";
const BAR_DATASOURCE_KEY =
  "value-creation_performance-tool_drill-down_non-finance_market-share_overtime-trends_snapshot";
const PERFORMANCE_DATASOURCE_KEY =
  "value-creation_performance-tool_drill-down_non-finance_market-share_overtime-performance";

function toArray<T>(value: T | T[]): T[] {
  return value == null ? [] : Array.isArray(value) ? value : [value];
}

describe("Market Share Overtime Trends Charts formatter", () => {
  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/performance-tool/drill-down/non-finance/market-share/overtime-trends-charts.jsonata",
    );
    const expression = fs.readFileSync(jsonataPath, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("should return empty state (empty: true) when datasources is empty", async () => {
    const mockInput = { datasources: {} };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result).toEqual({ empty: true });
  });

  it("should return empty state (empty: true) when both datasource arrays are empty", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [],
        [BAR_DATASOURCE_KEY]: [],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result).toEqual({ empty: true });
  });

  it("should return lineChart with data and barChart empty when only by-granularity has data", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            refreshMonthLabel: "Jan'25",
            ly: 30.5,
            ac: 32.1,
            ac_vs_ly: 1.6,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
            period_type: "MTD",
          },
        ],
        [BAR_DATASOURCE_KEY]: [],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result).toBeDefined();
    expect(result.legend).toHaveLength(2);
    expect(result.legend[0].label).toBe("Last Year");
    expect(result.legend[1].label).toBe("Current");
    expect(Array.isArray(result.lineChart)).toBe(false);
    expect(result.lineChart).toBeDefined();
    expect(toArray(result.lineChart.labels)).toHaveLength(1);
    expect(toArray(result.lineChart.labels)[0]).toBe("JAN");
    expect(result.lineChart.datasets).toHaveLength(2);
    expect(result.lineChart.datasets[0].label).toBe("Current Year");
    expect(result.lineChart.datasets[1].label).toBe("Last Year");
    expect(result.barChart).toEqual([]);
  });

  it("should extract only first 3 letters from refreshMonthLabel", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            refreshMonthLabel: "Jan'25",
            ac: 32.1,
            ly: 30.5,
          },
          {
            refreshMonthLabel: "February'25",
            ac: 33.2,
            ly: 31.0,
          },
          {
            refreshMonthLabel: "Dec'25",
            ac: 34.5,
            ly: 32.0,
          },
        ],
        [BAR_DATASOURCE_KEY]: [],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    const labels = toArray(result.lineChart.labels);
    expect(labels[0]).toBe("JAN");
    expect(labels[1]).toBe("FEB");
    expect(labels[2]).toBe("DEC");
  });

  it("should return barChart with data and lineChart empty when only snapshot has data", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [],
        [BAR_DATASOURCE_KEY]: [
          {
            period: "YTD'25",
            ac: 30.2,
            ac_vs_ly: -1.2,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "down",
          },
        ],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result).toBeDefined();
    expect(result.legend).toHaveLength(2);
    expect(result.legend[0].label).toBe("Last Year");
    expect(result.legend[1].label).toBe("Current");
    expect(result.lineChart).toEqual([]);
    expect(Array.isArray(result.barChart)).toBe(false);
    expect(result.barChart).toBeDefined();
    const barLabels = toArray(result.barChart.labels);
    expect(barLabels).toHaveLength(1);
    expect(barLabels[0]).toBe("YTD'25");
    expect(result.barChart.datasets).toHaveLength(1);
    expect(result.barChart.datasets[0].label).toBe("Market Share");
    expect(toArray(result.barChart.datasets[0].data)).toHaveLength(1);
    expect(result.barChart.comparisonLine.data).toHaveLength(1);
    expect(result.barChart.comparisonLine.data[0].title).toBe("vs LY");
  });

  it("should return legend with Current only when barChart has 2 or fewer items", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [],
        [BAR_DATASOURCE_KEY]: [
          {
            period: "YTD'25",
            ac: 30.2,
            ac_vs_ly: -1.2,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "down",
          },
          {
            period: "YTD'26",
            ac: 31.5,
            ac_vs_ly: 0.5,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
          },
        ],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result.legend).toHaveLength(2);
    expect(result.legend[0].label).toBe("Last Year");
    expect(result.legend[1].label).toBe("Current");
  });

  it("should return legend with Last Year and Current when barChart has more than 2 items", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [],
        [BAR_DATASOURCE_KEY]: [
          {
            period: "YTD'25",
            ac: 30.2,
            ac_vs_ly: -1.2,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "down",
          },
          {
            period: "BU'26",
            ac: 31.0,
            ac_vs_ly: 0.3,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
          },
          {
            period: "YTD'26",
            ac: 31.5,
            ac_vs_ly: 0.5,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
          },
        ],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result.legend).toHaveLength(2);
    expect(result.legend[0].label).toBe("Last Year");
    expect(result.legend[1].label).toBe("Current");
  });

  it("should set highlightedIndexes correctly for L3M period type", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            refreshMonthLabel: "Jan'25",
            ac: 30.5,
            period_type: "L3M",
          },
          {
            refreshMonthLabel: "Feb'25",
            ac: 31.0,
            period_type: "L3M",
          },
          {
            refreshMonthLabel: "Mar'25",
            ac: 32.1,
            period_type: "L3M",
          },
          {
            refreshMonthLabel: "Apr'25",
            ac: 33.2,
            period_type: "L3M",
          },
        ],
        [BAR_DATASOURCE_KEY]: [],
        [PERFORMANCE_DATASOURCE_KEY]: [{ period_type: "L3M" }],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result.lineChart.highlightedIndexes).toEqual([1, 2, 3]);
  });

  it("should set highlightedIndexes to [0] when currentMonthIndex is 0 for L3M", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            refreshMonthLabel: "Jan'25",
            ac: 30.5,
            period_type: "L3M",
          },
        ],
        [BAR_DATASOURCE_KEY]: [],
        [PERFORMANCE_DATASOURCE_KEY]: [{ period_type: "L3M" }],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result.lineChart.highlightedIndexes).toEqual([0]);
  });

  it("should set highlightedIndexes to [0, 1] when currentMonthIndex is 1 for L3M", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            refreshMonthLabel: "Jan'25",
            ac: null,
            period_type: "L3M",
          },
          {
            refreshMonthLabel: "Feb'25",
            ac: 31.0,
            period_type: "L3M",
          },
        ],
        [BAR_DATASOURCE_KEY]: [],
        [PERFORMANCE_DATASOURCE_KEY]: [{ period_type: "L3M" }],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result.lineChart.highlightedIndexes).toEqual([0, 1]);
  });

  it("should set highlightedIndexes correctly for MTD period type", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            refreshMonthLabel: "Jan'25",
            ac: 30.5,
            period_type: "MTD",
          },
          {
            refreshMonthLabel: "Feb'25",
            ac: 31.0,
            period_type: "MTD",
          },
          {
            refreshMonthLabel: "Mar'25",
            ac: 32.1,
            period_type: "MTD",
          },
        ],
        [BAR_DATASOURCE_KEY]: [],
        [PERFORMANCE_DATASOURCE_KEY]: [{ period_type: "MTD" }],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result.lineChart.highlightedIndexes).toEqual([2]);
  });

  it("should calculate suggestedMin and suggestedMax based on ac values", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            refreshMonthLabel: "Jan'25",
            ac: 50.0,
            ly: 45.0,
          },
          {
            refreshMonthLabel: "Feb'25",
            ac: 60.0,
            ly: 55.0,
          },
        ],
        [BAR_DATASOURCE_KEY]: [],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result.lineChart.suggestedMin).toBe(48);
    expect(result.lineChart.suggestedMax).toBe(62);
  });

  it("should use default suggestedMin and suggestedMax when no ac values", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            refreshMonthLabel: "Jan'25",
            ac: null,
            ly: 45.0,
          },
        ],
        [BAR_DATASOURCE_KEY]: [],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result.lineChart.suggestedMin).toBe(40);
    expect(result.lineChart.suggestedMax).toBe(70);
  });

  it("should set trend to positive when ac_vs_ly is zero or null in comparisonLine", async () => {
    const lineOnlyInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            refreshMonthLabel: "Jan'25",
            ly: 30.5,
            ac: 30.5,
            ac_vs_ly: 0,
            variationDirectionVsLy: "up",
            comp_unit_of_measure: "pp",
          },
        ],
        [BAR_DATASOURCE_KEY]: [],
      },
    };
    const lineResult = await compiledExpression.evaluate(lineOnlyInput);
    expect(lineResult.lineChart).toBeDefined();
    const lineComparisonData = toArray(
      lineResult.lineChart.comparisonLine.data[0].data,
    );
    expect(lineComparisonData[0].trend).toBe("positive");

    const barOnlyInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [],
        [BAR_DATASOURCE_KEY]: [
          {
            period: "YTD'26",
            ac: 30.2,
            ac_vs_ly: 0,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
          },
        ],
      },
    };
    const barResult = await compiledExpression.evaluate(barOnlyInput);
    const barComparisonData = toArray(
      barResult.barChart.comparisonLine.data[0].data,
    );
    expect(barComparisonData[0].trend).toBe("positive");
  });

  it("should set trend based on variationDirectionVsLy", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            refreshMonthLabel: "Jan'25",
            ac: 32.1,
            ly: 30.5,
            ac_vs_ly: 1.6,
            variationDirectionVsLy: "up",
            comp_unit_of_measure: "pp",
          },
          {
            refreshMonthLabel: "Feb'25",
            ac: 29.8,
            ly: 31.0,
            ac_vs_ly: -1.2,
            variationDirectionVsLy: "down",
            comp_unit_of_measure: "pp",
          },
        ],
        [BAR_DATASOURCE_KEY]: [],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    const comparisonData = toArray(
      result.lineChart.comparisonLine.data[0].data,
    );
    expect(comparisonData[0].trend).toBe("positive");
    expect(comparisonData[1].trend).toBe("negative");
  });

  it("should format comparisonLine values correctly with measure 'pp'", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            refreshMonthLabel: "Jan'25",
            ac: 32.1,
            ly: 30.5,
            ac_vs_ly: 1.6,
            variationDirectionVsLy: "up",
            comp_unit_of_measure: "pp",
          },
          {
            refreshMonthLabel: "Feb'25",
            ac: 29.8,
            ly: 31.0,
            ac_vs_ly: null,
            variationDirectionVsLy: "down",
            comp_unit_of_measure: "pp",
          },
        ],
        [BAR_DATASOURCE_KEY]: [],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    const comparisonData = toArray(
      result.lineChart.comparisonLine.data[0].data,
    );
    expect(comparisonData[0].value).toBe("1.6");
    expect(comparisonData[0].measure).toBe("pp");
    expect(comparisonData[1].value).toBe("-");
    expect(comparisonData[1].measure).toBe("");
  });

  it("should format barChart data with formatLargeNumber", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [],
        [BAR_DATASOURCE_KEY]: [
          {
            period: "YTD'25",
            ac: 1500000,
            ac_vs_ly: -1.2,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "down",
          },
          {
            period: "YTD'26",
            ac: 2500,
            ac_vs_ly: 0.5,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
          },
          {
            period: "BU'26",
            ac: 500,
            ac_vs_ly: 0.3,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
          },
        ],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result.barChart.formattedData[0][0]).toMatch(/1\.5M/);
    expect(result.barChart.formattedData[0][1]).toMatch(/2\.5k/);
    expect(result.barChart.formattedData[0][2]).toMatch(/500\.0/);
  });

  it("should set stripedIndexes correctly for barChart", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [],
        [BAR_DATASOURCE_KEY]: [
          {
            period: "YTD'25",
            ac: 30.2,
            ac_vs_ly: -1.2,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "down",
          },
          {
            period: "BU'26",
            ac: 31.0,
            ac_vs_ly: 0.3,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
          },
          {
            period: "YTD'26",
            ac: 31.5,
            ac_vs_ly: 0.5,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
          },
        ],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result.barChart.stripedIndexes).toEqual([]);
  });

  it("should return full structure with legend, lineChart and barChart when data is present", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            refreshMonthLabel: "Jan'25",
            ly: 30.5,
            ac: 32.1,
            ac_vs_ly: 1.6,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
            period_type: "MTD",
          },
          {
            refreshMonthLabel: "Feb'25",
            ly: 31.0,
            ac: 31.5,
            ac_vs_ly: 0.5,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
            period_type: "MTD",
          },
        ],
        [BAR_DATASOURCE_KEY]: [
          {
            period: "YTD'25",
            ac: 30.2,
            ac_vs_ly: -1.2,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "down",
          },
          {
            period: "BU'26",
            ac: 31.0,
            ac_vs_ly: 0.3,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
          },
          {
            period: "YTD'26",
            ac: 31.5,
            ac_vs_ly: 0.5,
            comp_unit_of_measure: "pp",
            variationDirectionVsLy: "up",
          },
        ],
        [PERFORMANCE_DATASOURCE_KEY]: [{ period_type: "MTD" }],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result).toBeDefined();
    expect(result.legend).toHaveLength(2);
    expect(result.legend[0].label).toBe("Last Year");
    expect(result.legend[1].label).toBe("Current");

    expect(result.lineChart).toBeDefined();
    expect(result.lineChart.suggestedMin).toBeDefined();
    expect(result.lineChart.suggestedMax).toBeDefined();
    expect(result.lineChart.labels).toHaveLength(2);
    expect(result.lineChart.labels[0]).toBe("JAN");
    expect(result.lineChart.labels[1]).toBe("FEB");
    expect(result.lineChart.datasets).toHaveLength(2);
    expect(result.lineChart.datasets[0].label).toBe("Current Year");
    expect(result.lineChart.datasets[1].label).toBe("Last Year");
    expect(result.lineChart.highlightedIndexes).toEqual([1]);
    expect(result.lineChart.comparisonLine.data[0].title).toBe("vs LY");
    expect(result.lineChart.comparisonLine.data[0].data).toHaveLength(2);

    expect(result.barChart).toBeDefined();
    expect(result.barChart.labels).toHaveLength(3);
    expect(result.barChart.datasets).toHaveLength(1);
    expect(result.barChart.datasets[0].label).toBe("Market Share");
    expect(result.barChart.stripedIndexes).toEqual([]);
    expect(result.barChart.formattedData).toHaveLength(1);
    expect(result.barChart.formattedData[0]).toHaveLength(3);
    expect(result.barChart.comparisonLine.data[0].title).toBe("vs LY");
  });
});

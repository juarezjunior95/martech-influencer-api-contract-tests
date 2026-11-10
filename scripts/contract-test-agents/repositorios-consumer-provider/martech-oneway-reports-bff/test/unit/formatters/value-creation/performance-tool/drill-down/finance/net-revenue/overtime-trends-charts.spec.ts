import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "../../../../../../../../src/infrastructure/repositories/helpers";

const LINE_DATASOURCE_KEY =
  "value-creation_performance-tool_drill-down_finance_net-revenue_overtime-trends_by-granularity";
const BAR_DATASOURCE_KEY =
  "value-creation_performance-tool_drill-down_finance_net-revenue_overtime-trends_snapshot";

function toArray<T>(value: T | T[]): T[] {
  return value == null ? [] : Array.isArray(value) ? value : [value];
}

describe("Net Revenue Overtime Trends Charts formatter", () => {
  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const jsonataPath = path.join(
      process.cwd(),
      "src/infrastructure/formatters/value-creation/performance-tool/drill-down/finance/net-revenue/overtime-trends-charts.jsonata",
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
            month_label: "Jan",
            ly: 10,
            bu: 10,
            ac: 12,
            ac_vs_ly: 1.1,
            variationDirectionVsLy: "up",
          },
        ],
        [BAR_DATASOURCE_KEY]: [],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result).toBeDefined();
    expect(result.legend).toHaveLength(3);
    expect(result.legend[0].label).toBe("Last Year");
    expect(result.legend[1].label).toBe("Budget");
    expect(result.legend[2].label).toBe("Current");
    expect(Array.isArray(result.lineChart)).toBe(false);
    expect(result.lineChart).toBeDefined();
    expect(toArray(result.lineChart.labels)).toHaveLength(1);
    expect(toArray(result.lineChart.labels)[0]).toBe("Jan");
    expect(result.lineChart.datasets).toHaveLength(3);
    expect(result.lineChart.datasets[0].label).toBe("Current");
    expect(result.lineChart.datasets[1].label).toBe("Last Year");
    expect(result.lineChart.datasets[2].label).toBe("Budget");
    expect(result.barChart).toEqual([]);
  });

  it("should return barChart with data and lineChart empty when only snapshot has data", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [],
        [BAR_DATASOURCE_KEY]: [
          {
            period: "YTD'25",
            ac: 46347.9,
            ac_vs_ly: -1.2,
            ac_vs_bu: null,
            comp_unit_of_measure: "%",
            variationDirectionVsLy: "down",
            variationDirectionVsBu: "down",
          },
        ],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result).toBeDefined();
    expect(result.legend).toHaveLength(3);
    expect(result.lineChart).toEqual([]);
    expect(Array.isArray(result.barChart)).toBe(false);
    expect(result.barChart).toBeDefined();
    const barLabels = toArray(result.barChart.labels);
    expect(barLabels).toHaveLength(1);
    expect(barLabels[0]).toBe("YTD'25");
    expect(result.barChart.datasets).toHaveLength(1);
    expect(toArray(result.barChart.datasets[0].data)).toHaveLength(1);
    expect(result.barChart.comparisonLine.data).toHaveLength(2);
    expect(result.barChart.comparisonLine.data[0].title).toBe("vs LY");
    expect(result.barChart.comparisonLine.data[1].title).toBe("vs BU");
  });

  it("should set trend to positive when ac_vs_ly is zero in comparisonLine", async () => {
    const lineOnlyInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            month_label: "Jan",
            ly: 10,
            bu: 10,
            ac: 10,
            ac_vs_ly: 0,
            variationDirectionVsLy: "up",
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
            ac: 100,
            ac_vs_ly: 0,
            ac_vs_bu: 2.3,
            comp_unit_of_measure: "%",
            variationDirectionVsLy: "up",
            variationDirectionVsBu: "up",
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

  it("should return full structure with legend, lineChart and barChart when data is present", async () => {
    const mockInput = {
      datasources: {
        [LINE_DATASOURCE_KEY]: [
          {
            month_label: "Jan",
            ly: 10,
            bu: 10,
            ac: 12,
            ac_vs_ly: 1.1,
            variationDirectionVsLy: "up",
          },
          {
            month_label: "Feb",
            ly: 12,
            bu: 10,
            ac: 12,
            ac_vs_ly: 0,
            variationDirectionVsLy: "up",
          },
        ],
        [BAR_DATASOURCE_KEY]: [
          {
            period: "YTD'25",
            ac: 46347.9,
            ac_vs_ly: -1.2,
            ac_vs_bu: null,
            comp_unit_of_measure: "%",
            variationDirectionVsLy: "down",
            variationDirectionVsBu: "down",
          },
          {
            period: "BU'26",
            ac: 44876.6,
            ac_vs_ly: -2.6,
            ac_vs_bu: null,
            comp_unit_of_measure: "%",
            variationDirectionVsLy: "down",
            variationDirectionVsBu: "down",
          },
          {
            period: "YTD'26",
            ac: 45914,
            ac_vs_ly: -0.4,
            ac_vs_bu: 2.3,
            comp_unit_of_measure: "%",
            variationDirectionVsLy: "down",
            variationDirectionVsBu: "up",
          },
        ],
      },
    };
    const result = await compiledExpression.evaluate(mockInput);
    expect(result).toBeDefined();
    expect(result.legend).toHaveLength(3);
    expect(result.legend[0].label).toBe("Last Year");
    expect(result.legend[1].label).toBe("Budget");
    expect(result.legend[2].label).toBe("Current");

    expect(result.lineChart).toBeDefined();
    expect(result.lineChart.suggestedMin).toBeDefined();
    expect(result.lineChart.suggestedMax).toBeDefined();
    expect(result.lineChart.labels).toHaveLength(2);
    expect(result.lineChart.labels[0]).toBe("Jan");
    expect(result.lineChart.labels[1]).toBe("Feb");
    expect(result.lineChart.datasets).toHaveLength(3);
    expect(result.lineChart.comparisonLine.data[0].title).toBe("vs LY");
    expect(result.lineChart.comparisonLine.data[0].data).toHaveLength(2);

    expect(result.barChart).toBeDefined();
    expect(result.barChart.labels).toHaveLength(3);
    expect(result.barChart.datasets).toHaveLength(1);
    expect(result.barChart.datasets[0].label).toBe("Net Revenue");
    expect(result.barChart.stripedIndexes).toEqual([1]);
    expect(result.barChart.formattedData).toHaveLength(1);
    expect(result.barChart.formattedData[0]).toHaveLength(3);
    expect(result.barChart.comparisonLine.data[0].title).toBe("vs LY");
    expect(result.barChart.comparisonLine.data[1].title).toBe("vs BU");
  });
});

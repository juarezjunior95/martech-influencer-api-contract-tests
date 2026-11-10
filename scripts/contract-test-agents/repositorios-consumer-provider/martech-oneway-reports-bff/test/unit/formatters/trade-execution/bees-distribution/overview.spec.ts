import Ajv from "ajv";
import addFormats from "ajv-formats";

import { bigNumberComplexSchema } from "@infrastructure/schema/components/big-number";
import {
  barChartSchema,
  lineChartSchema,
} from "@infrastructure/schema/components/chart.schema";
import { loadCompiledJsonata } from "../../../../helpers/jsonata";

describe("Bees Distribution Overview Formatter (JSONata)", () => {
  const compiledExpression = loadCompiledJsonata(
    "src/infrastructure/formatters/trade-execution/bees-distribution/overview.jsonata",
  );

  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  const toArray = (v: any) =>
    Array.isArray(v) ? v : v ? Object.values(v) : [];

  const expectValidSchema = (schema: object, data: unknown, label: string) => {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
      throw new Error(
        `${label} schema validation failed:\n` +
          validate.errors
            ?.map((e) => `${e.instancePath || "root"}: ${e.message}`)
            .join("\n"),
      );
    }
    expect(valid).toBe(true);
  };

  const normalizeBarChart = (chart: any) => {
    const normalized: any = {
      ...chart,
      type: "bar",
      datasets: chart.datasets.map((d: any) => ({
        ...d,
        type: "bar",
      })),
    };
    if (chart.comparisonLine) normalized.comparisonLine = chart.comparisonLine;
    if (chart.formattedData) normalized.formattedData = chart.formattedData;
    return normalized;
  };

  const normalizeLineChart = (chart: any) => {
    const normalized: any = {
      type: "line",
      datasets: chart.datasets.map((d: any) => ({
        ...d,
        type: "line",
        // Convert null values to 0 for schema validation (schema doesn't accept null)
        data: Array.isArray(d.data)
          ? d.data.map((val: any) => (val === null ? 0 : val))
          : d.data,
      })),
      labels: chart.labels,
    };
    if (chart.labels_type) normalized.labels_type = chart.labels_type;
    if (chart.referencialUnitMeasure)
      normalized.referencialUnitMeasure = chart.referencialUnitMeasure;
    if (chart.comparison_unit_of_measure)
      normalized.comparison_unit_of_measure = chart.comparison_unit_of_measure;
    if (chart.formatted_data !== undefined)
      normalized.formatted_data = chart.formatted_data;
    if (chart.variation_caption)
      normalized.variation_caption = chart.variation_caption;
    if (chart.backgroundColor)
      normalized.backgroundColor = chart.backgroundColor;
    return normalized;
  };

  const mapBigNumber = (item: any, title?: string) => {
    const value = item.bigNumber?.value;
    const mapped: any = {
      title,
      bigNumber:
        value && value !== "-"
          ? parseFloat(value.replace(/,/g, ""))
          : undefined,
    };

    const cmp = item.comparison?.number;
    if (cmp?.value && cmp.value !== "-") {
      mapped.variation = parseFloat(cmp.value);
      mapped.variationMeasure = cmp.measure;
      mapped.variationDirection = cmp.color;
    }

    if (item.comparison?.label) {
      mapped.versus =
        item.comparison.label + " " + (item.comparison.value || "");
    }

    return mapped;
  };

  it("formats bar, line, header, legend and big number correctly", async () => {
    let result: any;
    try {
      result = await compiledExpression.evaluate({
        datasources: {
          "bees-distribution-overview": [
            {
              id: "bar-chart",
              config: {
                kpi_title: "Total Distribution",
                kpi_comparison_unit_of_measure: "%",
              },
              data: [
                { year: 2024, ac: 100, ac_vs_ly: 95, performance: "positive" },
                { year: 2025, ac: 120, ac_vs_ly: 110, performance: "positive" },
              ],
            },
            {
              id: "line-chart",
              data: [
                { year: 2024, dt_ini: "2024-01-01", ac: 10 },
                { year: 2024, dt_ini: "2024-02-01", ac: 15 },
                {
                  year: 2025,
                  dt_ini: "2025-01-01",
                  ac: 12,
                  ly: 2.5,
                  performance: "positive",
                },
                {
                  year: 2025,
                  dt_ini: "2025-02-01",
                  ac: 18,
                  ly: 3,
                  performance: "positive",
                },
              ],
            },
            {
              id: "card-chart",
              config: {
                kpi_title: "Total Distribution",
                kpi_comparison_unit_of_measure: "%",
              },
              data: [
                {
                  ac: 110,
                  delta_pct: 3.4,
                  performance: "positive",
                  vs_ly_date: "2024-01-01",
                },
              ],
            },
          ],
        },
      });
    } catch (e: any) {
      console.error("JSONata Error:", e.message);
      console.error("JSONata Error Token:", e.token);
      console.error("JSONata Error Position:", e.position);
      throw e;
    }

    /* ---------- HEADER ---------- */
    expect(result.header).toEqual({
      title: "Total Distribution",
      measure: undefined,
    });

    /* ---------- BAR CHART ---------- */
    const barChart = normalizeBarChart(result.barChart);
    expectValidSchema(barChartSchema, barChart, "Bar chart");

    expect(toArray(barChart.datasets[0].data)).toEqual(
      expect.arrayContaining([100, 120]),
    );
    expect(barChart.labels).toEqual(expect.arrayContaining(["24 AC", "25 AC"]));

    // Check for new fields
    expect(barChart.comparisonLine).toBeDefined();
    expect(barChart.formattedData).toBeDefined();

    /* ---------- BIG NUMBER ---------- */
    const bigNumberItem = result.bigNumberData[0];
    const bigNumber = mapBigNumber(bigNumberItem, result.header.title);

    expectValidSchema(bigNumberComplexSchema, bigNumber, "Big number");

    expect(bigNumberItem.comparison.label).toBe("vs");
    expect(bigNumberItem.comparison.number.value).toBe("3.4");

    /* ---------- LEGEND ---------- */
    expect(result.legend.map((l: any) => l.label)).toEqual(
      expect.arrayContaining(["2024 AC YTD", "2025 AC YTD"]),
    );

    /* ---------- LINE CHART ---------- */
    expect(result.lineChart.suggestedMin).toBeDefined();
    expect(result.lineChart.suggestedMax).toBeDefined();
    expect(result.lineChart.comparisonLine).toBeDefined();
    expect(result.lineChart.formattedData).toBeDefined();

    // Line chart data is now organized by month index (0-11)
    expect(result.lineChart.datasets[0].data).toHaveLength(12);
    expect(result.lineChart.datasets[0].data[0]).toBe(10); // January
    expect(result.lineChart.datasets[0].data[1]).toBe(15); // February
    // Other months should be null
    for (let i = 2; i < 12; i++) {
      expect(result.lineChart.datasets[0].data[i]).toBeNull();
    }

    // 2025-01-01 (Jan, index 0) = 12, 2025-02-01 (Feb, index 1) = 18
    expect(result.lineChart.datasets[1].data).toHaveLength(12);
    expect(result.lineChart.datasets[1].data[0]).toBe(12); // January
    expect(result.lineChart.datasets[1].data[1]).toBe(18); // February
    // Other months should be null
    for (let i = 2; i < 12; i++) {
      expect(result.lineChart.datasets[1].data[i]).toBeNull();
    }

    const lineChart = normalizeLineChart(result.lineChart);
    expectValidSchema(lineChartSchema, lineChart, "Line chart");

    expect(lineChart.datasets.map((d: any) => d.label)).toEqual([
      "2024",
      "2025",
    ]);

    expect(lineChart.labels).toEqual([
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ]);
  });

  it("returns empty BigNumber when card data is missing", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        "bees-distribution-overview": [
          { id: "bar-chart", data: [] },
          { id: "line-chart", data: [] },
          { id: "card-chart", data: [] },
        ],
      },
    });

    expect(result.bigNumberData).toEqual([]);
  });
});

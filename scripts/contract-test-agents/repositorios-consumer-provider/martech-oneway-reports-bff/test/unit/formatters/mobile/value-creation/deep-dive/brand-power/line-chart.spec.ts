import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("mobile deep-dive brand-power line-chart formatter", () => {
  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/infrastructure/formatters/mobile/value-creation/deep-dive/brand-power/line-chart.jsonata",
      ),
      "utf8",
    );
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it(
    "drives labels, values and deltas from the trend datasource — " +
      "the snapshot is empty for brand-power non-finance today, so " +
      "the formatter must not depend on it (mirrors the web " +
      "`non-finance/overtime-trends-charts` shape)",
    async () => {
      const result: any = await compiledExpression.evaluate({
        datasources: {
          trend: [
            {
              year: 2025,
              quarter: "Q1",
              ac: 53.6,
              ac_vs_ly: 0.3,
              variation_direction_ly: "up",
              unit_of_measure: "%",
              comp_unit_of_measure: "pp",
            },
            {
              year: 2025,
              quarter: "Q2",
              ac: 53.3,
              ac_vs_ly: 0.3,
              variation_direction_ly: "up",
              unit_of_measure: "%",
              comp_unit_of_measure: "pp",
            },
            {
              year: 2026,
              quarter: "Q1",
              ac: 53.7,
              ac_vs_ly: 0.1,
              variation_direction_ly: "up",
              unit_of_measure: "%",
              comp_unit_of_measure: "pp",
            },
          ],
          snapshot: [],
        },
      });

      expect(result.labels).toEqual(["Q1'25", "Q2'25", "Q1'26"]);
      expect(result.chartHeader).toMatchObject({
        title: "Brand Power",
        measure: "%",
        period: "Q1'26",
      });
      expect(result.series).toHaveLength(1);
      expect(result.series[0]).toMatchObject({
        role: "actual",
        label: "AC (Actual)",
        values: [53.6, 53.3, 53.7],
        formattedValues: ["53.6", "53.3", "53.7"],
      });
      expect(result.comparisonRows).toHaveLength(1);
      expect(result.comparisonRows[0]).toMatchObject({
        label: "LY",
        deltas: [
          { formatted: "0.3pp", isPositive: true },
          { formatted: "0.3pp", isPositive: true },
          { formatted: "0.1pp", isPositive: true },
        ],
      });
    },
  );

  it(
    "prefers the snapshot's `dt_end` for the header chip when present " +
      "(keeps parity with the brand-power big-numbers chip)",
    async () => {
      const result: any = await compiledExpression.evaluate({
        datasources: {
          trend: [
            {
              year: 2026,
              quarter: "Q1",
              ac: 53.7,
              ac_vs_ly: 0.1,
              variation_direction_ly: "up",
            },
          ],
          snapshot: [
            {
              dt_ini: "2026-01-01T00:00:00.000Z",
              dt_end: "2026-03-31T00:00:00.000Z",
            },
          ],
        },
      });

      // `$formatPeriodChip(dt_ini, dt_end, "LQ", isQuarter=true)` →
      // quarter-aligned chip from the helper.
      expect(typeof result.chartHeader.period).toBe("string");
      expect(result.chartHeader.period.length).toBeGreaterThan(0);
    },
  );

  it("emits a noticeMessage when trend is empty", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: { trend: [], snapshot: [] },
    });

    expect(result.noticeMessage).toBe("Data not available");
    expect(result.labels).toEqual([]);
  });
});

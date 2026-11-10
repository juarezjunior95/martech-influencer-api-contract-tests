import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

describe("mobile deep-dive line-chart formatter", () => {
  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/infrastructure/formatters/mobile/value-creation/deep-dive/shared/line-chart.jsonata",
      ),
      "utf8",
    );
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  it("returns actual, budget and last year series for finance KPIs", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        trend: [
          {
            kpi_name: "volume",
            month_label: "Mar'26",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: 10,
            bu: 9,
            ly: 8,
            ac_vs_ly: 1.2,
            variationDirectionVsLy: "up",
            comp_unit_of_measure: "%",
            unit_of_measure: "K/hL",
          },
        ],
        snapshot: [
          {
            ac_vs_ly: 1.2,
            ac_vs_bu: 0.5,
            variationDirectionVsLy: "up",
            variationDirectionVsBu: "up",
            comp_unit_of_measure: "%",
          },
        ],
      },
    });

    expect(result.labels).toEqual(["Mar'26"]);
    expect(result.series.map((series: any) => series.role)).toEqual([
      "actual",
      "budget",
      "lastYear",
    ]);
    // Finance KPIs (volume / NR / cores) render both `vs LY` and `vs BU` rows; the trend
    // datasource exposes `ac_vs_ly`/`ac_vs_bu` per period, aligned with `labels.length`.
    expect(result.comparisonRows.map((row: any) => row.label)).toEqual([
      "LY",
      "BU",
    ]);
    expect(result.comparisonRows[0].deltas).toHaveLength(result.labels.length);
    expect(result.comparisonRows[1].deltas).toHaveLength(result.labels.length);
    expect(result.comparisonRows[0].deltas[0]).toMatchObject({
      formatted: "1.2%",
      isPositive: true,
    });
  });

  it("reads KPI title from kpi when kpi_name is absent", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: {
        trend: [
          {
            kpi: "cores",
            month_label: "Mar'26",
            dt_end: "2026-03-31T00:00:00.000Z",
            ac: 10,
            bu: 9,
            ly: 8,
            unit_of_measure: "$Mio",
          },
        ],
        snapshot: [],
      },
    });

    expect(result.chartHeader.title).toBe("CORES");
  });

  it("emits a noticeMessage when trend is empty", async () => {
    const result: any = await compiledExpression.evaluate({
      datasources: { trend: [], snapshot: [] },
    });

    expect(result.noticeMessage).toBe("Data not available");
    expect(result.labels).toEqual([]);
  });
});

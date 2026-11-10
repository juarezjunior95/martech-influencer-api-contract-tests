import * as fs from "fs";
import * as path from "path";
import jsonata from "jsonata";
import { registerHelpers } from "@infrastructure/repositories/helpers";

const BY_GRANULARITY_KEY =
  "value-creation_performance-tool_drill-down_finance_cores_overtime-trends_by-granularity";
const SNAPSHOT_KEY =
  "value-creation_performance-tool_drill-down_finance_cores_overtime-trends_snapshot";

const JSONATA_PATH = path.join(
  process.cwd(),
  "src/infrastructure/formatters/value-creation/performance-tool/drill-down/finance/cores/overtime-trends-charts.jsonata",
);

const createLineEntry = (overrides: Record<string, unknown> = {}) => ({
  cores: "cores",
  year: 2026,
  month: 1,
  month_label: "JAN",
  ac: 2316.1,
  ac_vs_ly: 2.9,
  ac_vs_bu: 2,
  ly: 2111.6,
  bu: 2211.3,
  unit_of_measure: "$Mio",
  comp_unit_of_measure: "%",
  period_type: "YTD",
  variationDirectionVsLy: "up",
  variationDirectionVsBu: "up",
  refreshMonthLabel: "",
  lyMonthLabel: "",
  ...overrides,
});

const createSnapshotEntry = (overrides: Record<string, unknown> = {}) => ({
  dt_ini: "2026-01-01T00:00:00.000Z",
  dt_end: "2026-01-01T00:00:00.000Z",
  period: "YTD'26",
  ac: 2316.1,
  ac_vs_ly: 2.9,
  ac_vs_bu: 2,
  unit_of_measure: "$Mio",
  comp_unit_of_measure: "%",
  variationDirectionVsLy: "up",
  variationDirectionVsBu: "up",
  refreshMonthLabel: "Jan'26",
  lyMonthLabel: "Jan'25",
  ...overrides,
});

describe("Cores Overtime Trends Charts formatter", () => {
  let compiledExpression: jsonata.Expression;

  beforeAll(() => {
    const expression = fs.readFileSync(JSONATA_PATH, "utf8");
    compiledExpression = jsonata(expression);
    registerHelpers(compiledExpression);
  });

  const evalExpr = async (datasources: Record<string, unknown[]>) =>
    compiledExpression.evaluate({ datasources });

  it("should return empty state (empty: true) when there is no data (both empty or both missing)", async () => {
    const emptyArrays = await evalExpr({
      [BY_GRANULARITY_KEY]: [],
      [SNAPSHOT_KEY]: [],
    });
    const bothMissing = await evalExpr({});

    expect(emptyArrays).toEqual({ empty: true });
    expect(bothMissing).toEqual({ empty: true });
  });

  it("should return lineChart or barChart empty depending on which datasource has no valid data", async () => {
    const onlySnapshot = await evalExpr({
      [BY_GRANULARITY_KEY]: [],
      [SNAPSHOT_KEY]: [createSnapshotEntry({ period: "YTD'26", ac: 2316.1 })],
    });
    expect(onlySnapshot).not.toEqual({ empty: true });
    expect(onlySnapshot.legend).toHaveLength(3);
    expect(onlySnapshot.lineChart).toEqual([]);
    expect(onlySnapshot.barChart).toBeDefined();
    expect([].concat(onlySnapshot.barChart.labels)).toContain("YTD'26");
    expect([].concat(onlySnapshot.barChart.datasets[0].data)).toHaveLength(1);

    const onlyByGranularity = await evalExpr({
      [BY_GRANULARITY_KEY]: [
        createLineEntry({
          month_label: "JAN",
          ac: 2316.1,
          ly: 2111.6,
          bu: 2211.3,
        }),
      ],
      [SNAPSHOT_KEY]: [],
    });
    expect(onlyByGranularity.lineChart).toBeDefined();
    expect(onlyByGranularity.lineChart.datasets).toHaveLength(3);
    expect([].concat(onlyByGranularity.lineChart.labels)).toHaveLength(1);
    expect(onlyByGranularity.barChart).toEqual([]);

    const snapshotWithNoValidAc = await evalExpr({
      [BY_GRANULARITY_KEY]: [
        createLineEntry({ month_label: "JAN", ac: 2316.1 }),
      ],
      [SNAPSHOT_KEY]: [
        createSnapshotEntry({ ac: null, ac_vs_ly: null, ac_vs_bu: null }),
      ],
    });
    expect(snapshotWithNoValidAc.lineChart).toBeDefined();
    expect(snapshotWithNoValidAc.barChart).toEqual([]);
  });

  it("should set trend to positive when direction is up, negative when down, and positive when value is 0", async () => {
    const result = await evalExpr({
      [BY_GRANULARITY_KEY]: [
        createLineEntry({
          month_label: "JAN",
          ac_vs_ly: 2.9,
          variationDirectionVsLy: "up",
          ac_vs_bu: 2,
          variationDirectionVsBu: "up",
        }),
        createLineEntry({
          month_label: "FEB",
          month: 2,
          ac_vs_ly: -1.2,
          variationDirectionVsLy: "down",
          ac_vs_bu: -0.5,
          variationDirectionVsBu: "down",
        }),
        createLineEntry({
          month_label: "MAR",
          month: 3,
          ac_vs_ly: 0,
          variationDirectionVsLy: "down",
          ac_vs_bu: 0,
          variationDirectionVsBu: "down",
        }),
      ],
      [SNAPSHOT_KEY]: [
        createSnapshotEntry({
          period: "YTD'26",
          ac_vs_ly: 2.9,
          variationDirectionVsLy: "up",
          ac_vs_bu: 2,
          variationDirectionVsBu: "up",
        }),
        createSnapshotEntry({
          period: "BU'26",
          ac_vs_ly: -1.2,
          variationDirectionVsLy: "down",
          ac_vs_bu: -0.5,
          variationDirectionVsBu: "down",
        }),
        createSnapshotEntry({
          period: "LY'26",
          ac_vs_ly: 0,
          variationDirectionVsLy: "down",
          ac_vs_bu: 0,
          variationDirectionVsBu: "down",
        }),
      ],
    });

    const lineVsLy = [].concat(result.lineChart.comparisonLine.data[0].data);
    const lineVsBu = [].concat(result.lineChart.comparisonLine.data[1].data);
    const barVsLy = [].concat(result.barChart.comparisonLine.data[0].data);
    const barVsBu = [].concat(result.barChart.comparisonLine.data[1].data);

    expect(lineVsLy[0].trend).toBe("positive");
    expect(lineVsLy[1].trend).toBe("negative");
    expect(lineVsLy[2].trend).toBe("positive");
    expect(lineVsBu[0].trend).toBe("positive");
    expect(lineVsBu[1].trend).toBe("negative");
    expect(lineVsBu[2].trend).toBe("positive");

    expect(barVsLy[0].trend).toBe("positive");
    expect(barVsLy[1].trend).toBe("negative");
    expect(barVsLy[2].trend).toBe("positive");
    expect(barVsBu[0].trend).toBe("positive");
    expect(barVsBu[1].trend).toBe("negative");
    expect(barVsBu[2].trend).toBe("positive");
  });

  it("should return legend, lineChart and barChart when both datasources have data", async () => {
    const result = await evalExpr({
      [BY_GRANULARITY_KEY]: [
        createLineEntry({
          month_label: "JAN",
          ac: 2316.1,
          ly: 2111.6,
          bu: 2211.3,
        }),
      ],
      [SNAPSHOT_KEY]: [createSnapshotEntry({ period: "YTD'26", ac: 2316.1 })],
    });

    expect(result).not.toEqual({ empty: true });
    expect(result.legend).toHaveLength(3);
    expect(result.legend[0].label).toBe("Last Year");
    expect(result.legend[1].label).toBe("Budget");
    expect(result.legend[2].label).toBe("Current");
    expect(result.lineChart).toBeDefined();
    expect(result.lineChart.datasets).toHaveLength(3);
    expect(result.lineChart.comparisonLine.data).toHaveLength(2);
    expect(result.barChart).toBeDefined();
    expect([].concat(result.barChart.labels)).toHaveLength(1);
    expect([].concat(result.barChart.labels)).toContain("YTD'26");
    expect(result.barChart.comparisonLine.data).toHaveLength(2);
  });
});

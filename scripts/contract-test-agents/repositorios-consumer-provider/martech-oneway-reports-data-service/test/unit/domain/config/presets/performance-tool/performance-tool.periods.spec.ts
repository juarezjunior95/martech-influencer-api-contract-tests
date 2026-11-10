import { buildTimePeriodConfig } from "@domain/config/presets/performance-tool/performance-tool.periods";

describe("buildTimePeriodConfig", () => {
  it("normalizes a legacy KPI-group cutoff to the first day of its month", () => {
    expect(buildTimePeriodConfig("15-07-2026")).toEqual(
      expect.objectContaining({
        default: { value: "YTD", label: "Year to Date" },
        max_dt_end: "2026-07-01",
        default_dt_end: "2026-07-01",
      }),
    );
  });

  it("accepts an ISO cutoff and returns all supported period types", () => {
    const result = buildTimePeriodConfig("2026-12-31");

    expect(result?.values.map(({ value }) => value)).toEqual([
      "YTD",
      "HALF",
      "QTR",
      "R3M",
      "MTH",
      "FY",
    ]);
    expect(result?.max_dt_end).toBe("2026-12-01");
  });
});

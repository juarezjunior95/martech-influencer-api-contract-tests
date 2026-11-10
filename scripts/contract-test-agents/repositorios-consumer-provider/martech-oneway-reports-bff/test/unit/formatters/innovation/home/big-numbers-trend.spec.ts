import fs from "fs";
import path from "path";
import jsonata from "jsonata";

describe("Innovation Home Big Numbers Trend Formatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/innovation/home/big-numbers-trend.jsonata",
  );
  const formatter = jsonata(fs.readFileSync(jsonataPath, "utf8"));

  const evaluate = (data: object[]) =>
    formatter.evaluate({
      datasources: { "innovation_home_big-numbers-trend": data },
    });

  const realData = [
    {
      dt_ini: "2025-01-01T00:00:00.000Z",
      dt_end: "2025-03-01T00:00:00.000Z",
      kpi_name: "innovation_volume",
      unit_of_measure: "k hl",
      comp_unit_of_measure: "%",
      ac: 12345.6,
      ac_vs_ly: 5.2,
      variationDirectionVsLy: "up",
      refreshMonthLabel: "Mar'25",
      lyMonthLabel: "Mar'24",
      vs_ly_label_suffix: "YTD",
    },
    {
      dt_ini: "2025-01-01T00:00:00.000Z",
      dt_end: "2025-06-01T00:00:00.000Z",
      kpi_name: "innovation_volume",
      unit_of_measure: "k hl",
      comp_unit_of_measure: "%",
      ac: 25000.0,
      ac_vs_ly: 8.5,
      variationDirectionVsLy: "up",
      refreshMonthLabel: "Jun'25",
      lyMonthLabel: "Jun'24",
      vs_ly_label_suffix: "YTD",
    },
    {
      dt_ini: "2025-01-01T00:00:00.000Z",
      dt_end: "2025-09-01T00:00:00.000Z",
      kpi_name: "innovation_volume",
      unit_of_measure: "k hl",
      comp_unit_of_measure: "%",
      ac: 38000.0,
      ac_vs_ly: 10.3,
      variationDirectionVsLy: "up",
      refreshMonthLabel: "Sep'25",
      lyMonthLabel: "Sep'24",
      vs_ly_label_suffix: "YTD",
    },
  ];

  it("should use the most recent record (biggest dt_end) for bigNumberData", async () => {
    const result: any = await evaluate(realData);

    expect(result.bigNumberData[0].bigNumber.value).toBe("10.3");
    expect(result.bigNumberData[0].bigNumber.measure).toBe("%");
    expect(result.bigNumberData[0].secondaryInfo.value).toBe("38,000.0");
    expect(result.chartPeriod).toBe("Sep'25 YTD");
  });

  it("should include all records for chartLineData in ascending order", async () => {
    const result: any = await evaluate(realData);

    expect(result.chartLineData).toHaveLength(3);
    expect(result.chartLineData).toEqual([12345.6, 25000.0, 38000.0]);
  });

  it("should map trend: up -> positive, down -> negative", async () => {
    const upData = [{ ...realData[2], variationDirectionVsLy: "up" }];
    const downData = [{ ...realData[2], variationDirectionVsLy: "down" }];

    const upResult: any = await evaluate(upData);
    const downResult: any = await evaluate(downData);

    expect(upResult.bigNumberData[0].bigNumber.trend).toBe("positive");
    expect(downResult.bigNumberData[0].bigNumber.trend).toBe("negative");
  });

  it.each([
    ["innovation_volume", "Innovation Volume"],
    ["innovation_nr", "Innovation Net Revenue"],
    ["unknown_kpi", "unknown_kpi"],
  ])(
    'kpi_name "%s" should return chartTitle "%s"',
    async (kpiName, expected) => {
      const data = realData.map((r) => ({ ...r, kpi_name: kpiName }));
      const result: any = await evaluate(data);

      expect(result.chartTitle).toBe(expected);
    },
  );

  it("should have hardcoded LY for comparison value", async () => {
    const result: any = await evaluate(realData);

    expect(result.bigNumberData[0].comparison).toEqual({
      label: "vs",
      value: "LY",
    });
  });

  it("should return '-' for null values", async () => {
    const dataWithNulls = [
      { ...realData[0], ac_vs_ly: null, ac: null },
      { ...realData[1], ac_vs_ly: null, ac: null },
    ];

    const result: any = await evaluate(dataWithNulls);

    expect(result.bigNumberData[0].bigNumber.value).toBe("-");
    expect(result.bigNumberData[0].secondaryInfo.value).toBe("-");
  });

  it("should handle negative values correctly", async () => {
    const dataWithNegative = [
      { ...realData[0], ac_vs_ly: -5.5, variationDirectionVsLy: "down" },
      { ...realData[1], ac_vs_ly: -3.2, variationDirectionVsLy: "down" },
    ];

    const result: any = await evaluate(dataWithNegative);

    expect(result.bigNumberData[0].bigNumber.value).toBe("-3.2");
    expect(result.bigNumberData[0].bigNumber.trend).toBe("negative");
  });

  it("should sort data by dt_end ascending before processing", async () => {
    // Provide data in random order
    const unsortedData = [realData[2], realData[0], realData[1]];

    const result: any = await evaluate(unsortedData);

    expect(result.chartPeriod).toBe("Sep'25 YTD");
    expect(result.chartLineData).toEqual([12345.6, 25000.0, 38000.0]);
  });

  it("should include single record in chartLineData", async () => {
    const singleRecord = [realData[2]];

    const result: any = await evaluate(singleRecord);

    expect(result.chartLineData).toEqual([38000.0]);
  });

  it("should return array when multiple kpis exist", async () => {
    const multiKpiData = [
      ...realData,
      { ...realData[0], kpi_name: "innovation_nr", ac: 5000.0 },
      { ...realData[1], kpi_name: "innovation_nr", ac: 10000.0 },
      { ...realData[2], kpi_name: "innovation_nr", ac: 15000.0 },
    ];

    const result: any = await evaluate(multiKpiData);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);

    // innovation_volume comes first (sorted descending alphabetically)
    expect(result[0].chartTitle).toBe("Innovation Volume");
    expect(result[0].chartLineData).toEqual([12345.6, 25000.0, 38000.0]);

    // innovation_nr comes second
    expect(result[1].chartTitle).toBe("Innovation Net Revenue");
    expect(result[1].chartLineData).toEqual([5000.0, 10000.0, 15000.0]);
  });

  it("should return undefined for empty datasource", async () => {
    const result: any = await evaluate([]);

    expect(result).toBeUndefined();
  });

  it("should include null ac values in chartLineData", async () => {
    const dataWithNullAc = [
      { ...realData[0], ac: null },
      { ...realData[1], ac: 25000.0 },
      { ...realData[2], ac: null },
    ];

    const result: any = await evaluate(dataWithNullAc);

    expect(result.chartLineData).toEqual([null, 25000.0, null]);
  });
});

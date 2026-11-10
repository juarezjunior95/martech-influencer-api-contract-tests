import fs from "fs";
import path from "path";
import jsonata from "jsonata";

describe("Trade Execution Home Formatter", () => {
  const jsonataPath = path.join(
    process.cwd(),
    "src/infrastructure/formatters/trade-execution/home/home.jsonata",
  );
  const formatter = jsonata(fs.readFileSync(jsonataPath, "utf8"));

  const evaluate = (data: object[]) =>
    formatter.evaluate({
      datasources: { "trade-execution_home_home": data },
    });

  const realData = [
    {
      dt_ini: "2025-04-01T00:00:00.000Z",
      dt_end: "2025-04-01T00:00:00.000Z",
      segment: "Mega Brand",
      ac: "8.9",
      ac_vs_ly: 8.1,
      comp_unit_of_measure: "%",
      variationDirectionVsLy: "up",
      refreshMonthLabel: "Apr'25",
      lyMonthLabel: "Apr'24",
    },
    {
      dt_ini: "2025-05-01T00:00:00.000Z",
      dt_end: "2025-05-01T00:00:00.000Z",
      segment: "Mega Brand",
      ac: "9.2",
      ac_vs_ly: 9.9,
      comp_unit_of_measure: "%",
      variationDirectionVsLy: "up",
      refreshMonthLabel: "May'25",
      lyMonthLabel: "May'24",
    },
    {
      dt_ini: "2025-06-01T00:00:00.000Z",
      dt_end: "2025-06-01T00:00:00.000Z",
      segment: "Mega Brand",
      ac: "8.7",
      ac_vs_ly: 3.6,
      comp_unit_of_measure: "%",
      variationDirectionVsLy: "up",
      refreshMonthLabel: "Jun'25",
      lyMonthLabel: "Jun'24",
    },
    // Most recent record (used for big number display)
    {
      dt_ini: "2025-07-01T00:00:00.000Z",
      dt_end: "2025-07-01T00:00:00.000Z",
      segment: "Mega Brand",
      ac: "-9.3",
      ac_vs_ly: 7.3,
      comp_unit_of_measure: "%",
      variationDirectionVsLy: "up",
      refreshMonthLabel: "Jul'25",
      lyMonthLabel: "Jul'24",
    },
    // Duplicate of most recent (should be excluded from chart)
    {
      dt_ini: "2025-07-01T00:00:00.000Z",
      dt_end: "2025-07-01T00:00:00.000Z",
      segment: "Mega Brand",
      ac: "-9.3",
      ac_vs_ly: 7.3,
      comp_unit_of_measure: "%",
      variationDirectionVsLy: "up",
      refreshMonthLabel: "Jul'25",
      lyMonthLabel: "Jul'24",
    },
  ];

  it("should use most recent record for big number and exclude duplicates from chart", async () => {
    const result: any = await evaluate(realData);

    expect(result.bigNumberData[0].bigNumber.value).toBe("7.3");
    expect(result.bigNumberData[0].secondaryInfo.value).toBe("-9.3");

    expect(result.chartLineData).toHaveLength(4);
    expect(result.chartLineData).toEqual(["8.9", "9.2", "8.7", "-9.3"]);
  });

  it("should map trend: up -> positive, down -> negative", async () => {
    const upData = [
      {
        ...realData[3],
        variationDirectionVsLy: "up",
      },
    ];
    const downData = [
      {
        ...realData[3],
        variationDirectionVsLy: "down",
      },
    ];

    const upResult: any = await evaluate(upData);
    const downResult: any = await evaluate(downData);

    expect(upResult.bigNumberData[0].bigNumber.trend).toBe("positive");
    expect(downResult.bigNumberData[0].bigNumber.trend).toBe("negative");
  });

  it.each([
    ["Mega Brand", "Total Megabrands Distribution"],
    ["Megabrands", "Total Megabrands Distribution"],
    ["megabrand", "Total Megabrands Distribution"],
    ["MEGA BRAND", "Total Megabrands Distribution"],
    ["All", "Total Distribution"],
    ["all", "Total Distribution"],
    ["Core", "Total Distribution"],
  ])(
    'segment "%s" should return chartTitle "%s"',
    async (segment, expected) => {
      const data = realData.map((r) => ({ ...r, segment }));
      const result: any = await evaluate(data);

      expect(result.chartTitle).toBe(expected);
    },
  );

  it("should format chartPeriod from most recent record", async () => {
    const result: any = await evaluate(realData);

    expect(result.chartPeriod).toBe("Jul'25 - YTD");
  });

  it("should extract comparison from YTD record", async () => {
    const result: any = await evaluate(realData);

    expect(result.bigNumberData[0].comparison).toEqual({
      label: "vs",
      value: "LY",
    });
  });

  it("should show one decimal for whole-number ac_vs_ly and preserve decimals otherwise", async () => {
    const whole = [
      {
        dt_ini: "2026-01-01T00:00:00.000Z",
        dt_end: "2026-02-01T00:00:00.000Z",
        segment: "All",
        ac: "2.2",
        ac_vs_ly: 1,
        comp_unit_of_measure: "%",
        variationDirectionVsLy: "up",
        refreshMonthLabel: "Feb'26",
        lyMonthLabel: "Feb'25",
      },
    ];
    const fractional = [{ ...whole[0], ac_vs_ly: 1.1 }];

    expect((await evaluate(whole)).bigNumberData[0].bigNumber.value).toBe(
      "1.0",
    );
    expect((await evaluate(fractional)).bigNumberData[0].bigNumber.value).toBe(
      "1.1",
    );
  });
});

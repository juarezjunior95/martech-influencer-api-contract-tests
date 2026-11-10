import { getPosToolOverviewPeriods } from "@domain/config/presets/category/pos-tool/pos-tool-timeframe.model";
import { posToolOverviewPeriodsHandler } from "@domain/config/presets/pos-tool-overview-periods/pos-tool-overview-periods.handler";
import { PosPeriodPresetValue } from "@domain/config/presets/pos-periods/pos-periods.handler";

describe("getPosToolOverviewPeriods", () => {
  it("returns R12M-first values with dynamic labels and descriptive full names", () => {
    const result = getPosToolOverviewPeriods();

    expect(result.enabled).toBe(true);
    expect(result.default).toEqual({
      value: "R12M",
      label: expect.stringMatching(/^R12M Q\d'\d{2}$/),
      full: "Rolling 12 Months (R12M)",
    });
    expect(result.values).toEqual([
      {
        value: "R12M",
        label: expect.stringMatching(/^R12M Q\d'\d{2}$/),
        full: "Rolling 12 Months (R12M)",
      },
      {
        value: "QTD",
        label: expect.stringMatching(/^QTD Q\d'\d{2}$/),
        full: "Quarter (QTR)",
      },
    ]);
  });
});

describe("posToolOverviewPeriodsHandler", () => {
  it("emits pos-tool-overview-periods with R12M default", () => {
    const result = posToolOverviewPeriodsHandler.handle({
      "pos-tool-overview-periods": {},
    });
    const posPeriods = result[
      "pos-tool-overview-periods"
    ] as PosPeriodPresetValue;

    expect(posPeriods.enabled).toBe(true);
    expect(posPeriods.default.value).toBe("R12M");
    expect(posPeriods.values.map((row) => row.value)).toEqual(["R12M", "QTD"]);
  });

  it("declares time-frame datasets", () => {
    expect(posToolOverviewPeriodsHandler.datasets()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: expect.any(String) }),
      ]),
    );
  });
});

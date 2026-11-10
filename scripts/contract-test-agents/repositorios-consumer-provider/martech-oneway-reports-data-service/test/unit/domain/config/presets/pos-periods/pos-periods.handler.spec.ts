import {
  posPeriodsHandler,
  PosPeriodPresetValue,
} from "@domain/config/presets/pos-periods/pos-periods.handler";

describe("posPeriodsHandler", () => {
  it("emits QTD and R12M with POS Book labels and empty full, default QTD", () => {
    const result = posPeriodsHandler.handle({ "pos-periods": {} });
    const posPeriods = result["pos-periods"] as PosPeriodPresetValue;

    expect(posPeriods.enabled).toBe(true);
    expect(posPeriods.values).toEqual([
      { value: "QTD", label: "Quarter", full: "" },
      { value: "R12M", label: "R12M", full: "" },
    ]);
    expect(posPeriods.default).toEqual({
      value: "QTD",
      label: "Quarter",
      full: "",
    });
  });
});

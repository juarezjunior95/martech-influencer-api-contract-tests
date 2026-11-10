import {
  periodsHandler,
  PeriodPresetValue,
} from "@domain/config/presets/periods/periods.handler";

describe("periodsHandler", () => {
  it("emits the default registry (QTD + R12M, no YTD) when scope is omitted", () => {
    const result = periodsHandler.handle({ periods: {} });
    const periods = result.periods as PeriodPresetValue;

    expect(periods.enabled).toBe(true);
    expect(periods.values).toEqual([
      { value: "QTD", label: "QTD", full: "Quarter To Date (QTD)" },
      { value: "R12M", label: "R12M", full: "Rolling 12 Months (R12M)" },
    ]);
    expect(periods.default).toEqual({
      value: "QTD",
      label: "QTD",
      full: "Quarter To Date (QTD)",
    });
  });

  it('emits only YTD when scope is exactly "YTD"', () => {
    const result = periodsHandler.handle({ periods: { scope: "YTD" } });
    const periods = result.periods as PeriodPresetValue;

    expect(periods.values).toEqual([
      { value: "YTD", label: "YTD", full: "Year To Date (YTD)" },
    ]);
    expect(periods.default).toEqual({
      value: "YTD",
      label: "YTD",
      full: "Year To Date (YTD)",
    });
  });

  it('emits only QTD when scope is exactly "QTD"', () => {
    const result = periodsHandler.handle({ periods: { scope: "QTD" } });
    const periods = result.periods as PeriodPresetValue;

    expect(periods.values.map((v) => v.value)).toEqual(["QTD"]);
    expect(periods.default.value).toBe("QTD");
  });

  it('emits only R12M when scope is exactly "R12M"', () => {
    const result = periodsHandler.handle({ periods: { scope: "R12M" } });
    const periods = result.periods as PeriodPresetValue;

    expect(periods.values.map((v) => v.value)).toEqual(["R12M"]);
    expect(periods.default.value).toBe("R12M");
  });

  it("is case-insensitive on the single-id scope", () => {
    const result = periodsHandler.handle({ periods: { scope: "ytd" } });
    const periods = result.periods as PeriodPresetValue;

    expect(periods.values.map((v) => v.value)).toEqual(["YTD"]);
  });

  it("falls back to the default when scope is a multi-id string", () => {
    const result = periodsHandler.handle({
      periods: { scope: "QTD,YTD" },
    });
    const periods = result.periods as PeriodPresetValue;

    expect(periods.values.map((v) => v.value)).toEqual(["QTD", "R12M"]);
  });

  it("falls back to the default when scope is an unknown id", () => {
    const result = periodsHandler.handle({
      periods: { scope: "MONTHLY" },
    });
    const periods = result.periods as PeriodPresetValue;

    expect(periods.values.map((v) => v.value)).toEqual(["QTD", "R12M"]);
  });

  it("collapses default to {} when noDefault=true", () => {
    const result = periodsHandler.handle({
      periods: { noDefault: true, scope: "R12M" },
    });
    const periods = result.periods as PeriodPresetValue;

    expect(periods.default).toEqual({});
    expect(periods.values).toHaveLength(1);
  });
});

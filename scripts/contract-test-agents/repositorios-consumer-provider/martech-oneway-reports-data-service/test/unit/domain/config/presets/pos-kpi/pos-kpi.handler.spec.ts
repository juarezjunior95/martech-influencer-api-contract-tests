import {
  posKpiHandler,
  PosKpiPresetValue,
} from "@domain/config/presets/pos-kpi/pos-kpi.handler";

describe("posKpiHandler", () => {
  it("emits Participation / Occasions / Servings with default participation", () => {
    const result = posKpiHandler.handle({ "pos-kpi": {} });
    const posKpi = result["pos-kpi"] as PosKpiPresetValue;

    expect(posKpi.enabled).toBe(true);
    expect(posKpi.values).toEqual([
      { value: "participation", label: "Participation" },
      { value: "occasions", label: "Occasions" },
      { value: "servings", label: "Servings" },
    ]);
    expect(posKpi.default).toEqual({
      value: "participation",
      label: "Participation",
    });
  });
});

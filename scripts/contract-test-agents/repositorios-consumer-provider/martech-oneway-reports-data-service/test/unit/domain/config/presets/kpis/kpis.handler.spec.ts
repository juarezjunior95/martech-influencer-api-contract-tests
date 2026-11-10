import { BadRequestException } from "@nestjs/common";
import { kpisHandler } from "@domain/config/presets/kpis/kpis.handler";
import type { KpisPresetValue } from "@domain/config/presets/kpis/kpis.types";

describe("kpisHandler", () => {
  it("Returns performance_tool data when utilizing the performance_tool group", () => {
    const result = kpisHandler.handle({
      kpis: { kpiGroups: ["performance_tool"] },
    });
    const kpis = result.kpis as KpisPresetValue;

    expect(kpis.enabled).toBe(true);
    expect(kpis.values.map((v) => v.value)).toEqual([
      "volume",
      "nr",
      "cores",
      "market_share",
      "power",
    ]);
    expect(kpis.default).toEqual({
      value: "volume",
      label: "Volume",
      full: "",
    });
  });

  it("returns innovation_hub KPIs with MACO margin disabled", () => {
    const result = kpisHandler.handle({
      kpis: { kpiGroups: ["innovation_hub"] },
    });
    const kpis = result.kpis as KpisPresetValue;

    expect(kpis.values.map((v) => v.value)).toEqual([
      "volume",
      "nr",
      "maco",
      "maco_margin",
    ]);
    expect(
      kpis.values.filter((v) => v.isDisabled === true).map((v) => v.value),
    ).toEqual(["maco_margin"]);
    expect(kpis.default).toEqual({
      value: "volume",
      label: "Volume",
      full: "",
    });
  });

  it("merges groups in order", () => {
    const result = kpisHandler.handle({
      kpis: { kpiGroups: ["innovation", "audience_targeting"] },
    });
    const kpis = result.kpis as KpisPresetValue;

    expect(kpis.values.map((v) => v.value)).toEqual([
      "volume",
      "nr",
      "maco",
      "p4w",
      "occasions",
      "power",
    ]);
    expect(kpis.default.value).toBe("volume");
  });

  it("treats group ids case-insensitively", () => {
    const result = kpisHandler.handle({
      kpis: { kpiGroups: ["PERFORMANCE_TOOL"] },
    });
    const kpis = result.kpis as KpisPresetValue;

    expect(kpis.values).toHaveLength(5);
    expect(kpis.default.value).toBe("volume");
  });

  it("ignores unknown groups without failing", () => {
    const result = kpisHandler.handle({
      kpis: { kpiGroups: ["unknown_group", "audience_targeting"] },
    });
    const kpis = result.kpis as KpisPresetValue;

    expect(kpis.values.map((v) => v.value)).toEqual([
      "p4w",
      "occasions",
      "power",
    ]);
  });

  it("throws when kpi_groups is missing or empty", () => {
    expect(() => kpisHandler.handle({ kpis: { kpiGroups: [] } })).toThrow(
      BadRequestException,
    );
    expect(() =>
      kpisHandler.handle({ kpis: {} as { kpiGroups: string[] } }),
    ).toThrow(BadRequestException);
    expect(() => kpisHandler.handle({})).toThrow(BadRequestException);
  });

  it("returns empty default when every group is unknown", () => {
    const result = kpisHandler.handle({
      kpis: { kpiGroups: ["totally_unknown"] },
    });
    const kpis = result.kpis as KpisPresetValue;

    expect(kpis.values).toEqual([]);
    expect(kpis.default).toEqual({});
  });
});

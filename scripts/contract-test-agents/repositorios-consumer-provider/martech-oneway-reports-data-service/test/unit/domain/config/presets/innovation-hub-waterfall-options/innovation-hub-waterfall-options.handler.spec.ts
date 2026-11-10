import { BadRequestException } from "@nestjs/common";
import { innovationHubWaterfallOptionsHandler } from "@domain/config/presets/innovation-hub-waterfall-options/innovation-hub-waterfall-options.handler";
import type { InnovationHubWaterfallOptionsPresetValue } from "@domain/config/presets/innovation-hub-waterfall-options/innovation-hub-waterfall-options.types";

const PRESET_KEY = "innovation-hub-waterfall-options" as const;

function unwrap(
  result: Record<string, unknown>,
): InnovationHubWaterfallOptionsPresetValue {
  const inner = result[PRESET_KEY];
  if (!inner || typeof inner !== "object") {
    throw new Error(`Expected result["${PRESET_KEY}"]`);
  }
  return inner as InnovationHubWaterfallOptionsPresetValue;
}

describe("innovationHubWaterfallOptionsHandler", () => {
  it("returns volume KPI scope map with global brand-country ladder", () => {
    const result = innovationHubWaterfallOptionsHandler.handle({
      [PRESET_KEY]: { kpi: "volume" },
    });
    const block = unwrap(result);

    expect(block.enabled).toBe(true);
    expect(Object.keys(block.values).sort()).toEqual([
      "brand",
      "country",
      "global",
    ]);
    expect(block.default).toEqual(block.values.global);
    expect(block.values.global?.values.map((v) => v.value)).toEqual([
      "brand",
      "country",
    ]);
    expect(block.values.global?.default).toEqual({
      label: "Country",
      value: "country",
    });
    expect(block.values.country?.values.map((v) => v.value)).toEqual(["brand"]);
    expect(block.values.brand?.values.map((v) => v.value)).toEqual(["sku"]);
  });

  it("aliases nr to the same option table as volume", () => {
    const nr = unwrap(
      innovationHubWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "nr" },
      }),
    );
    const vol = unwrap(
      innovationHubWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "volume" },
      }),
    );
    expect(nr.values).toEqual(vol.values);
  });

  it("returns an empty map for unknown KPI with empty default", () => {
    const block = unwrap(
      innovationHubWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "unknown_kpi" },
      }),
    );
    expect(block.values).toEqual({});
    expect(block.default).toEqual({});
  });

  it("throws when kpi is missing or blank", () => {
    expect(() =>
      innovationHubWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "" },
      }),
    ).toThrow(BadRequestException);
    expect(() =>
      innovationHubWaterfallOptionsHandler.handle({
        [PRESET_KEY]: {} as { kpi: string },
      }),
    ).toThrow(BadRequestException);
    expect(() => innovationHubWaterfallOptionsHandler.handle({})).toThrow(
      BadRequestException,
    );
  });
});

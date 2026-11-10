import { BadRequestException } from "@nestjs/common";
import { commercialResultsWaterfallOptionsHandler } from "@domain/config/presets/commercial-results-waterfall-options/commercial-results-waterfall-options.handler";
import type { CommercialResultsWaterfallOptionsPresetValue } from "@domain/config/presets/commercial-results-waterfall-options/commercial-results-waterfall-options.types";

const PRESET_KEY = "commercial-results-waterfall-options" as const;

function unwrap(
  result: Record<string, unknown>,
): CommercialResultsWaterfallOptionsPresetValue {
  const inner = result[PRESET_KEY];
  if (!inner || typeof inner !== "object") {
    throw new Error(`Expected result["${PRESET_KEY}"]`);
  }
  return inner as CommercialResultsWaterfallOptionsPresetValue;
}

describe("commercialResultsWaterfallOptionsHandler", () => {
  it("returns volume KPI scope map and default equal to the first scope block", () => {
    const result = commercialResultsWaterfallOptionsHandler.handle({
      [PRESET_KEY]: { kpi: "volume" },
    });
    const block = unwrap(result);

    expect(block.enabled).toBe(true);
    expect(Object.keys(block.values)).toEqual(["global", "brand", "sub_brand"]);
    expect(block.default).toEqual(block.values.global);
    expect(block.values.global?.values.map((v) => v.value)).toEqual([
      "region",
      "channel",
      "brand",
      "pack_type",
    ]);
  });

  it("returns brand scope with sub_brand option", () => {
    const block = unwrap(
      commercialResultsWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "volume" },
      }),
    );
    expect(block.values.brand?.values.map((v) => v.value)).toEqual([
      "region",
      "channel",
      "brand",
      "pack_type",
      "sub_brand",
    ]);
  });

  it("returns sub_brand scope with sub_brand and sku options", () => {
    const block = unwrap(
      commercialResultsWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "volume" },
      }),
    );
    expect(block.values.sub_brand?.values.map((v) => v.value)).toEqual([
      "region",
      "channel",
      "brand",
      "pack_type",
      "sub_brand",
      "sku",
    ]);
  });

  it("treats kpi case-insensitively", () => {
    const block = unwrap(
      commercialResultsWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "VOLUME" },
      }),
    );
    expect(block.values.global).toBeDefined();
  });

  it("returns the Commercial Results scope map for Net Revenue", () => {
    const block = unwrap(
      commercialResultsWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "nr" },
      }),
    );

    expect(Object.keys(block.values)).toEqual(["global", "brand", "sub_brand"]);
    expect(block.default).toEqual(block.values.global);
    expect(block.values.global?.values.map((v) => v.value)).toEqual([
      "region",
      "channel",
      "brand",
      "pack_type",
    ]);
  });

  it("returns an empty map for unknown KPI with empty default", () => {
    const block = unwrap(
      commercialResultsWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "unknown_kpi" },
      }),
    );
    expect(block.values).toEqual({});
    expect(block.default).toEqual({});
  });

  it("throws when kpi is missing or blank", () => {
    expect(() =>
      commercialResultsWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "" },
      }),
    ).toThrow(BadRequestException);
    expect(() =>
      commercialResultsWaterfallOptionsHandler.handle({
        [PRESET_KEY]: {} as { kpi: string },
      }),
    ).toThrow(BadRequestException);
    expect(() => commercialResultsWaterfallOptionsHandler.handle({})).toThrow(
      BadRequestException,
    );
  });
});

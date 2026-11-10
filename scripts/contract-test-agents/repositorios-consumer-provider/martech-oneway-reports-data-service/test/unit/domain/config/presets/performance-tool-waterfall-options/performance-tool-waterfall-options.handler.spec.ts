import { BadRequestException } from "@nestjs/common";
import { performanceToolWaterfallOptionsHandler } from "@domain/config/presets/performance-tool-waterfall-options/performance-tool-waterfall-options.handler";
import type { PerformanceToolWaterfallOptionsPresetValue } from "@domain/config/presets/performance-tool-waterfall-options/performance-tool-waterfall-options.types";

const PRESET_KEY = "performance-tool-waterfall-options" as const;

function unwrap(
  result: Record<string, unknown>,
): PerformanceToolWaterfallOptionsPresetValue {
  const inner = result[PRESET_KEY];
  if (!inner || typeof inner !== "object") {
    throw new Error(`Expected result["${PRESET_KEY}"]`);
  }
  return inner as PerformanceToolWaterfallOptionsPresetValue;
}

describe("performanceToolWaterfallOptionsHandler", () => {
  it("returns volume KPI scope map and default equal to the first scope block", () => {
    const result = performanceToolWaterfallOptionsHandler.handle({
      [PRESET_KEY]: { kpi: "volume" },
    });
    const block = unwrap(result);

    expect(block.enabled).toBe(true);
    expect(Object.keys(block.values)).toEqual([
      "global",
      "portfolio",
      "beer_price_segment",
      "brand",
      "country",
      "beyond_beer_global",
      "beyond_beer_country",
    ]);
    expect(block.default).toEqual(block.values.global);
    expect(block.values.global?.values.map((v) => v.value)).toEqual([
      "portfolio",
      "beer_price_segment",
      "brand",
      "country",
    ]);
  });

  it("aliases nr and cores to the same option table as volume", () => {
    const nr = unwrap(
      performanceToolWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "nr" },
      }),
    );
    const vol = unwrap(
      performanceToolWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "volume" },
      }),
    );
    expect(nr.values).toEqual(vol.values);
  });

  it("returns market_share scoped options including eur_zone", () => {
    const block = unwrap(
      performanceToolWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "market_share" },
      }),
    );
    expect(Object.keys(block.values).sort()).toEqual([
      "brand",
      "country",
      "eur_zone",
      "global",
    ]);
    expect(block.values.global?.default).toEqual({
      label: "Country",
      value: "country",
    });
    expect(block.values.global?.values.map((v) => v.value)).toEqual([
      "country",
    ]);
  });

  it("returns official market share v2 scoped options per product spec", () => {
    const block = unwrap(
      performanceToolWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "market_share_official" },
      }),
    );
    expect(Object.keys(block.values).sort()).toEqual([
      "beer_price_segment",
      "brand",
      "country",
      "eur_zone",
      "global",
    ]);
    expect(block.values.global?.values.map((v) => v.value)).toEqual([
      "country",
      "beer_price_segment",
      "brand",
    ]);
    expect(block.values.global?.default).toEqual({
      label: "Country",
      value: "country",
    });
    expect(block.values.country?.values.map((v) => v.value)).toEqual([
      "beer_price_segment",
      "brand",
    ]);
    expect(block.values.country?.default).toEqual({
      label: "Brand",
      value: "brand",
    });
    expect(block.values.beer_price_segment?.values.map((v) => v.value)).toEqual(
      ["brand"],
    );
    expect(block.values.beer_price_segment?.default).toEqual({
      label: "Brand",
      value: "brand",
    });
    expect(block.values.brand?.values.map((v) => v.value)).toEqual([
      "sub_brand",
    ]);
    expect(block.values.brand?.default).toEqual({
      label: "Sub-Brand",
      value: "sub_brand",
    });
    expect(block.values.eur_zone?.values.map((v) => v.value)).toEqual([
      "brand",
    ]);
    expect(block.values.eur_zone?.default).toEqual({
      label: "Brand",
      value: "brand",
    });
  });

  it("keeps market_share and market_share_official option tables isolated", () => {
    const v1 = unwrap(
      performanceToolWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "market_share" },
      }),
    );
    const v2 = unwrap(
      performanceToolWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "market_share_official" },
      }),
    );
    expect(v1.values).not.toEqual(v2.values);
  });

  it("matches power KPI structure", () => {
    const block = unwrap(
      performanceToolWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "power" },
      }),
    );
    expect(Object.keys(block.values)).toEqual([
      "global",
      "country",
      "region",
      "portfolio",
    ]);
    expect(block.default).toEqual(block.values.global);
    expect(block.values.country?.values).toEqual([
      { label: "Brand", value: "brand" },
      { label: "Portfolio", value: "portfolio" },
      { label: "Region", value: "region" },
    ]);
    expect(block.values.region?.values).toEqual([
      { label: "Brand", value: "brand" },
      { label: "Portfolio", value: "portfolio" },
      { label: "Drivers", value: "drivers" },
    ]);
    expect(block.values.region?.default).toEqual({
      label: "Brand",
      value: "brand",
    });
  });

  it("treats kpi case-insensitively", () => {
    const block = unwrap(
      performanceToolWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "MARKET_SHARE" },
      }),
    );
    expect(block.values.eur_zone).toBeDefined();
  });

  it("returns an empty map for unknown KPI with empty default", () => {
    const block = unwrap(
      performanceToolWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "unknown_kpi" },
      }),
    );
    expect(block.values).toEqual({});
    expect(block.default).toEqual({});
  });

  it("throws when kpi is missing or blank", () => {
    expect(() =>
      performanceToolWaterfallOptionsHandler.handle({
        [PRESET_KEY]: { kpi: "" },
      }),
    ).toThrow(BadRequestException);
    expect(() =>
      performanceToolWaterfallOptionsHandler.handle({
        [PRESET_KEY]: {} as { kpi: string },
      }),
    ).toThrow(BadRequestException);
    expect(() => performanceToolWaterfallOptionsHandler.handle({})).toThrow(
      BadRequestException,
    );
  });
});

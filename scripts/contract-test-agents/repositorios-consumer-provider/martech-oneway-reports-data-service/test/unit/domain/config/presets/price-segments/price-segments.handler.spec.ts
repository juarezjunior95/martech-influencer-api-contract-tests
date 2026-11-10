import {
  priceSegmentsHandler,
  PriceSegmentsPresetValue,
} from "@domain/config/presets/price-segments/price-segments.handler";

describe("priceSegmentsHandler", () => {
  it("emits Core Co / Premium Co under a single Ungrouped block with empty default", () => {
    const result = priceSegmentsHandler.handle({ "price-segments": {} });
    const priceSegments = result["price-segments"] as PriceSegmentsPresetValue;

    expect(priceSegments.enabled).toBe(true);
    expect(priceSegments.values).toEqual([
      {
        group: "Ungrouped",
        values: [
          { value: "core_co", label: "Core Co" },
          { value: "premium_co", label: "Premium Co" },
        ],
      },
    ]);
    expect(priceSegments.default).toEqual({});
  });
});

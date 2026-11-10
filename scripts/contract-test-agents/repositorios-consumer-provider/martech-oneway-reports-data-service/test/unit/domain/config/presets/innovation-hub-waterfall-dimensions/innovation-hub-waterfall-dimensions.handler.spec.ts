import { innovationHubWaterfallDimensionsHandler } from "@domain/config/presets/innovation-hub-waterfall-dimensions/innovation-hub-waterfall-dimensions.handler";
import type { InnovationHubWaterfallDimensionsPresetValue } from "@domain/config/presets/innovation-hub-waterfall-dimensions/innovation-hub-waterfall-dimensions.types";

const PRESET_KEY = "innovation-hub-waterfall-dimensions" as const;

function unwrap(
  result: Record<string, unknown>,
): InnovationHubWaterfallDimensionsPresetValue {
  const inner = result[PRESET_KEY];
  if (!inner || typeof inner !== "object") {
    throw new Error(`Expected result["${PRESET_KEY}"]`);
  }
  return inner as InnovationHubWaterfallDimensionsPresetValue;
}

describe("innovationHubWaterfallDimensionsHandler", () => {
  it("returns five dimensions with only Inno Stage enabled", () => {
    const block = unwrap(
      innovationHubWaterfallDimensionsHandler.handle({
        [PRESET_KEY]: {},
      }),
    );

    expect(block.enabled).toBe(true);
    expect(block.values.map((v) => v.value)).toEqual([
      "inno_stage",
      "portfolio",
      "market",
      "liquid_type",
      "inno_pillar",
    ]);
    expect(block.values.filter((v) => v.isDisabled === true)).toHaveLength(4);
    expect(
      block.values.find((v) => v.value === "inno_stage")?.isDisabled,
    ).toBeUndefined();
    expect(block.default).toEqual({
      value: "inno_stage",
      label: "Inno Stage",
      full: "",
    });
  });
});

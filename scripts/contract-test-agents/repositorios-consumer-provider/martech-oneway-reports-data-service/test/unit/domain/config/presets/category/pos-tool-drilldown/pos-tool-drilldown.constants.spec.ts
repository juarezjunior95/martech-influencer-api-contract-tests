import {
  normalizePosToolDrilldownCategoryValue,
  normalizePosToolDrilldownGrowthLever,
  resolvePosToolDrilldownCategoryDedupKey,
  resolvePosToolDrilldownCategoryLabel,
} from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.constants";

describe("normalizePosToolDrilldownGrowthLever", () => {
  it.each([
    ["Superior Core", "Core Co"],
    ["CORE CO", "Core Co"],
    ["Core Co", "Core Co"],
    ["Lead Premium", "Premium Co"],
    ["PREMIUM CO", "Premium Co"],
    ["Premium Co", "Premium Co"],
    ["Beyond Beer", "Beyond Beer"],
    ["Balanced Choices", "NAB"],
    ["NAB", "NAB"],
    ["Non-Alcoholic Beer", "NAB"],
    ["Non Alcohol Beer", "NAB"],
  ])("maps %s to %s", (input, expected) => {
    expect(normalizePosToolDrilldownGrowthLever(input)).toBe(expected);
  });

  it("returns empty string for blank input", () => {
    expect(normalizePosToolDrilldownGrowthLever("")).toBe("");
    expect(normalizePosToolDrilldownGrowthLever("   ")).toBe("");
  });

  it("returns trimmed unknown values unchanged", () => {
    expect(normalizePosToolDrilldownGrowthLever("  Custom Lever  ")).toBe(
      "Custom Lever",
    );
  });
});

describe("resolvePosToolDrilldownCategoryLabel", () => {
  it.each([
    ["Beer + BB", "Beer + Beyond Beer"],
    ["Beer + BYB", "Beer + Beyond Beer"],
    ["beer + bb", "Beer + Beyond Beer"],
  ])("maps %s to %s", (input, expected) => {
    expect(resolvePosToolDrilldownCategoryLabel(input)).toBe(expected);
  });

  it("returns empty string for blank input", () => {
    expect(resolvePosToolDrilldownCategoryLabel("")).toBe("");
    expect(resolvePosToolDrilldownCategoryLabel("   ")).toBe("");
  });

  it("returns trimmed unknown values unchanged", () => {
    expect(resolvePosToolDrilldownCategoryLabel("  Beer  ")).toBe("Beer");
    expect(resolvePosToolDrilldownCategoryLabel("Spirits")).toBe("Spirits");
  });
});

describe("resolvePosToolDrilldownCategoryDedupKey", () => {
  it.each([
    ["Beer + BB", "beer + bb"],
    ["Beer + BYB", "beer + bb"],
    ["Beer + Beyond Beer", "beer + bb"],
    ["Beer", "beer"],
  ])("maps %s to dedup key %s", (input, expected) => {
    expect(resolvePosToolDrilldownCategoryDedupKey(input)).toBe(expected);
  });
});

describe("normalizePosToolDrilldownCategoryValue", () => {
  it.each([
    ["Beer + BB", "Beer + Beyond Beer"],
    ["Beer + BYB", "Beer + Beyond Beer"],
    ["Beer + Beyond Beer", "Beer + Beyond Beer"],
    ["Beer", "Beer"],
  ])("maps %s to %s", (input, expected) => {
    expect(normalizePosToolDrilldownCategoryValue(input)).toBe(expected);
  });
});

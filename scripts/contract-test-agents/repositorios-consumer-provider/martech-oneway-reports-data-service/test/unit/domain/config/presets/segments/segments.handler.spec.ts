import {
  segmentsHandler,
  SegmentPresetValue,
} from "@domain/config/presets/segments/segments.handler";

describe("segmentsHandler", () => {
  it("emits the default registry when scope is omitted", () => {
    const result = segmentsHandler.handle({ segments: {} });
    const segments = result.segments as SegmentPresetValue;

    expect(segments.enabled).toBe(true);
    expect(segments.values).toEqual([
      { value: "Core Superiority", label: "Core Superiority", full: "" },
      { value: "Premiumization", label: "Premium", full: "" },
      { value: "Beyond Beer", label: "Beyond Beer", full: "" },
      { value: "NAB", label: "Non-Alcoholic Beer", full: "" },
    ]);
    expect(segments.default).toEqual({
      value: "Core Superiority",
      label: "Core Superiority",
      full: "",
    });
  });

  it('emits the category-health registry when scope is "category_health"', () => {
    const result = segmentsHandler.handle({
      segments: { scope: "category_health" },
    });
    const segments = result.segments as SegmentPresetValue;

    expect(segments.values).toEqual([
      { value: "Beer", label: "Beer", full: "" },
      { value: "Beyond Beer", label: "Beyond Beer", full: "" },
      { value: "Beer + Beyond Beer", label: "Beer + Beyond Beer", full: "" },
    ]);
    expect(segments.default).toEqual({
      value: "Beer",
      label: "Beer",
      full: "",
    });
  });

  it('emits the brand-power-book registry when scope is "brand_power_book"', () => {
    const result = segmentsHandler.handle({
      segments: { scope: "brand_power_book" },
    });
    const segments = result.segments as SegmentPresetValue;

    expect(segments.values.map((v) => v.value)).toEqual([
      "Premiumization",
      "Core+",
      "Mainstream",
      "Beyond Beer",
      "Others",
    ]);
    expect(segments.default.value).toBe("Premiumization");
  });

  it('emits the pos-tool-overview registry when scope is "pos_tool_overview"', () => {
    const result = segmentsHandler.handle({
      segments: { scope: "pos_tool_overview" },
    });
    const segments = result.segments as SegmentPresetValue;

    expect(segments.values).toEqual([
      { value: "Alcohol", label: "Alcohol", full: "Alcohol" },
      {
        value: "Beer + Beyond Beer",
        label: "Beer + BYB",
        full: "Beer + Beyond Beer",
      },
      { value: "Beer", label: "Beer", full: "Beer" },
      { value: "Beyond Beer", label: "Beyond Beer", full: "Beyond Beer" },
      { value: "Spirits", label: "Spirits", full: "Spirits" },
      { value: "Wine", label: "Wine", full: "Wine" },
    ]);
    expect(segments.default).toEqual({
      value: "Alcohol",
      label: "Alcohol",
      full: "Alcohol",
    });
  });

  it("is case-insensitive on the scope key", () => {
    const result = segmentsHandler.handle({
      segments: { scope: "CATEGORY_HEALTH" },
    });
    const segments = result.segments as SegmentPresetValue;

    expect(segments.values.map((v) => v.value)).toEqual([
      "Beer",
      "Beyond Beer",
      "Beer + Beyond Beer",
    ]);
  });

  it("falls back to the default registry when scope is unknown", () => {
    const result = segmentsHandler.handle({
      segments: { scope: "made_up" },
    });
    const segments = result.segments as SegmentPresetValue;

    expect(segments.values.map((v) => v.value)).toEqual([
      "Core Superiority",
      "Premiumization",
      "Beyond Beer",
      "NAB",
    ]);
  });

  it("collapses default to {} when noDefault=true", () => {
    const result = segmentsHandler.handle({
      segments: { scope: "brand_power_book", noDefault: true },
    });
    const segments = result.segments as SegmentPresetValue;

    expect(segments.default).toEqual({
      value: "",
      label: "",
      full: "",
    });
    expect(segments.values).toHaveLength(5);
  });

  it("accepts noDefault as a stringified boolean from query strings", () => {
    const result = segmentsHandler.handle({
      segments: { noDefault: "true" } as unknown as Record<string, unknown>,
    });
    const segments = result.segments as SegmentPresetValue;

    expect(segments.default).toEqual({
      value: "",
      label: "",
      full: "",
    });
  });

  it("prepends the synthetic All row when includeAll=true", () => {
    const result = segmentsHandler.handle({
      segments: { scope: "category_health", includeAll: true },
    });
    const segments = result.segments as SegmentPresetValue;

    expect(segments.values[0]).toEqual({
      value: "All",
      label: "All",
      full: "",
    });
    expect(segments.values).toHaveLength(4);
  });

  it("does not use the synthetic All row as the implicit default", () => {
    const result = segmentsHandler.handle({
      segments: { scope: "category_health", includeAll: true },
    });
    const segments = result.segments as SegmentPresetValue;

    expect(segments.default).toEqual({
      value: "All",
      label: "All",
      full: "",
    });
  });

  it("supports includeAll alongside noDefault", () => {
    const result = segmentsHandler.handle({
      segments: {
        scope: "brand_power_book",
        includeAll: true,
        noDefault: true,
      },
    });
    const segments = result.segments as SegmentPresetValue;

    expect(segments.values[0].value).toBe("All");
    expect(segments.default).toEqual({
      value: "",
      label: "",
      full: "",
    });
  });
});

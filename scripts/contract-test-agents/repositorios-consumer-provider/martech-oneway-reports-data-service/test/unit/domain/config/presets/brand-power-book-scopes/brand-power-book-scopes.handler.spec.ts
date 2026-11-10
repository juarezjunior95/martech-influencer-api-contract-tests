import {
  brandPowerBookScopesHandler,
  BrandPowerBookScopesPresetValue,
} from "@domain/config/presets/brand-power-book-scopes/brand-power-book-scopes.handler";
import { PresetDefinition } from "@domain/entities/preset.entity";

describe("brandPowerBookScopesHandler", () => {
  it("emits the three Drupal BrandPowerBookScope rows with empty default", () => {
    const result = brandPowerBookScopesHandler.handle({
      "brand-power-book-scopes": {},
    });
    const scopes = result[
      "brand-power-book-scopes"
    ] as BrandPowerBookScopesPresetValue;

    expect(scopes.enabled).toBe(true);
    expect(scopes.default).toEqual({
      value: "",
      label: "",
      full: "",
    });
    expect(scopes.values).toEqual([
      { value: "portfolio", label: "Portfolio", full: "" },
      { value: "global_brands", label: "Global Brands", full: "" },
      { value: "segment", label: "Segment", full: "" },
    ]);
  });

  it("preserves other preset keys on the definition", () => {
    const result = brandPowerBookScopesHandler.handle({
      "brand-power-book-scopes": {},
      segments: { enabled: true, values: [], default: {} },
    } as PresetDefinition);

    expect(result.segments).toEqual({
      enabled: true,
      values: [],
      default: {},
    });
  });
});

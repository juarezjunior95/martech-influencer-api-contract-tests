import {
  productScopeHandler,
  ProductScopePresetValue,
} from "@domain/config/presets/product-scope/product-scope.handler";

describe("productScopeHandler", () => {
  it("emits both product scope options with Beer + Adjacencies as default", () => {
    const result = productScopeHandler.handle({ "product-scope": {} });
    const productScope = result["product-scope"] as ProductScopePresetValue;

    expect(productScope.enabled).toBe(true);
    expect(productScope.values).toHaveLength(2);
    expect(productScope.values).toEqual([
      {
        value: "Beer + Adjacencies",
        label: "Beer + Adjacencies",
        full: "Beer + Adjacencies (excluding Soft Drinks)",
      },
      {
        value: "Total ABI",
        label: "Total ABI",
        full: "Total ABI (including Soft Drinks)",
      },
    ]);
  });

  it("sets the default to Beer + Adjacencies (first item)", () => {
    const result = productScopeHandler.handle({ "product-scope": {} });
    const productScope = result["product-scope"] as ProductScopePresetValue;

    expect(productScope.default).toEqual({
      value: "Beer + Adjacencies",
      label: "Beer + Adjacencies",
      full: "Beer + Adjacencies (excluding Soft Drinks)",
    });
  });

  it("returns exactly the two defined values in canonical order", () => {
    const result = productScopeHandler.handle({ "product-scope": {} });
    const productScope = result["product-scope"] as ProductScopePresetValue;

    expect(productScope.values.map((v) => v.value)).toEqual([
      "Beer + Adjacencies",
      "Total ABI",
    ]);
  });

  it("preserves the exact value, label, and full descriptions from the task", () => {
    const result = productScopeHandler.handle({ "product-scope": {} });
    const productScope = result["product-scope"] as ProductScopePresetValue;
    const [beerAdj, totalAbi] = productScope.values;

    expect(beerAdj).toEqual({
      value: "Beer + Adjacencies",
      label: "Beer + Adjacencies",
      full: "Beer + Adjacencies (excluding Soft Drinks)",
    });

    expect(totalAbi).toEqual({
      value: "Total ABI",
      label: "Total ABI",
      full: "Total ABI (including Soft Drinks)",
    });
  });
});

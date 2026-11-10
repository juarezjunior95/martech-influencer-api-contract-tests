import {
  globalBrandsHandler,
  GlobalBrandsPresetValue,
} from "@domain/config/presets/global-brands/global-brands.handler";

describe("globalBrandsHandler", () => {
  it("emits grouped options", () => {
    const result = globalBrandsHandler.handle({ "global-brands": {} });
    const globalBrands = result["global-brands"] as GlobalBrandsPresetValue;

    expect(globalBrands.enabled).toBe(true);
    expect(globalBrands.values).toEqual([
      {
        group: "",
        values: [
          { value: "All Global Brands", label: "All Global Brands", full: "" },
          { value: "Michelob Ultra", label: "Michelob Ultra", full: "" },
          { value: "Budweiser", label: "Budweiser", full: "" },
          { value: "Corona", label: "Corona", full: "" },
          { value: "Stella Artois", label: "Stella Artois", full: "" },
        ],
      },
      {
        group: "Competitor",
        values: [{ value: "Heineken", label: "Heineken", full: "" }],
      },
    ]);
    expect(globalBrands.default).toEqual({
      value: "All Global Brands",
      label: "All Global Brands",
      full: "",
    });
  });

  it("collapses default when noDefault=true", () => {
    const result = globalBrandsHandler.handle({
      "global-brands": { noDefault: true },
    });
    const globalBrands = result["global-brands"] as GlobalBrandsPresetValue;

    expect(globalBrands.default).toEqual({
      value: "",
      label: "",
      full: "",
    });
    expect(globalBrands.values[0].values[0].value).toBe("All Global Brands");
  });

  it("accepts noDefault as a stringified boolean from query strings", () => {
    const result = globalBrandsHandler.handle({
      "global-brands": { noDefault: "true" } as unknown as Record<
        string,
        unknown
      >,
    });
    const globalBrands = result["global-brands"] as GlobalBrandsPresetValue;

    expect(globalBrands.default).toEqual({
      value: "",
      label: "",
      full: "",
    });
  });
});

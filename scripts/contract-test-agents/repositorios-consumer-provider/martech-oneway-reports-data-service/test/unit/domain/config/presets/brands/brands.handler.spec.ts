import { Dataset } from "@domain/entities/common/base-config.entity";
import { PresetDefinition } from "@domain/entities/preset.entity";
import { getBrandImageFields } from "@common/utils/images/brand-image.utils";
import {
  BRAND_DATASET_ID,
  BrandFilterItem,
  BrandPresetValue,
} from "@domain/config/presets/brands/brands.types";
import { brandsHandler } from "@domain/config/presets/brands/brands.handler";

function buildItem(filter: Omit<BrandFilterItem, "type">): BrandFilterItem {
  return { type: "brand", ...filter };
}

function buildDataset(
  rows: { country: string; brand: string; sub_brand: string }[],
): Dataset {
  return {
    id: BRAND_DATASET_ID,
    data: rows.map((row) => ({
      country_iso_code_3: row.country,
      brand_family: row.brand,
      sub_brand: row.sub_brand,
    })),
  };
}

describe("brandsHandler", () => {
  it("declares the brand-subbrands dataset", () => {
    const datasets = brandsHandler.datasets();
    expect(datasets).toHaveLength(1);
    expect(datasets[0].id).toBe(BRAND_DATASET_ID);
  });

  it("returns an empty values map when the dataset has no rows", () => {
    const preset: PresetDefinition = {
      brand: buildItem({ label: "Brand", source: "databricks" }),
    };

    const result = brandsHandler.handle(preset, [buildDataset([])]) as {
      brand: BrandPresetValue;
    };

    expect(result.brand.values).toEqual({});
    expect(result.brand.enabled).toBe(true);
    expect(result.brand.default).toEqual([]);
  });

  it("groups rows by country, injects All/All, and resolves per-country defaults", () => {
    const preset: PresetDefinition = {
      brand: buildItem({ label: "Brand", source: "databricks" }),
    };

    const result = brandsHandler.handle(preset, [
      buildDataset([
        { country: "ARG", brand: "Andes", sub_brand: "Andes Origen" },
        { country: "ARG", brand: "Brahma", sub_brand: "Brahma" },
        { country: "ARG", brand: "Brahma", sub_brand: "All" },
        { country: "BRA", brand: "Brahma", sub_brand: "Brahma" },
        { country: "MEX", brand: "Corona", sub_brand: "Corona Extra" },
      ]),
    ]) as { brand: BrandPresetValue };

    const arg = result.brand.values.ARG;
    expect(arg.brands.map((b) => b.value)).toEqual(["All", "Andes", "Brahma"]);

    const brahma = arg.brands.find((b) => b.value === "Brahma") as {
      value: string;
      sub_brands: { value: string; label: string }[];
      default: { value: string; label: string };
    };
    expect(brahma.sub_brands.map((s) => s.value)).toEqual(["All", "Brahma"]);
    expect(brahma.default).toEqual({
      value: "All",
      label: "All",
      ...getBrandImageFields("All", { brand_family: "Brahma" }),
    });

    const andes = arg.brands.find((b) => b.value === "Andes") as {
      value: string;
      sub_brands: { value: string; label: string }[];
    };
    expect(andes.sub_brands.map((s) => s.value)).toEqual([
      "All",
      "Andes Origen",
    ]);

    expect(arg.default).toMatchObject({ value: "All", label: "All" });
    expect(result.brand.values.BRA.brands.map((b) => b.value)).toEqual([
      "All",
      "Brahma",
    ]);
    expect(result.brand.values.MEX.brands.map((b) => b.value)).toEqual([
      "All",
      "Corona",
    ]);
  });

  it("includeGlobal=true adds the canned ABI row exactly like the legacy plugin", () => {
    const preset: PresetDefinition = {
      brand: buildItem({
        label: "Brand",
        source: "databricks",
        includeGlobal: true,
      }),
    };

    const result = brandsHandler.handle(preset, [
      buildDataset([
        { country: "ARG", brand: "Andes", sub_brand: "Andes Origen" },
      ]),
    ]) as { brand: BrandPresetValue };

    const abiAll = getBrandImageFields("All");
    expect(result.brand.values.ABI.brands).toEqual([
      {
        value: "All",
        label: "All",
        ...abiAll,
        sub_brands: [{ value: "All", label: "All", ...abiAll }],
        default: { value: "All", label: "All", ...abiAll },
      },
    ]);
    expect(result.brand.values.ABI.default).toEqual({
      value: "All",
      label: "All",
      ...abiAll,
      sub_brands: [{ value: "All", label: "All", ...abiAll }],
      default: { value: "All", label: "All", ...abiAll },
    });
  });

  it("includeAllBrands=false skips the synthetic All brand", () => {
    const preset: PresetDefinition = {
      brand: buildItem({
        label: "Brand",
        source: "databricks",
        includeAllBrands: false,
      }),
    };

    const result = brandsHandler.handle(preset, [
      buildDataset([{ country: "BRA", brand: "Brahma", sub_brand: "Brahma" }]),
    ]) as { brand: BrandPresetValue };

    expect(result.brand.values.BRA.brands.map((b) => b.value)).toEqual([
      "Brahma",
    ]);
  });

  it("includeAllSubBrands=false skips the synthetic All sub_brand", () => {
    const preset: PresetDefinition = {
      brand: buildItem({
        label: "Brand",
        source: "databricks",
        includeAllSubBrands: false,
      }),
    };

    const result = brandsHandler.handle(preset, [
      buildDataset([{ country: "BRA", brand: "Brahma", sub_brand: "Brahma" }]),
    ]) as { brand: BrandPresetValue };

    const brahma = result.brand.values.BRA.brands.find(
      (b) => b.value === "Brahma",
    ) as {
      value: string;
      sub_brands: { value: string; label: string }[];
      default: { value: string; label: string };
    };
    expect(brahma.sub_brands.map((s) => s.value)).toEqual(["Brahma"]);
    expect(brahma.default).toEqual({
      value: "Brahma",
      label: "Brahma",
      ...getBrandImageFields("Brahma"),
    });
  });

  it("respects the optional countries pre-filter", () => {
    const preset: PresetDefinition = {
      brand: buildItem({
        label: "Brand",
        source: "databricks",
        countries: ["ARG"],
      }),
    };

    const result = brandsHandler.handle(preset, [
      buildDataset([
        { country: "ARG", brand: "Andes", sub_brand: "Andes Origen" },
        { country: "BRA", brand: "Brahma", sub_brand: "Brahma" },
      ]),
    ]) as { brand: BrandPresetValue };

    expect(Object.keys(result.brand.values)).toEqual(["ARG"]);
  });

  it("passes through preset keys that are not BrandFilterItems", () => {
    const preset: PresetDefinition = {
      brand: buildItem({ label: "Brand", source: "databricks" }),
      showTrendLine: true,
      foo: { label: "Foo" } as unknown as never,
    };

    const result = brandsHandler.handle(preset, [buildDataset([])]) as Record<
      string,
      unknown
    >;

    expect(result.showTrendLine).toBe(true);
    expect(result.foo).toEqual({ label: "Foo" });
  });

  it("includeSubBrands=false omits sub_brands and per-brand defaults", () => {
    const preset: PresetDefinition = {
      brand: buildItem({
        label: "Brand",
        source: "databricks",
        includeSubBrands: false,
      }),
    };

    const result = brandsHandler.handle(preset, [
      buildDataset([
        { country: "BRA", brand: "Brahma", sub_brand: "Brahma" },
        { country: "BRA", brand: "Skol", sub_brand: "Skol Pilsen" },
      ]),
    ]) as { brand: BrandPresetValue };

    const bra = result.brand.values.BRA;
    for (const entry of bra.brands) {
      expect("sub_brands" in entry).toBe(false);
      expect("default" in entry).toBe(false);
    }
    expect(bra.default).toMatchObject({
      value: expect.any(String),
      label: expect.any(String),
    });
    expect("sub_brands" in (bra.default as object)).toBe(false);
  });

  it("flatten=true emits a flat brand+sub_brand list per country", () => {
    const preset: PresetDefinition = {
      brand: buildItem({
        label: "Brand",
        source: "databricks",
        flatten: true,
      }),
    };

    const result = brandsHandler.handle(preset, [
      buildDataset([
        { country: "BRA", brand: "Brahma", sub_brand: "Brahma" },
        { country: "BRA", brand: "Skol", sub_brand: "Skol Pilsen" },
        { country: "BRA", brand: "Skol", sub_brand: "Skol Beats" },
      ]),
    ]) as { brand: BrandPresetValue };

    const bra = result.brand.values.BRA;
    expect(bra.brands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: "All",
          value_sub_brand: "All",
          label: "All (All)",
        }),
        expect.objectContaining({
          value: "Brahma",
          value_sub_brand: "All",
          label: "Brahma",
        }),
        expect.objectContaining({
          value: "Skol",
          value_sub_brand: "All",
          label: "Skol (All)",
        }),
        expect.objectContaining({
          value: "Skol",
          value_sub_brand: "Skol Pilsen",
          label: "Skol Pilsen",
        }),
        expect.objectContaining({
          value: "Skol",
          value_sub_brand: "Skol Beats",
          label: "Skol Beats",
        }),
      ]),
    );
  });

  it("fieldLabel prepends a label row at the top of every country list", () => {
    const preset: PresetDefinition = {
      brand: buildItem({
        label: "Brand",
        source: "databricks",
        fieldLabel: "Select a brand",
      }),
    };

    const result = brandsHandler.handle(preset, [
      buildDataset([{ country: "BRA", brand: "Brahma", sub_brand: "Brahma" }]),
    ]) as { brand: BrandPresetValue };

    expect(result.brand.values.BRA.brands[0]).toEqual({
      value: "Select a brand",
      label: "Select a brand",
      ...getBrandImageFields("Select a brand"),
    });
  });

  it("subFieldLabel prepends a label row in every brand's sub_brands", () => {
    const preset: PresetDefinition = {
      brand: buildItem({
        label: "Brand",
        source: "databricks",
        subFieldLabel: "Select a sub-brand",
      }),
    };

    const result = brandsHandler.handle(preset, [
      buildDataset([{ country: "BRA", brand: "Brahma", sub_brand: "Brahma" }]),
    ]) as { brand: BrandPresetValue };

    const brahma = result.brand.values.BRA.brands.find(
      (b) => "value" in b && b.value === "Brahma",
    ) as { sub_brands: { value: string; label: string }[] };
    expect(brahma.sub_brands[0]).toEqual({
      value: "Select a sub-brand",
      label: "Select a sub-brand",
      ...getBrandImageFields("Select a sub-brand", {
        brand_family: "Brahma",
      }),
    });
  });

  it("throws BadRequestException on include_all_sub_brands+include_sub_brands conflict", () => {
    const preset: PresetDefinition = {
      brand: buildItem({
        label: "Brand",
        source: "databricks",
        includeAllSubBrands: true,
        includeSubBrands: false,
      }),
    };

    expect(() => brandsHandler.handle(preset, [buildDataset([])])).toThrow(
      /include_all_sub_brands=true and include_sub_brands=false/,
    );
  });
});

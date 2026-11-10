import {
  PresetConfig,
  PresetEntity,
  PresetItem,
  PresetResponse,
} from "@domain/entities/preset.entity";
import {
  BRAND_DATASET_ID,
  BrandPresetValue,
} from "@domain/config/presets/brands/brands.types";
import { brandsHandler } from "@domain/config/presets/brands/brands.handler";
import { getBrandImageFields } from "@common/utils/images/brand-image.utils";
import {
  yearsHandler,
  YearPresetValue,
} from "@domain/config/presets/years/years.handler";
import { VIEWER_SCOPES } from "@domain/entities/scopes";
import { UserEntity } from "@domain/entities/user.entity";
import {
  DatasetRepositoryFactory,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import { Dataset } from "@domain/entities/common/base-config.entity";

function buildEntity(config: PresetConfig): PresetEntity {
  return new PresetEntity(
    {} as DatasetRepositoryFactory,
    config,
    "test-preset",
  );
}

/** Presets that declare `kpi-group` in `datasets()` need a stub repository. */
function buildEntityWithKpiGroupStub(config: PresetConfig): PresetEntity {
  const factory = {
    resolveRepository: () => ({
      fetchData: async () => [],
    }),
  } as unknown as DatasetRepositoryFactory;
  return new PresetEntity(factory, config, "test-preset-kpi");
}

/** `brandsHandler` returns the resolved preset keyed by the preset name (e.g. `brand`). */
function brandFromResponse(response: PresetResponse): BrandPresetValue {
  return (response as { brand: BrandPresetValue }).brand;
}

/**
 * PresetEntity that returns a fixed in-memory dataset whenever the
 * brand-subbrands query is loaded. Used to exercise the full brand
 * pipeline without hitting Databricks.
 */
class StubBrandPresetEntity extends PresetEntity {
  private readonly fixture: {
    country: string;
    brand: string;
    sub_brand: string;
  }[];

  constructor(
    fixture: { country: string; brand: string; sub_brand: string }[],
    config: PresetConfig,
  ) {
    super({} as DatasetRepositoryFactory, config, "test-preset");
    this.fixture = fixture;
  }

  protected async loadDatasets(): Promise<Dataset[]> {
    return [
      {
        id: BRAND_DATASET_ID,
        data: this.fixture.map((row) => ({
          country_iso_code_3: row.country,
          brand_family: row.brand,
          sub_brand: row.sub_brand,
        })),
      },
    ];
  }
}

function buildBrandFixture(): {
  country: string;
  brand: string;
  sub_brand: string;
}[] {
  return [
    { country: "ARG", brand: "Andes", sub_brand: "Andes Origen" },
    { country: "ARG", brand: "Brahma", sub_brand: "Brahma" },
    { country: "ARG", brand: "Brahma", sub_brand: "All" },
    { country: "BRA", brand: "Brahma", sub_brand: "Brahma" },
    { country: "MEX", brand: "Corona", sub_brand: "Corona Extra" },
  ];
}

// Reference RepositoryType so the import is not flagged as unused even
// when the test stub does not exercise the factory directly.
void RepositoryType;

describe("PresetEntity pipeline", () => {
  describe("registry expansion", () => {
    it("expands CountryFilterItem into PresetItem with icon/group metadata", async () => {
      const entity = buildEntity({
        preset: {
          country: {
            label: "Country",
            countries: ["BRA", "ARG"],
          },
        },
      });

      const response = (await entity.fetch([])) as PresetResponse;
      const country = response.country as PresetItem;

      expect(country.label).toBe("Country");
      expect(country.options).toHaveLength(2);
      expect(country.options?.[0]).toMatchObject({
        value: "BRA",
        label: "Brazil",
        group: "SAZ",
      });
      expect(country.options?.[0].metadata).toHaveProperty("match_names");
    });

    it("expands BrandFilterItem via the Databricks pipeline", async () => {
      const entity = new StubBrandPresetEntity(buildBrandFixture(), {
        handler: brandsHandler,
        preset: {
          brand: {
            type: "brand",
            label: "Brand",
            source: "databricks",
            includeGlobal: true,
          },
        },
      });

      const response = await entity.fetch([]);
      const brand = brandFromResponse(response);

      expect(brand.enabled).toBe(true);
      expect(brand.default).toEqual([]);
      expect(Object.keys(brand.values).sort()).toEqual([
        "ABI",
        "ARG",
        "BRA",
        "MEX",
      ]);

      const arg = brand.values.ARG;
      expect(arg.brands.map((b) => b.value)).toEqual([
        "All",
        "Andes",
        "Brahma",
      ]);
      const argAndes = arg.brands[1] as {
        value: string;
        sub_brands: { value: string; label: string }[];
        default: { value: string; label: string };
      };
      expect(argAndes.sub_brands.map((s) => s.value)).toEqual([
        "All",
        "Andes Origen",
      ]);
      // First sub_brand becomes the per-brand default.
      expect(argAndes.default).toEqual({
        value: "All",
        label: "All",
        ...getBrandImageFields("All", { brand_family: "Andes" }),
      });
      // Per-country default uses the dictionary ("All" for ARG).
      expect(arg.default).toMatchObject({ value: "All", label: "All" });

      // Synthetic ABI row mirrors the legacy global selector exactly.
      const abiAll = getBrandImageFields("All");
      expect(brand.values.ABI.brands).toEqual([
        {
          value: "All",
          label: "All",
          ...abiAll,
          sub_brands: [{ value: "All", label: "All", ...abiAll }],
          default: { value: "All", label: "All", ...abiAll },
        },
      ]);
    });

    it("preserves primitive values and inline static options", async () => {
      const entity = buildEntity({
        preset: {
          viewtype: {
            label: "View Type",
            options: [{ value: "ytd", label: "Year to Date" }],
          },
          showTrendLine: true,
          maxItemsPerPage: 50,
        },
      });

      const response = await entity.fetch([]);
      expect(response.showTrendLine).toBe(true);
      expect(response.maxItemsPerPage).toBe(50);
      expect((response.viewtype as PresetItem).options).toHaveLength(1);
    });
  });

  describe("permission filtering", () => {
    const buildCountryPreset = () =>
      buildEntity({
        preset: {
          country: {
            label: "Country",
            countries: ["BRA", "ARG", "MEX", "USA"],
          },
        },
      });

    it("CountryViewer drops countries the user cannot access", async () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["BR", "AR"],
      });

      const response = await buildCountryPreset().fetch([], user);
      const values = (response.country as PresetItem).options?.map(
        (o) => o.value,
      );
      // CountryViewer policy is the union of `supportedCountries`
      // (BR -> BRA, AR -> ARG) with the JWT `country` claim (BR -> BRA,
      // already present). MEX and USA are dropped because the user
      // does not hold them.
      expect(values).toEqual(["BRA", "ARG"]);
    });

    it("returns everything when JWT is missing (unrestricted, backward compat)", async () => {
      const user = UserEntity.create({
        scopes: [],
        country: null,
        supportedCountries: [],
      });

      const response = await buildCountryPreset().fetch([], user);
      const values = (response.country as PresetItem).options?.map(
        (o) => o.value,
      );
      expect(values).toEqual(
        expect.arrayContaining(["BRA", "ARG", "MEX", "USA"]),
      );
    });

    it("returns everything when user is undefined", async () => {
      const response = await buildCountryPreset().fetch([]);
      const values = (response.country as PresetItem).options?.map(
        (o) => o.value,
      );
      expect(values).toEqual(
        expect.arrayContaining(["BRA", "ARG", "MEX", "USA"]),
      );
    });

    it("GlobalViewer returns all countries regardless of supportedCountries", async () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: "BR",
        supportedCountries: ["BR"],
      });
      const response = await buildCountryPreset().fetch([], user);
      const values = (response.country as PresetItem).options?.map(
        (o) => o.value,
      );
      expect(values).toEqual(
        expect.arrayContaining(["BRA", "ARG", "MEX", "USA"]),
      );
    });

    it("ZoneViewer.SAZ keeps only South Americas options", async () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.SAZ],
        country: "BR",
        supportedCountries: [],
      });
      const response = await buildCountryPreset().fetch([], user);
      const values = (response.country as PresetItem).options?.map(
        (o) => o.value,
      );
      expect(values).toEqual(expect.arrayContaining(["BRA", "ARG"]));
      expect(values).not.toEqual(expect.arrayContaining(["MEX", "USA"]));
    });

    it("ZoneViewer + jwt.country outside the zone does NOT leak the home country", async () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.AFR],
        country: "BR",
        supportedCountries: [],
      });
      const response = await buildCountryPreset().fetch([], user);
      const values = (response.country as PresetItem).options?.map(
        (o) => o.value,
      );
      // The JWT `country` claim alone (without CountryViewer) must
      // NOT promote BRA into a ZoneViewer-only response.
      expect(values).not.toContain("BRA");
    });

    it("Deny mode (JWT present, no viewer scope) empties country options", async () => {
      const user = UserEntity.create({
        scopes: ["OneWayReports.TradeExecution.Read"],
        country: "BR",
        supportedCountries: ["BR"],
      });
      const response = await buildCountryPreset().fetch([], user);
      expect((response.country as PresetItem).options).toEqual([]);
    });
  });

  describe("brand permission trimming", () => {
    const buildEntityWithBrand = () =>
      new StubBrandPresetEntity(buildBrandFixture(), {
        handler: brandsHandler,
        preset: {
          country: {
            label: "Country",
            countries: ["BRA", "ARG", "MEX", "USA"],
          },
          brand: {
            type: "brand",
            label: "Brand",
            source: "databricks",
            includeGlobal: true,
          },
        },
      });

    it("GlobalViewer keeps every country and the ABI row", async () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: "BR",
        supportedCountries: ["BR"],
      });
      const response = await buildEntityWithBrand().fetch([], user);
      const brand = brandFromResponse(response);
      expect(Object.keys(brand.values).sort()).toEqual([
        "ABI",
        "ARG",
        "BRA",
        "MEX",
      ]);
    });

    it("ZoneViewer.SAZ keeps SAZ countries and ABI; drops MEX (MAZ)", async () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.SAZ],
        country: "BR",
        supportedCountries: [],
      });
      const response = await buildEntityWithBrand().fetch([], user);
      const brand = brandFromResponse(response);
      expect(Object.keys(brand.values).sort()).toEqual(["ABI", "ARG", "BRA"]);
      expect(brand.values.MEX).toBeUndefined();
    });

    it("Deny mode empties the values map", async () => {
      const user = UserEntity.create({
        scopes: ["OneWayReports.TradeExecution.Read"],
        country: "BR",
        supportedCountries: ["BR"],
      });
      const response = await buildEntityWithBrand().fetch([], user);
      const brand = brandFromResponse(response);
      expect(brand.values).toEqual({});
    });

    it("Unrestricted (no JWT) leaves the values map untouched", async () => {
      const response = await buildEntityWithBrand().fetch([]);
      const brand = brandFromResponse(response);
      expect(Object.keys(brand.values).sort()).toEqual([
        "ABI",
        "ARG",
        "BRA",
        "MEX",
      ]);
    });
  });

  describe("legacy-style filter overrides", () => {
    it("years[no_default]=true collapses the default to {} but keeps the values list", async () => {
      const entity = buildEntityWithKpiGroupStub({
        handler: yearsHandler,
        preset: {
          years: { noDefault: false },
        },
      });

      const response = await entity.fetch([
        { namespace: "years", name: "no_default", value: "true" },
      ]);
      const years = response.years as YearPresetValue;
      expect(years.values.length).toBeGreaterThan(0);
      expect(years.default).toEqual({});
      expect(years.enabled).toBe(true);
    });

    it("years[no_default]=false (or omitted) keeps the first year as default", async () => {
      const entity = buildEntityWithKpiGroupStub({
        handler: yearsHandler,
        preset: {
          years: { noDefault: false },
        },
      });

      const response = await entity.fetch([]);
      const years = response.years as YearPresetValue;
      expect(years.default).toMatchObject({
        value: years.values[0].value,
        label: years.values[0].label,
        full: "Full Year (FY)",
      });
    });

    it("brand[include_global]=false drops the synthetic ABI row", async () => {
      const entity = new StubBrandPresetEntity(buildBrandFixture(), {
        handler: brandsHandler,
        preset: {
          brand: {
            type: "brand",
            label: "Brand",
            source: "databricks",
            includeGlobal: true,
          },
        },
      });

      const response = await entity.fetch([
        { namespace: "brand", name: "include_global", value: "false" },
      ]);
      const brand = brandFromResponse(response);
      expect(brand.values.ABI).toBeUndefined();
      expect(Object.keys(brand.values).sort()).toEqual(["ARG", "BRA", "MEX"]);
    });

    it("brand[countries]=BRA,ARG narrows the values map before permission trim", async () => {
      const entity = new StubBrandPresetEntity(buildBrandFixture(), {
        handler: brandsHandler,
        preset: {
          brand: {
            type: "brand",
            label: "Brand",
            source: "databricks",
          },
        },
      });

      const response = await entity.fetch([
        { namespace: "brand", name: "countries", value: "BRA,ARG" },
      ]);
      const brand = brandFromResponse(response);
      expect(Object.keys(brand.values).sort()).toEqual(["ARG", "BRA"]);
    });

    it("brand[include_all_sub_brands]=true with brand[include_sub_brands]=false returns 400", async () => {
      const entity = new StubBrandPresetEntity(buildBrandFixture(), {
        handler: brandsHandler,
        preset: {
          brand: { type: "brand", label: "Brand", source: "databricks" },
        },
      });

      await expect(
        entity.fetch([
          { namespace: "brand", name: "include_all_sub_brands", value: "true" },
          { namespace: "brand", name: "include_sub_brands", value: "false" },
        ]),
      ).rejects.toThrow(
        /include_all_sub_brands=true and include_sub_brands=false/,
      );
    });

    it("`?filter[*]=...` inputs are forwarded to loadDatasets and ignored as overrides", async () => {
      const entity = buildEntityWithKpiGroupStub({
        handler: yearsHandler,
        preset: {
          years: { noDefault: false },
        },
      });

      const response = await entity.fetch([
        { namespace: "filter", name: "no_default", value: "true" },
      ]);
      const years = response.years as YearPresetValue;
      // `filter[no_default]` is NOT an override; the first year stays as default.
      expect(years.default).not.toEqual({});
    });
  });
});

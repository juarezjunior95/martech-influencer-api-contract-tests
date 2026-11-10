import {
  Dataset,
  DataItem,
  DatasetConfig,
} from "@domain/entities/common/base-config.entity";
import { DeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { commercialResultsHandler } from "@domain/config/presets/commercial-results/commercial-results.handler";
import {
  FILTER_PLACEHOLDERS,
  STATIC_PERIOD_OPTIONS,
} from "@domain/config/presets/commercial-results/commercial-results.constants";
import {
  getMonthlyTimeframes,
  parseRefreshDateUtc,
} from "@domain/config/presets/performance-tool/performance-tool.periods";
import kpiGroupTimeFrame from "@domain/config/config-groups/kpi-group-time-frame.config";
import { KPI_GROUP_DATASET_ID } from "@domain/config/presets/kpi-group/kpi-group.types";
import {
  COMMERCIAL_RESULTS_DATASET_ID,
  COMMERCIAL_RESULTS_BRANDS_DATASET_ID,
  COMMERCIAL_RESULTS_GEO_DATASET_ID,
  COMMERCIAL_RESULTS_SP_NAME,
  CommercialResultsFilterResponse,
  CommercialResultsPeriodOption,
  CommercialResultsPresetConfig,
} from "@domain/config/presets/commercial-results/commercial-results.types";
import { PresetDefinition } from "@domain/entities/preset.entity";
import { UserEntity } from "@domain/entities/user.entity";
import { VIEWER_SCOPES } from "@domain/entities/scopes";
import { requestContextStorage } from "@common/utils/winston-context.format";
import { getBrandImageFields } from "@common/utils/images/brand-image.utils";
import type { CommercialResultsOption } from "@domain/config/presets/commercial-results/commercial-results.types";

const IMAGE_CDN = "http://localhost:3030/images";

/** Mirrors the default `buildList` mapper. */
function listOption(value: string, label: string): CommercialResultsOption {
  return { value, label };
}

/** Mirrors the brands `buildList` mapper. */
function brandOption(value: string, label: string): CommercialResultsOption {
  return { value, label, ...getBrandImageFields(value) };
}

/** Mirrors `buildSubBrandList` placeholder/default enrichment. */
function subBrandPlaceholderOption(
  placeholder: CommercialResultsOption,
): CommercialResultsOption {
  return { ...placeholder, ...getBrandImageFields(placeholder.value) };
}

/** Mirrors `buildSubBrandList` option mapper. */
function subBrandOption(
  value: string,
  brandFamily: string,
): CommercialResultsOption {
  return {
    value,
    label: value,
    ...getBrandImageFields(value, { brand_family: brandFamily }),
  };
}

function withImageCdn(): void {
  process.env.CDN_BASE_URL = IMAGE_CDN;
}

function withoutImageCdn(): void {
  delete process.env.CDN_BASE_URL;
}

function dataset(id: string, rows: DataItem[]): Dataset {
  return { id, data: rows };
}

function kpiGroupDataset(
  timeFrame: string,
  kpiName: "sku_pnl" | "sku_pnl_nr" | "volume" = "sku_pnl",
): Dataset {
  return dataset(KPI_GROUP_DATASET_ID, [
    { kpi_name: kpiName, time_frame: timeFrame },
  ]);
}

/** Runs the handler and returns the result cast as CommercialResultsFilterResponse. */
function runHandle(
  preset: PresetDefinition = {},
  ...datasets: Dataset[]
): CommercialResultsFilterResponse {
  const result = commercialResultsHandler.handle(preset, datasets);
  return result as unknown as CommercialResultsFilterResponse;
}

function runHandleWithUser(
  user: UserEntity,
  preset: PresetDefinition = {},
  ...datasets: Dataset[]
): CommercialResultsFilterResponse {
  const result = commercialResultsHandler.handle(preset, datasets, user);
  return result as unknown as CommercialResultsFilterResponse;
}

function configFor(
  datasets: DatasetConfig[],
  id: string,
): DeltalakeFetchDataConfig {
  const found = datasets.find((d) => d.id === id);
  if (!found) throw new Error(`dataset '${id}' not present`);
  return found.config as DeltalakeFetchDataConfig;
}

const geoRow = {
  country_iso_code_3: "BRA",
  zone: "LAC",
  region: "South",
  period: "YTD",
  brand: "All",
  sub_brand: "All",
  sku: "All",
  channel: "All",
  pack_type: "All",
};

const brandRow = {
  ...geoRow,
  brand: "Corona",
  channel: "OnTrade",
  pack_type: "Bottle",
};

const mainRow = {
  ...brandRow,
  sub_brand: "Corona Extra",
  sku: "Corona Extra 330ml",
};

describe("CommercialResultsPresetHandler", () => {
  describe("datasets()", () => {
    it("uses kpi-group + geo only in global context (no country or brand filter)", () => {
      expect(commercialResultsHandler.datasets().map((d) => d.id)).toEqual([
        KPI_GROUP_DATASET_ID,
        COMMERCIAL_RESULTS_GEO_DATASET_ID,
      ]);
    });

    it("treats brand=ALL the same as absent — kpi-group + geo only in global context", () => {
      expect(
        commercialResultsHandler
          .datasets({ commercial_results_filters: { brand: "ALL" } })
          .map((d) => d.id),
      ).toEqual([KPI_GROUP_DATASET_ID, COMMERCIAL_RESULTS_GEO_DATASET_ID]);
    });

    it("adds the main dataset when a specific brand is selected (global context)", () => {
      const ds = commercialResultsHandler.datasets({
        commercial_results_filters: { brand: "Corona" },
      });
      expect(ds.map((d) => d.id)).toEqual([
        KPI_GROUP_DATASET_ID,
        COMMERCIAL_RESULTS_DATASET_ID,
        COMMERCIAL_RESULTS_GEO_DATASET_ID,
      ]);
    });

    it("uses kpi-group + brands + geo when a specific country is selected with brand=All", () => {
      const ds = commercialResultsHandler.datasets({
        commercial_results_filters: { country: "BRA" },
      });
      expect(ds.map((d) => d.id)).toEqual([
        KPI_GROUP_DATASET_ID,
        COMMERCIAL_RESULTS_BRANDS_DATASET_ID,
        COMMERCIAL_RESULTS_GEO_DATASET_ID,
      ]);
    });

    it("uses kpi-group + main + brands + geo when a specific country and brand are selected", () => {
      const ds = commercialResultsHandler.datasets({
        commercial_results_filters: { country: "BRA", brand: "Corona" },
      });
      expect(ds.map((d) => d.id)).toEqual([
        KPI_GROUP_DATASET_ID,
        COMMERCIAL_RESULTS_DATASET_ID,
        COMMERCIAL_RESULTS_BRANDS_DATASET_ID,
        COMMERCIAL_RESULTS_GEO_DATASET_ID,
      ]);
    });

    it("binds country/zone/brand from the request on the main dataset", () => {
      const ds = commercialResultsHandler.datasets({
        commercial_results_filters: { brand: "Corona" },
      });
      const { procedure } = configFor(ds, COMMERCIAL_RESULTS_DATASET_ID);
      expect(procedure).toContain(COMMERCIAL_RESULTS_SP_NAME);
      expect(procedure).toContain("{{DATABRICKS_SCHEMA}}");
      expect(procedure).toContain(":country");
      expect(procedure).toContain(":zone");
      expect(procedure).toContain(":brand");
      expect(procedure).toContain(":kpi");
    });

    it("forces brand=All but keeps country/zone dynamic on the brands dataset", () => {
      const { procedure } = configFor(
        commercialResultsHandler.datasets({
          commercial_results_filters: { country: "BRA" },
        }),
        COMMERCIAL_RESULTS_BRANDS_DATASET_ID,
      );
      expect(procedure).toContain('"brand": "All"');
      expect(procedure).toContain(":country");
      expect(procedure).toContain(":zone");
      expect(procedure).toContain(":kpi");
      expect(
        configFor(
          commercialResultsHandler.datasets({
            commercial_results_filters: { country: "BRA" },
          }),
          COMMERCIAL_RESULTS_BRANDS_DATASET_ID,
        ).parameters,
      ).toEqual(["country", "zone", "kpi"]);
    });

    it("hardcodes country=ABI, zone=ABI, brand=All on the geo dataset", () => {
      const { procedure } = configFor(
        commercialResultsHandler.datasets(),
        COMMERCIAL_RESULTS_GEO_DATASET_ID,
      );
      expect(procedure).toContain('"country": "ABI"');
      expect(procedure).toContain('"zone": "ABI"');
      expect(procedure).toContain('"brand": "All"');
      expect(procedure).toContain(":kpi");
    });
  });

  describe("filters()", () => {
    it("returns the ABI/ABI/All/volume defaults", () => {
      expect(commercialResultsHandler.filters()).toEqual([
        { name: "country", value: "ABI" },
        { name: "zone", value: "ABI" },
        { name: "brand", value: "All" },
        { name: "kpi", value: "volume" },
      ]);
    });
  });

  describe("handle() — KPI selector", () => {
    it("returns Volume and Net Revenue with Volume as the default", () => {
      const cr = runHandle();

      expect(cr.kpis).toEqual({
        enabled: true,
        default: { value: "volume", label: "Volume" },
        values: [
          { value: "volume", label: "Volume" },
          { value: "nr", label: "Net Revenue" },
        ],
      });
    });
  });

  describe("handle() — empty datasets", () => {
    it("zones, country, region, and periods are always enabled even when datasets are empty", () => {
      const cr = runHandle();
      expect(cr.zones.enabled).toBe(true);
      expect(cr.country.enabled).toBe(true);
      expect(cr.region.enabled).toBe(true);
      expect(cr.periods.enabled).toBe(true);
    });

    it("brands, sub_brands, channel, pack_type, and sku are disabled when no brand data is available", () => {
      const cr = runHandle();
      expect(cr.brands.enabled).toBe(false);
      expect(cr.sub_brands.enabled).toBe(false);
      expect(cr.channel.enabled).toBe(false);
      expect(cr.pack_type.enabled).toBe(false);
      expect(cr.sku.enabled).toBe(false);
    });

    it("category, non_alcoholic, growth_levers, beer_price_segment and portfolios are disabled when no brand data is available", () => {
      const cr = runHandle();
      expect(cr.category.enabled).toBe(false);
      expect(cr.non_alcoholic.enabled).toBe(false);
      expect(cr.growth_levers.enabled).toBe(false);
      expect(cr.beer_price_segment.enabled).toBe(false);
      expect(cr.portfolios.enabled).toBe(false);
    });
  });

  describe("handle() — zones (from geo dataset)", () => {
    it("returns only regional zones sorted and de-duplicated without ABI/Global", () => {
      const cr = runHandle(
        {},
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, [
          { ...geoRow, zone: "SAZ" },
          { ...geoRow, zone: "EUR" },
          { ...geoRow, zone: "EUR" },
          { ...geoRow, zone: "AFR" },
        ]),
      );
      expect(cr.zones.default).toEqual({ value: "SAZ", label: "SAZ" });
      expect(cr.zones.values).toEqual([
        { value: "AFR", label: "AFR" },
        { value: "EUR", label: "EUR" },
        { value: "SAZ", label: "SAZ" },
      ]);
      expect(cr.zones.values.some((z) => z.value === "ABI")).toBe(false);
    });
  });

  describe("handle() — country (from geo dataset)", () => {
    it("groups de-duplicated countries by zone without a Global ABI bucket", () => {
      const cr = runHandle(
        {},
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, [
          { ...geoRow, zone: "LAC", country_iso_code_3: "BRA" },
          { ...geoRow, zone: "LAC", country_iso_code_3: "BRA", period: "L3M" },
          { ...geoRow, zone: "MAZ", country_iso_code_3: "COL" },
        ]),
      );
      expect(cr.country.values["ABI"]).toBeUndefined();
      expect(cr.country.values["LAC"]).toEqual([
        {
          value: "BRA",
          label: "Brazil",
          zone: "LAC",
          quick_filter_label: "Brazil",
        },
      ]);
      expect(cr.country.values["MAZ"]).toEqual([
        {
          value: "COL",
          label: "Colombia",
          zone: "MAZ",
          quick_filter_label: "Colombia",
        },
      ]);
    });
  });

  describe("handle() — country and zone defaults (user-aware)", () => {
    const sazGeoRows = [
      { ...geoRow, zone: "SAZ", country_iso_code_3: "BRA" },
      { ...geoRow, zone: "SAZ", country_iso_code_3: "ARG" },
    ];

    it("defaults zone and country to the first available geo country for unrestricted users", () => {
      const cr = runHandle(
        {},
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, sazGeoRows),
      );

      expect(cr.country.default).toEqual({
        value: "ARG",
        label: "Argentina",
        zone: "SAZ",
        quick_filter_label: "Argentina",
      });
      expect(cr.zones.default).toEqual({ value: "SAZ", label: "SAZ" });
    });

    it("defaults zone and country to the user country for GlobalViewer users", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: "BR",
        supportedCountries: [],
      });

      const cr = runHandleWithUser(
        user,
        {},
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, sazGeoRows),
      );

      expect(cr.country.default?.value).toBe("BRA");
      expect(cr.zones.default?.value).toBe("SAZ");
    });

    it("defaults to the user country and its zone for CountryViewer users", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["BR"],
      });

      const cr = runHandleWithUser(
        user,
        {},
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, sazGeoRows),
      );

      expect(cr.country.default).toEqual({
        value: "BRA",
        label: "Brazil",
        zone: "SAZ",
        quick_filter_label: "Brazil",
      });
      expect(cr.zones.default).toEqual({ value: "SAZ", label: "SAZ" });
    });

    it("defaults to the first available country in the user zone when the JWT country is not in values", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.SAZ],
        country: "BR",
        supportedCountries: [],
      });

      const cr = runHandleWithUser(
        user,
        {},
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, [
          { ...geoRow, zone: "SAZ", country_iso_code_3: "ARG" },
        ]),
      );

      expect(cr.zones.default).toEqual({ value: "SAZ", label: "SAZ" });
      expect(cr.country.default?.value).toBe("ARG");
    });

    it("returns null zone and country defaults when geo data has no reachable regional zones", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.EUR],
        country: "DE",
        supportedCountries: [],
      });

      const cr = runHandleWithUser(
        user,
        {},
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, [
          { ...geoRow, zone: "SAZ", country_iso_code_3: "BRA" },
        ]),
      );

      expect(cr.zones.default).toBeNull();
      expect(cr.country.default).toBeNull();
    });
  });

  describe("handle() — country default from the `country` request header", () => {
    const mazGeoRows = [
      { ...geoRow, zone: "MAZ", country_iso_code_3: "COL" },
      { ...geoRow, zone: "MAZ", country_iso_code_3: "MEX" },
      { ...geoRow, zone: "AFR", country_iso_code_3: "ZAF" },
    ];

    function withCountryHeader<T>(
      country: string | undefined,
      run: () => T,
    ): T {
      return requestContextStorage.run({ country }, run);
    }

    it("uses the header country when the JWT carries no country claim", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: null,
        supportedCountries: [],
      });

      const cr = withCountryHeader("CO", () =>
        runHandleWithUser(
          user,
          {},
          dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, mazGeoRows),
        ),
      );

      expect(cr.country.default?.value).toBe("COL");
      expect(cr.zones.default?.value).toBe("MAZ");
    });

    it("accepts an ISO3 header country as well as ISO2", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: null,
        supportedCountries: [],
      });

      const cr = withCountryHeader("COL", () =>
        runHandleWithUser(
          user,
          {},
          dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, mazGeoRows),
        ),
      );

      expect(cr.country.default?.value).toBe("COL");
    });

    it("without the header falls back to the first zone in registry order (the MARTLH-14443 symptom)", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: null,
        supportedCountries: [],
      });

      const cr = runHandleWithUser(
        user,
        {},
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, mazGeoRows),
      );

      expect(cr.country.default?.value).toBe("ZAF");
      expect(cr.zones.default?.value).toBe("AFR");
    });

    it("lets the JWT country claim win over the header", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: "MX",
        supportedCountries: [],
      });

      const cr = withCountryHeader("CO", () =>
        runHandleWithUser(
          user,
          {},
          dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, mazGeoRows),
        ),
      );

      expect(cr.country.default?.value).toBe("MEX");
    });

    it("ignores a header country the user has no access to", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: null,
        supportedCountries: ["MX"],
      });

      const cr = withCountryHeader("CO", () =>
        runHandleWithUser(
          user,
          {},
          dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, mazGeoRows),
        ),
      );

      expect(cr.country.default?.value).toBe("MEX");
    });

    it("falls back to a neighbouring zone when the user zone is absent from the catalogue", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: null,
        supportedCountries: [],
      });

      const cr = withCountryHeader("BR", () =>
        runHandleWithUser(
          user,
          {},
          dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, mazGeoRows),
        ),
      );

      expect(cr.country.default?.value).toBe("COL");
      expect(cr.zones.default?.value).toBe("MAZ");
    });

    it("applies zone affinity to the JWT country claim as well as the header", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: "BR",
        supportedCountries: [],
      });

      const cr = runHandleWithUser(
        user,
        {},
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, mazGeoRows),
      );

      expect(cr.country.default?.value).toBe("COL");
      expect(cr.zones.default?.value).toBe("MAZ");
    });

    it("keeps a far zone when no neighbouring zone is in the catalogue", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: "BR",
        supportedCountries: [],
      });

      const cr = runHandleWithUser(
        user,
        {},
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, [
          { ...geoRow, zone: "AFR", country_iso_code_3: "ZAF" },
        ]),
      );

      expect(cr.country.default?.value).toBe("ZAF");
      expect(cr.zones.default?.value).toBe("AFR");
    });

    it("ignores an unknown header country", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: null,
        supportedCountries: [],
      });

      const cr = withCountryHeader("XX", () =>
        runHandleWithUser(
          user,
          {},
          dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, mazGeoRows),
        ),
      );

      expect(cr.country.default?.value).toBe("ZAF");
    });
  });

  describe("handle() — region (from brands dataset)", () => {
    it("exposes ALL/All regions and groups de-duplicated regions by country", () => {
      const cr = runHandle(
        {},
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, [
          { ...brandRow, country_iso_code_3: "BRA", region: "South" },
          { ...brandRow, country_iso_code_3: "BRA", region: "South" },
          { ...brandRow, country_iso_code_3: "BRA", region: "North" },
        ]),
      );
      expect(cr.region.default).toEqual(FILTER_PLACEHOLDERS.region);
      expect(cr.region.values["ABI"]).toEqual([FILTER_PLACEHOLDERS.region]);
      expect(cr.region.values["BRA"].map((r) => r.value)).toEqual([
        "South",
        "North",
      ]);
    });
  });

  describe("handle() — periods (from geo dataset)", () => {
    const geoPeriodRows = [
      { ...geoRow, period: "MTH" },
      { ...geoRow, period: "L3M" },
      { ...geoRow, period: "YTD" },
    ];

    it("normalizes MTH→MTD, orders YTD→L3M→MTD and defaults to YTD with dynamic labels", () => {
      const cr = runHandle(
        {},
        kpiGroupDataset("01-06-2026"),
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, geoPeriodRows),
      );
      expect(cr.periods.values).toEqual([
        {
          value: "YTD",
          label: "YTD Jun'26",
          full: "Year To Date (YTD)",
        },
        {
          value: "L3M",
          label: "L3M Jun'26",
          full: "Last 3 Months (L3M)",
        },
        { value: "MTD", label: "Jun'26", full: "Month To Date (MTD)" },
      ]);
      expect(cr.periods.default).toEqual({
        value: "YTD",
        label: "YTD Jun'26",
        full: "Year To Date (YTD)",
      });
    });

    it("uses sku_pnl_nr when Net Revenue is selected", () => {
      const cr = runHandle(
        { commercial_results_filters: { kpi: "nr" } },
        dataset(KPI_GROUP_DATASET_ID, [
          { kpi_name: "sku_pnl", time_frame: "01-06-2026" },
          { kpi_name: "sku_pnl_nr", time_frame: "01-02-2026" },
        ]),
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, geoPeriodRows),
      );

      expect(cr.periods.values).toEqual([
        { value: "YTD", label: "YTD Feb'26", full: "Year To Date (YTD)" },
        {
          value: "L3M",
          label: "L3M Feb'26",
          full: "Last 3 Months (L3M)",
        },
        { value: "MTD", label: "Feb'26", full: "Month To Date (MTD)" },
      ]);
    });

    it("uses generic period labels when the NR group is not published", () => {
      const cr = runHandle(
        { commercial_results_filters: { kpi: "nr" } },
        kpiGroupDataset("01-06-2026"),
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, geoPeriodRows),
      );

      expect(cr.periods.values).toEqual(STATIC_PERIOD_OPTIONS);
      expect(cr.periods.default).toEqual(STATIC_PERIOD_OPTIONS[0]);
    });

    it("falls back to static kpi-group volume config when kpi-group dataset is absent", () => {
      const parsed = parseRefreshDateUtc(
        kpiGroupTimeFrame.config.sku_pnl ?? "",
      );
      if (parsed === null) {
        throw new Error("expected kpi-group sku_pnl to parse");
      }
      const firstPeriod = getMonthlyTimeframes(parsed)[0];
      if (firstPeriod === undefined) {
        throw new Error("expected at least one monthly timeframe");
      }
      const expectedYtdLabel = firstPeriod.label;

      const cr = runHandle(
        {},
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, geoPeriodRows),
      );
      expect(cr.periods.values[0]?.label).toBe(expectedYtdLabel);
      expect(cr.periods.default.label).toBe(expectedYtdLabel);
    });

    it("falls back to static period labels when volume refresh date is invalid", () => {
      const cr = runHandle(
        {},
        kpiGroupDataset("not-a-date", "volume"),
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, geoPeriodRows),
      );
      const parsed = parseRefreshDateUtc(
        kpiGroupTimeFrame.config.sku_pnl ?? "",
      );
      const allOptions = parsed
        ? getMonthlyTimeframes(parsed)
        : STATIC_PERIOD_OPTIONS;
      const periodByValue = new Map(allOptions.map((o) => [o.value, o]));
      const expectedValues = [
        periodByValue.get("YTD"),
        periodByValue.get("L3M"),
        periodByValue.get("MTD"),
      ].filter((o): o is CommercialResultsPeriodOption => o !== undefined);
      expect(cr.periods.values).toEqual(expectedValues);
      expect(cr.periods.default).toEqual(
        expectedValues[0] ?? STATIC_PERIOD_OPTIONS[0],
      );
    });

    it("defaults to the first available period when YTD is absent from geo data", () => {
      const cr = runHandle(
        {},
        kpiGroupDataset("01-06-2026"),
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, [
          { ...geoRow, period: "L3M" },
          { ...geoRow, period: "MTH" },
        ]),
      );
      expect(cr.periods.values.map((p) => p.value)).toEqual(["L3M", "MTD"]);
      expect(cr.periods.default).toEqual({
        value: "L3M",
        label: "L3M Jun'26",
        full: "Last 3 Months (L3M)",
      });
    });

    it("returns only geo-present periods in PERIOD_ORDER", () => {
      const cr = runHandle(
        {},
        kpiGroupDataset("01-06-2026"),
        dataset(COMMERCIAL_RESULTS_GEO_DATASET_ID, [
          { ...geoRow, period: "MTH" },
        ]),
      );
      expect(cr.periods.values).toEqual([
        { value: "MTD", label: "Jun'26", full: "Month To Date (MTD)" },
      ]);
      expect(cr.periods.default).toEqual({
        value: "MTD",
        label: "Jun'26",
        full: "Month To Date (MTD)",
      });
    });
  });

  describe.each([
    ["channel", "channel", FILTER_PLACEHOLDERS.channel, listOption] as const,
    [
      "pack_type",
      "pack_type",
      FILTER_PLACEHOLDERS.packType,
      listOption,
    ] as const,
    ["brands", "brand", FILTER_PLACEHOLDERS.brand, brandOption] as const,
  ])(
    "handle() — list dimension '%s' (from brands dataset)",
    (dimension, field, placeholder, mapOption) => {
      beforeEach(withImageCdn);
      afterEach(withoutImageCdn);

      it("lists real values sorted and de-duplicated, excluding All, with placeholder default", () => {
        const cr = runHandle(
          {},
          dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, [
            { ...brandRow, [field]: "All" },
            { ...brandRow, [field]: "Beta" },
            { ...brandRow, [field]: "Alpha" },
            { ...brandRow, [field]: "Beta" },
          ]),
        );
        const block = cr[dimension];
        expect(block.enabled).toBe(true);
        expect(block.default).toEqual(placeholder);
        expect(block.values[0]).toEqual(
          mapOption(placeholder.value, placeholder.label),
        );
        expect(block.values.slice(1)).toEqual([
          mapOption("Alpha", "Alpha"),
          mapOption("Beta", "Beta"),
        ]);
      });
    },
  );

  describe("handle() — brands image metadata", () => {
    beforeEach(withImageCdn);
    afterEach(withoutImageCdn);

    it("resolves known brand logos for quick filter chips", () => {
      const brutalFruitBrand = "Brutal Fruit";
      const cr = runHandle(
        {},
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, [
          { ...brandRow, brand: brutalFruitBrand },
        ]),
      );
      const option = cr.brands.values.find(
        (entry) => entry.value === brutalFruitBrand,
      );
      expect(option).toEqual(brandOption(brutalFruitBrand, brutalFruitBrand));
      expect(option?.image_url).toContain("brutal_fruit");
    });
  });

  describe("handle() — sub_brands and sku (from main dataset)", () => {
    beforeEach(withImageCdn);
    afterEach(withoutImageCdn);

    it("groups de-duplicated SKUs by brand and lists sub_brands with placeholder defaults when brand is All", () => {
      const cr = runHandle(
        {},
        dataset(COMMERCIAL_RESULTS_DATASET_ID, [
          mainRow,
          { ...mainRow, sku: "Corona Extra 330ml" },
          {
            ...mainRow,
            brand: "Brahma",
            sub_brand: "Brahma",
            sku: "Brahma 350ml",
          },
        ]),
      );
      expect(cr.sub_brands.enabled).toBe(true);
      expect(cr.sub_brands.default).toEqual(
        subBrandPlaceholderOption(FILTER_PLACEHOLDERS.subBrandNoBrand),
      );
      expect(cr.sub_brands.values[0]).toEqual(
        subBrandPlaceholderOption(FILTER_PLACEHOLDERS.subBrandNoBrand),
      );
      expect(cr.sub_brands.values.map((s) => s.value)).toContain(
        "Corona Extra",
      );
      expect(cr.sku.default).toEqual(FILTER_PLACEHOLDERS.skuNoBrand);
      expect(cr.sku.values["Corona"].map((s) => s.value)).toEqual([
        "All",
        "Corona Extra 330ml",
      ]);
      expect(cr.sku.values["Corona"][1]).toEqual({
        value: "Corona Extra 330ml",
        label: "Corona Extra 330ml",
        sub_brand: "Corona Extra",
      });
      expect(cr.sku.values["Brahma"].map((s) => s.value)).toEqual([
        "All",
        "Brahma 350ml",
      ]);
      expect(cr.sku.values["Brahma"][1]).toEqual({
        value: "Brahma 350ml",
        label: "Brahma 350ml",
        sub_brand: "Brahma",
      });
      expect(cr.sku.values["Corona"][0]).toEqual(FILTER_PLACEHOLDERS.sku);
      expect(cr.sku.values["Corona"][0]).not.toHaveProperty("sub_brand");
    });

    it("uses Select a Sub Brand / Select a SKU placeholders when a concrete brand is in the preset", () => {
      const cr = runHandle(
        { commercial_results_filters: { brand: "Corona" } },
        dataset(COMMERCIAL_RESULTS_DATASET_ID, [mainRow]),
      );
      expect(cr.sub_brands.default).toEqual(
        subBrandPlaceholderOption(FILTER_PLACEHOLDERS.subBrand),
      );
      expect(cr.sub_brands.values[0]).toEqual(
        subBrandPlaceholderOption(FILTER_PLACEHOLDERS.subBrand),
      );
      expect(cr.sku.default).toEqual(FILTER_PLACEHOLDERS.sku);
    });

    it("falls back to the brands dataset for sub_brands/sku when the main dataset is absent", () => {
      const cr = runHandle(
        {},
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, [mainRow]),
      );
      expect(cr.sub_brands.values.map((s) => s.value)).toContain(
        "Corona Extra",
      );
      expect(cr.sku.values["Corona"].map((s) => s.value)).toEqual([
        "All",
        "Corona Extra 330ml",
      ]);
      expect(cr.sku.values["Corona"][1].sub_brand).toBe("Corona Extra");
    });

    it("links each SKU to its sub_brand for multi sub-brand brands", () => {
      const brutalFruitBrand = "Brutal Fruit";
      const cr = runHandle(
        { commercial_results_filters: { brand: brutalFruitBrand } },
        dataset(COMMERCIAL_RESULTS_DATASET_ID, [
          {
            ...mainRow,
            brand: brutalFruitBrand,
            sub_brand: "Brutal Fruit Litchi",
            sku: "Bf Litchi Seche Spritzer 275ml Nrb 4x6",
          },
          {
            ...mainRow,
            brand: brutalFruitBrand,
            sub_brand: "Brutal Fruit Lorange Rossa",
            sku: "Bf L'orange Rossa 275ml Nrb 4x6",
          },
        ]),
      );

      const skus = cr.sku.values[brutalFruitBrand];
      expect(skus.map((s) => s.value)).toEqual([
        "All",
        "Bf Litchi Seche Spritzer 275ml Nrb 4x6",
        "Bf L'orange Rossa 275ml Nrb 4x6",
      ]);
      expect(skus[0]).not.toHaveProperty("sub_brand");
      expect(skus[1]).toEqual({
        value: "Bf Litchi Seche Spritzer 275ml Nrb 4x6",
        label: "Bf Litchi Seche Spritzer 275ml Nrb 4x6",
        sub_brand: "Brutal Fruit Litchi",
      });
      expect(skus[2]).toEqual({
        value: "Bf L'orange Rossa 275ml Nrb 4x6",
        label: "Bf L'orange Rossa 275ml Nrb 4x6",
        sub_brand: "Brutal Fruit Lorange Rossa",
      });

      const litchiSubBrand = cr.sub_brands.values.find(
        (entry) => entry.value === "Brutal Fruit Litchi",
      );
      expect(litchiSubBrand).toEqual(
        subBrandOption("Brutal Fruit Litchi", brutalFruitBrand),
      );
    });

    it("disables sub_brands and sku when the dataset only carries All values", () => {
      const cr = runHandle(
        {},
        dataset(COMMERCIAL_RESULTS_DATASET_ID, [geoRow]),
      );
      expect(cr.sub_brands.enabled).toBe(false);
      expect(cr.sku.enabled).toBe(false);
    });
  });

  describe("handle() — cross-filter rules (category, non_alcoholic, growth_levers, beer_price_segment, portfolios)", () => {
    const baseRow = {
      ...brandRow,
      category: "Beer",
      non_alc_beer: "No",
      growth_levers: "Lead Premium",
      beer_price_segment: "Premium",
      portfolio: "Megabrands",
    };

    const fullDatasetRows = [
      {
        ...baseRow,
        category: "Beer",
        growth_levers: "Lead Premium",
        beer_price_segment: "Super Premium",
        portfolio: "Megabrands",
        non_alc_beer: "No",
      },
      {
        ...baseRow,
        category: "Beer",
        growth_levers: "Superior Core",
        beer_price_segment: "Core+",
        portfolio: "Expansion",
        non_alc_beer: "Yes",
      },
      {
        ...baseRow,
        category: "Beer",
        growth_levers: "Balanced Choices",
        beer_price_segment: "Core",
        portfolio: "Sustain",
        non_alc_beer: "No",
      },
      {
        ...baseRow,
        category: "Adj",
        growth_levers: "Beyond Beer",
        beer_price_segment: "Value",
        portfolio: "Tail",
        non_alc_beer: "Yes",
      },
      {
        ...baseRow,
        category: "NAB",
        growth_levers: "Superior Core",
        beer_price_segment: "Premium",
        portfolio: "Megabrands",
        non_alc_beer: "No",
      },
      {
        ...baseRow,
        category: "Beer + Adj",
        growth_levers: "Lead Premium",
        beer_price_segment: "Core+",
        portfolio: "Expansion",
        non_alc_beer: "No",
      },
    ];

    function runWithFilters(
      preset: PresetDefinition,
      rows: object[],
    ): CommercialResultsFilterResponse {
      return runHandle(
        preset,
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, rows as DataItem[]),
      );
    }

    function nonPlaceholder(values: Array<{ value: string }>): string[] {
      return values.map((v) => v.value).filter((v) => v !== "All");
    }

    it("all five filters are enabled when no cross-filter is active", () => {
      const cr = runWithFilters({}, fullDatasetRows);
      expect(cr.category.enabled).toBe(true);
      expect(cr.non_alcoholic.enabled).toBe(true);
      expect(cr.growth_levers.enabled).toBe(true);
      expect(cr.beer_price_segment.enabled).toBe(true);
      expect(cr.portfolios.enabled).toBe(true);
    });

    it("returns full unrestricted values from brandRows when no cross-filter is active", () => {
      const cr = runWithFilters({}, fullDatasetRows);
      expect(nonPlaceholder(cr.category.values)).toEqual([
        "Adj",
        "Beer",
        "Beer + Adj",
        "NAB",
      ]);
      expect(nonPlaceholder(cr.non_alcoholic.values)).toEqual(["No", "Yes"]);
      expect(nonPlaceholder(cr.growth_levers.values)).toEqual([
        "Balanced Choices",
        "Beyond Beer",
        "Lead Premium",
        "Superior Core",
      ]);
      expect(nonPlaceholder(cr.beer_price_segment.values)).toEqual([
        "Core",
        "Core+",
        "Premium",
        "Super Premium",
        "Value",
      ]);
      expect(nonPlaceholder(cr.portfolios.values)).toEqual([
        "Expansion",
        "Megabrands",
        "Sustain",
        "Tail",
      ]);
    });

    describe("when category = Beer", () => {
      it("removes Beyond Beer from growth_levers while keeping all other growth_levers values", () => {
        const cr = runWithFilters(
          { commercial_results_filters: { category: "Beer" } },
          [
            { ...baseRow, growth_levers: "Lead Premium" },
            { ...baseRow, growth_levers: "Superior Core" },
            { ...baseRow, growth_levers: "Balanced Choices" },
            { ...baseRow, growth_levers: "Beyond Beer" },
          ],
        );
        const glValues = nonPlaceholder(cr.growth_levers.values);
        expect(glValues).not.toContain("Beyond Beer");
        expect(glValues).toContain("Lead Premium");
        expect(glValues).toContain("Superior Core");
        expect(glValues).toContain("Balanced Choices");
      });
    });

    describe("when category = Beer + Adj", () => {
      const preset = {
        commercial_results_filters: { category: "Beer + Adj" },
      };

      it("keeps non_alcoholic enabled (available for Beer and Beer + Adj)", () => {
        expect(runWithFilters(preset, [baseRow]).non_alcoholic.enabled).toBe(
          true,
        );
      });

      it("does not remove Beyond Beer from growth_levers (only category=Beer triggers that rule)", () => {
        const cr = runWithFilters(preset, [
          { ...baseRow, growth_levers: "Lead Premium" },
          { ...baseRow, growth_levers: "Beyond Beer" },
        ]);
        const glValues = nonPlaceholder(cr.growth_levers.values);
        expect(glValues).toContain("Beyond Beer");
        expect(glValues).toContain("Lead Premium");
      });
    });

    describe("when category = Adj", () => {
      const preset = { commercial_results_filters: { category: "Adj" } };

      it("restricts growth_levers to only Beyond Beer", () => {
        const cr = runWithFilters(preset, [
          { ...baseRow, growth_levers: "Lead Premium" },
          { ...baseRow, growth_levers: "Superior Core" },
          { ...baseRow, growth_levers: "Beyond Beer" },
        ]);
        expect(nonPlaceholder(cr.growth_levers.values)).toEqual([
          "Beyond Beer",
        ]);
      });

      it("disables non_alcoholic", () => {
        expect(runWithFilters(preset, [baseRow]).non_alcoholic.enabled).toBe(
          false,
        );
      });

      it("disables beer_price_segment", () => {
        expect(
          runWithFilters(preset, [baseRow]).beer_price_segment.enabled,
        ).toBe(false);
      });
    });

    describe("when category = NAB", () => {
      const preset = { commercial_results_filters: { category: "NAB" } };

      it("disables growth_levers, non_alcoholic, beer_price_segment and portfolios", () => {
        const cr = runWithFilters(preset, [baseRow]);
        expect(cr.growth_levers.enabled).toBe(false);
        expect(cr.non_alcoholic.enabled).toBe(false);
        expect(cr.beer_price_segment.enabled).toBe(false);
        expect(cr.portfolios.enabled).toBe(false);
      });
    });

    describe("when non_alcoholic = Yes", () => {
      const preset = { commercial_results_filters: { non_alcoholic: "Yes" } };
      const rows = [
        { ...baseRow, category: "Beer", growth_levers: "Lead Premium" },
        {
          ...baseRow,
          category: "Beer + Adj",
          growth_levers: "Lead Premium",
        },
        { ...baseRow, category: "Adj", growth_levers: "Beyond Beer" },
        { ...baseRow, category: "NAB", growth_levers: "Superior Core" },
      ];

      it("restricts category to Beer and Beer + Adj", () => {
        expect(
          nonPlaceholder(runWithFilters(preset, rows).category.values),
        ).toEqual(["Beer", "Beer + Adj"]);
      });

      it("removes Beyond Beer from growth_levers", () => {
        expect(
          nonPlaceholder(runWithFilters(preset, rows).growth_levers.values),
        ).not.toContain("Beyond Beer");
      });
    });

    describe("when non_alcoholic = No", () => {
      const preset = { commercial_results_filters: { non_alcoholic: "No" } };
      const rows = [
        { ...baseRow, category: "Beer", growth_levers: "Lead Premium" },
        {
          ...baseRow,
          category: "Beer + Adj",
          growth_levers: "Lead Premium",
        },
        { ...baseRow, category: "Adj", growth_levers: "Beyond Beer" },
      ];

      it("restricts category to Beer and Beer + Adj", () => {
        expect(
          nonPlaceholder(runWithFilters(preset, rows).category.values),
        ).toEqual(["Beer", "Beer + Adj"]);
      });

      it("removes Beyond Beer from growth_levers", () => {
        expect(
          nonPlaceholder(runWithFilters(preset, rows).growth_levers.values),
        ).not.toContain("Beyond Beer");
      });
    });

    describe("when portfolios is selected", () => {
      it("removes NAB from category while keeping other categories", () => {
        const cr = runWithFilters(
          { commercial_results_filters: { portfolios: "Megabrands" } },
          [
            { ...baseRow, category: "Beer" },
            { ...baseRow, category: "Adj" },
            { ...baseRow, category: "NAB" },
          ],
        );
        const catValues = nonPlaceholder(cr.category.values);
        expect(catValues).not.toContain("NAB");
        expect(catValues).toContain("Beer");
        expect(catValues).toContain("Adj");
      });
    });

    describe("when beer_price_segment is selected", () => {
      const preset = {
        commercial_results_filters: { beer_price_segment: "Premium" },
      };
      const rows = [
        { ...baseRow, category: "Beer", growth_levers: "Lead Premium" },
        { ...baseRow, category: "Beer", growth_levers: "Balanced Choices" },
        { ...baseRow, category: "Adj", growth_levers: "Beyond Beer" },
        { ...baseRow, category: "NAB", growth_levers: "Superior Core" },
      ];

      it("restricts category to only Beer", () => {
        expect(
          nonPlaceholder(runWithFilters(preset, rows).category.values),
        ).toEqual(["Beer"]);
      });

      it("restricts growth_levers to exactly Balanced Choices and Lead Premium", () => {
        expect(
          nonPlaceholder(runWithFilters(preset, rows).growth_levers.values),
        ).toEqual(["Balanced Choices", "Lead Premium"]);
      });
    });

    describe("when growth_levers = Superior Core", () => {
      const preset = {
        commercial_results_filters: { growth_levers: "Superior Core" },
      };

      it("restricts category to only Beer", () => {
        const cr = runWithFilters(preset, [
          { ...baseRow, category: "Beer" },
          { ...baseRow, category: "Adj" },
          { ...baseRow, category: "NAB" },
        ]);
        expect(nonPlaceholder(cr.category.values)).toEqual(["Beer"]);
      });

      it("restricts beer_price_segment to exactly Core and Value", () => {
        const cr = runWithFilters(preset, [
          { ...baseRow, beer_price_segment: "Core" },
          { ...baseRow, beer_price_segment: "Value" },
          { ...baseRow, beer_price_segment: "Core+" },
          { ...baseRow, beer_price_segment: "Premium" },
          { ...baseRow, beer_price_segment: "Super Premium" },
        ]);
        const bps = nonPlaceholder(cr.beer_price_segment.values);
        expect(bps).toHaveLength(2);
        expect(bps).toEqual(expect.arrayContaining(["Core", "Value"]));
      });
    });

    describe("when growth_levers = Lead Premium", () => {
      const preset = {
        commercial_results_filters: { growth_levers: "Lead Premium" },
      };

      it("restricts category to only Beer", () => {
        const cr = runWithFilters(preset, [
          { ...baseRow, category: "Beer" },
          { ...baseRow, category: "Adj" },
        ]);
        expect(nonPlaceholder(cr.category.values)).toEqual(["Beer"]);
      });

      it("restricts beer_price_segment to exactly Super Premium, Premium and Core+", () => {
        const cr = runWithFilters(preset, [
          { ...baseRow, beer_price_segment: "Super Premium" },
          { ...baseRow, beer_price_segment: "Premium" },
          { ...baseRow, beer_price_segment: "Core+" },
          { ...baseRow, beer_price_segment: "Core" },
          { ...baseRow, beer_price_segment: "Value" },
        ]);
        const bps = nonPlaceholder(cr.beer_price_segment.values);
        expect(bps).toHaveLength(3);
        expect(bps).toEqual(
          expect.arrayContaining(["Super Premium", "Premium", "Core+"]),
        );
      });
    });

    describe("when growth_levers = Balanced Choices", () => {
      const preset = {
        commercial_results_filters: { growth_levers: "Balanced Choices" },
      };

      it("restricts category to only Beer", () => {
        const cr = runWithFilters(preset, [
          { ...baseRow, category: "Beer" },
          { ...baseRow, category: "Adj" },
          { ...baseRow, category: "NAB" },
        ]);
        expect(nonPlaceholder(cr.category.values)).toEqual(["Beer"]);
      });

      it("does not restrict beer_price_segment beyond the available dataset values", () => {
        const cr = runWithFilters(preset, [
          { ...baseRow, beer_price_segment: "Core" },
          { ...baseRow, beer_price_segment: "Value" },
          { ...baseRow, beer_price_segment: "Premium" },
          { ...baseRow, beer_price_segment: "Super Premium" },
        ]);
        const bps = nonPlaceholder(cr.beer_price_segment.values);
        expect(bps).toHaveLength(4);
        expect(bps).toEqual(
          expect.arrayContaining(["Core", "Value", "Premium", "Super Premium"]),
        );
      });
    });

    describe("when growth_levers = Beyond Beer", () => {
      const preset = {
        commercial_results_filters: { growth_levers: "Beyond Beer" },
      };

      it("restricts category to only Adj", () => {
        const cr = runWithFilters(preset, [
          { ...baseRow, category: "Beer" },
          { ...baseRow, category: "Adj" },
          { ...baseRow, category: "NAB" },
        ]);
        expect(nonPlaceholder(cr.category.values)).toEqual(["Adj"]);
      });

      it("disables beer_price_segment", () => {
        expect(
          runWithFilters(preset, [baseRow]).beer_price_segment.enabled,
        ).toBe(false);
      });

      it("disables non_alcoholic", () => {
        expect(runWithFilters(preset, [baseRow]).non_alcoholic.enabled).toBe(
          false,
        );
      });
    });

    describe("when non_alcoholic and beer_price_segment are selected simultaneously", () => {
      it("restricts category to exactly Beer — both rules apply additively without contradiction", () => {
        const cr = runWithFilters(
          {
            commercial_results_filters: {
              non_alcoholic: "Yes",
              beer_price_segment: "Core",
            },
          },
          [
            { ...baseRow, category: "Beer" },
            { ...baseRow, category: "Adj" },
            { ...baseRow, category: "NAB" },
          ],
        );
        expect(nonPlaceholder(cr.category.values)).toEqual(["Beer"]);
      });
    });

    describe("when category = Beer and growth_levers = Superior Core are selected simultaneously", () => {
      it("removes Beyond Beer from growth_levers and restricts beer_price_segment to Core and Value", () => {
        const cr = runWithFilters(
          {
            commercial_results_filters: {
              category: "Beer",
              growth_levers: "Superior Core",
            },
          },
          [
            { ...baseRow, growth_levers: "Lead Premium" },
            { ...baseRow, growth_levers: "Superior Core" },
            { ...baseRow, growth_levers: "Beyond Beer" },
            { ...baseRow, beer_price_segment: "Core" },
            { ...baseRow, beer_price_segment: "Value" },
            { ...baseRow, beer_price_segment: "Premium" },
          ],
        );
        const glValues = nonPlaceholder(cr.growth_levers.values);
        expect(glValues).not.toContain("Beyond Beer");
        expect(glValues).toContain("Lead Premium");
        expect(glValues).toContain("Superior Core");

        const bps = nonPlaceholder(cr.beer_price_segment.values);
        expect(bps).toHaveLength(2);
        expect(bps).toEqual(expect.arrayContaining(["Core", "Value"]));
      });
    });

    describe.each(["Core", "Value"])(
      "when beer_price_segment = %s",
      (segment) => {
        const preset = {
          commercial_results_filters: { beer_price_segment: segment },
        };

        it("restricts growth_levers to exactly Balanced Choices and Superior Core", () => {
          const cr = runWithFilters(preset, [
            { ...baseRow, growth_levers: "Superior Core" },
            { ...baseRow, growth_levers: "Balanced Choices" },
            { ...baseRow, growth_levers: "Lead Premium" },
            { ...baseRow, growth_levers: "Beyond Beer" },
          ]);
          expect(nonPlaceholder(cr.growth_levers.values)).toEqual([
            "Balanced Choices",
            "Superior Core",
          ]);
        });
      },
    );

    describe.each(["Super Premium", "Premium", "Core+"])(
      "when beer_price_segment = %s",
      (segment) => {
        const preset = {
          commercial_results_filters: { beer_price_segment: segment },
        };

        it("restricts growth_levers to exactly Balanced Choices and Lead Premium", () => {
          const cr = runWithFilters(preset, [
            { ...baseRow, growth_levers: "Superior Core" },
            { ...baseRow, growth_levers: "Balanced Choices" },
            { ...baseRow, growth_levers: "Lead Premium" },
            { ...baseRow, growth_levers: "Beyond Beer" },
          ]);
          expect(nonPlaceholder(cr.growth_levers.values)).toEqual([
            "Balanced Choices",
            "Lead Premium",
          ]);
        });
      },
    );

    describe("when growth_levers = Superior Core and beer_price_segment = Core are selected simultaneously", () => {
      it("keeps the selected growth lever available and restricts both lists to the valid pairing", () => {
        const cr = runWithFilters(
          {
            commercial_results_filters: {
              growth_levers: "Superior Core",
              beer_price_segment: "Core",
            },
          },
          [
            { ...baseRow, growth_levers: "Superior Core" },
            { ...baseRow, growth_levers: "Balanced Choices" },
            { ...baseRow, growth_levers: "Lead Premium" },
            { ...baseRow, beer_price_segment: "Core" },
            { ...baseRow, beer_price_segment: "Value" },
            { ...baseRow, beer_price_segment: "Premium" },
          ],
        );
        expect(nonPlaceholder(cr.growth_levers.values)).toEqual([
          "Balanced Choices",
          "Superior Core",
        ]);
        expect(nonPlaceholder(cr.beer_price_segment.values)).toEqual([
          "Core",
          "Value",
        ]);
      });
    });

    describe("when growth_levers and portfolios are selected simultaneously", () => {
      it("restricts category to exactly Beer and never includes NAB", () => {
        const cr = runWithFilters(
          {
            commercial_results_filters: {
              growth_levers: "Lead Premium",
              portfolios: "Megabrands",
            },
          },
          [
            { ...baseRow, category: "Beer" },
            { ...baseRow, category: "Adj" },
            { ...baseRow, category: "NAB" },
          ],
        );
        const catValues = nonPlaceholder(cr.category.values);
        expect(catValues).toEqual(["Beer"]);
        expect(catValues).not.toContain("NAB");
      });
    });

    describe("bidirectional narrowing between portfolios, growth_levers and beer_price_segment (ticket 131472)", () => {
      const combinationRows = [
        {
          ...baseRow,
          growth_levers: "Superior Core",
          beer_price_segment: "Value",
          portfolio: "Tail",
        },
        {
          ...baseRow,
          growth_levers: "Superior Core",
          beer_price_segment: "Value",
          portfolio: "Megabrands",
        },
        {
          ...baseRow,
          growth_levers: "Superior Core",
          beer_price_segment: "Core",
          portfolio: "Sustain",
        },
        {
          ...baseRow,
          growth_levers: "Lead Premium",
          beer_price_segment: "Value",
          portfolio: "Megabrands",
        },
      ];

      it.each<[string, Partial<CommercialResultsPresetConfig>, string[]]>([
        [
          "growth_levers and beer_price_segment both active (ticket repro)",
          { growth_levers: "Superior Core", beer_price_segment: "Value" },
          ["Megabrands", "Tail"],
        ],
        [
          "growth_levers active alone (beer_price_segment is All)",
          { growth_levers: "Superior Core" },
          ["Megabrands", "Sustain", "Tail"],
        ],
        [
          "beer_price_segment active alone (growth_levers is All)",
          { beer_price_segment: "Value" },
          ["Megabrands", "Tail"],
        ],
        [
          "no cross-filter active (reverts to the full unrestricted set)",
          {},
          ["Megabrands", "Sustain", "Tail"],
        ],
      ])(
        "restricts portfolios to rows matching the active drivers — %s",
        (_description, filters, expected) => {
          const cr = runWithFilters(
            { commercial_results_filters: filters },
            combinationRows,
          );
          expect(nonPlaceholder(cr.portfolios.values)).toEqual(expected);
        },
      );

      it("narrows portfolios for growth_levers=Beyond Beer from real data, not a hardcoded allow-list", () => {
        const beyondBeerRows = [
          {
            ...baseRow,
            growth_levers: "Beyond Beer",
            beer_price_segment: "Value",
            portfolio: "Megabrands",
          },
          {
            ...baseRow,
            growth_levers: "Beyond Beer",
            beer_price_segment: "Value",
            portfolio: "Expansion",
          },
          {
            ...baseRow,
            growth_levers: "Beyond Beer",
            beer_price_segment: "Value",
            portfolio: "Sustain",
          },
          {
            ...baseRow,
            growth_levers: "Superior Core",
            beer_price_segment: "Value",
            portfolio: "Tail",
          },
        ];
        const cr = runWithFilters(
          { commercial_results_filters: { growth_levers: "Beyond Beer" } },
          beyondBeerRows,
        );
        // Includes Sustain, which a hardcoded {Megabrands, Expansion} allow-list
        // would have wrongly excluded — proves the fix is data-driven.
        expect(nonPlaceholder(cr.portfolios.values)).toEqual([
          "Expansion",
          "Megabrands",
          "Sustain",
        ]);
      });

      it("does not change growth_levers or beer_price_segment output when portfolios narrowing is applied", () => {
        const preset = {
          commercial_results_filters: {
            growth_levers: "Superior Core",
            beer_price_segment: "Value",
          },
        };
        const cr = runWithFilters(preset, combinationRows);
        expect(nonPlaceholder(cr.growth_levers.values)).toEqual([
          "Superior Core",
        ]);
        // buildBeerPriceSegment's existing growth_levers-based rule (untouched
        // by this fix) keeps both Core and Value for growth_levers=Superior Core.
        expect(nonPlaceholder(cr.beer_price_segment.values)).toEqual([
          "Core",
          "Value",
        ]);
      });

      it("restricts growth_levers and beer_price_segment to rows matching the selected portfolio (reverse direction)", () => {
        const cr = runWithFilters(
          { commercial_results_filters: { portfolios: "Sustain" } },
          combinationRows,
        );
        // Only row 3 (Superior Core / Core / Sustain) matches — both siblings
        // narrow down from their full 2-value sets to just that one value.
        expect(nonPlaceholder(cr.growth_levers.values)).toEqual([
          "Superior Core",
        ]);
        expect(nonPlaceholder(cr.beer_price_segment.values)).toEqual(["Core"]);
      });

      it("restricts beer_price_segment to rows matching the selected portfolio even when growth_levers stays unrestricted", () => {
        const cr = runWithFilters(
          { commercial_results_filters: { portfolios: "Megabrands" } },
          combinationRows,
        );
        // Rows 2 and 4 both have portfolio=Megabrands but only beer_price_segment=Value —
        // proves portfolios narrows beer_price_segment even without a growth_levers rule for it.
        expect(nonPlaceholder(cr.beer_price_segment.values)).toEqual(["Value"]);
      });
    });

    describe("when a V2 filter scopes hierarchy dimensions", () => {
      const beerHierarchyRow = {
        ...baseRow,
        brand: "Castle Lite",
        sub_brand: "Castle Lite",
        sku: "Castle Lite 330ml",
        channel: "On Trade",
        pack_type: "Bottle",
        category: "Beer",
      };
      const adjHierarchyRow = {
        ...baseRow,
        brand: "Brutal Fruit",
        sub_brand: "Brutal Fruit Ruby Apple",
        sku: "Brutal Fruit Ruby Apple 275ml",
        channel: "Off Trade",
        pack_type: "Can",
        category: "Adj",
      };

      it("filters Brand, Channel, Pack Type, Sub-Brand and SKU by the active V2 selection", () => {
        const cr = runWithFilters(
          { commercial_results_filters: { category: "Beer" } },
          [beerHierarchyRow, adjHierarchyRow],
        );

        expect(nonPlaceholder(cr.brands.values)).toEqual(["Castle Lite"]);
        expect(nonPlaceholder(cr.channel.values)).toEqual(["On Trade"]);
        expect(nonPlaceholder(cr.pack_type.values)).toEqual(["Bottle"]);
        expect(nonPlaceholder(cr.sub_brands.values)).toEqual(["Castle Lite"]);
        expect(Object.keys(cr.sku.values)).toEqual(["Castle Lite"]);
        expect(
          cr.sku.values["Castle Lite"].map((option) => option.value),
        ).toEqual(["All", "Castle Lite 330ml"]);
      });
    });

    describe("cross-filter with camelCase keys (post-applyOverrides HTTP path)", () => {
      const rowsWithCategories = [
        { ...baseRow, category: "Beer", growth_levers: "Lead Premium" },
        {
          ...baseRow,
          category: "Beer + Adj",
          growth_levers: "Lead Premium",
        },
        { ...baseRow, category: "Adj", growth_levers: "Beyond Beer" },
        { ...baseRow, category: "NAB", growth_levers: "Superior Core" },
      ];

      it("nonAlcoholic=Yes restricts category to Beer and Beer + Adj and removes Beyond Beer from growth_levers", () => {
        const cr = runWithFilters(
          { commercial_results_filters: { nonAlcoholic: "Yes" } },
          rowsWithCategories,
        );
        expect(nonPlaceholder(cr.category.values)).toEqual([
          "Beer",
          "Beer + Adj",
        ]);
        expect(nonPlaceholder(cr.growth_levers.values)).not.toContain(
          "Beyond Beer",
        );
      });

      it("beerPriceSegment=Premium restricts category to Beer and removes Beyond Beer from growth_levers", () => {
        const cr = runWithFilters(
          { commercial_results_filters: { beerPriceSegment: "Premium" } },
          rowsWithCategories,
        );
        expect(nonPlaceholder(cr.category.values)).toEqual(["Beer"]);
        expect(nonPlaceholder(cr.growth_levers.values)).not.toContain(
          "Beyond Beer",
        );
      });

      it("growthLevers=Superior Core restricts category to Beer and beer_price_segment to Core and Value", () => {
        const cr = runWithFilters(
          { commercial_results_filters: { growthLevers: "Superior Core" } },
          [
            { ...baseRow, category: "Beer" },
            { ...baseRow, category: "Adj" },
            { ...baseRow, category: "NAB" },
            { ...baseRow, beer_price_segment: "Core" },
            { ...baseRow, beer_price_segment: "Value" },
            { ...baseRow, beer_price_segment: "Premium" },
          ],
        );
        expect(nonPlaceholder(cr.category.values)).toEqual(["Beer"]);
        const bps = nonPlaceholder(cr.beer_price_segment.values);
        expect(bps).toHaveLength(2);
        expect(bps).toEqual(expect.arrayContaining(["Core", "Value"]));
      });

      it("growthLevers=Beyond Beer restricts category to Adj and disables beer_price_segment and non_alcoholic", () => {
        const cr = runWithFilters(
          { commercial_results_filters: { growthLevers: "Beyond Beer" } },
          [
            { ...baseRow, category: "Beer" },
            { ...baseRow, category: "Adj" },
            { ...baseRow, category: "NAB" },
          ],
        );
        expect(nonPlaceholder(cr.category.values)).toEqual(["Adj"]);
        expect(cr.beer_price_segment.enabled).toBe(false);
        expect(cr.non_alcoholic.enabled).toBe(false);
      });
    });

    describe("invalid sentinel values (N/A)", () => {
      it("excludes N/A from growth_levers when mixed with valid values", () => {
        const cr = runWithFilters({}, [
          { ...baseRow, growth_levers: "N/A" },
          { ...baseRow, growth_levers: "Lead Premium" },
          { ...baseRow, growth_levers: "Superior Core" },
        ]);
        const glValues = nonPlaceholder(cr.growth_levers.values);
        expect(glValues).toEqual(
          expect.arrayContaining(["Lead Premium", "Superior Core"]),
        );
        expect(glValues).not.toContain("N/A");
      });

      it("excludes N/A from beer_price_segment when mixed with valid values", () => {
        const cr = runWithFilters({}, [
          { ...baseRow, beer_price_segment: "N/A" },
          { ...baseRow, beer_price_segment: "Premium" },
          { ...baseRow, beer_price_segment: "Core" },
        ]);
        const bpsValues = nonPlaceholder(cr.beer_price_segment.values);
        expect(bpsValues).toEqual(expect.arrayContaining(["Premium", "Core"]));
        expect(bpsValues).not.toContain("N/A");
      });

      it("excludes N/A from portfolios when mixed with valid values", () => {
        const cr = runWithFilters({}, [
          { ...baseRow, portfolio: "N/A" },
          { ...baseRow, portfolio: "Megabrands" },
          { ...baseRow, portfolio: "Tail" },
        ]);
        const portfolioValues = nonPlaceholder(cr.portfolios.values);
        expect(portfolioValues).toEqual(
          expect.arrayContaining(["Megabrands", "Tail"]),
        );
        expect(portfolioValues).not.toContain("N/A");
      });

      it("disables growth_levers when only N/A values exist", () => {
        const cr = runWithFilters({}, [{ ...baseRow, growth_levers: "N/A" }]);
        expect(cr.growth_levers.enabled).toBe(false);
        expect(cr.growth_levers.values).toEqual([]);
      });

      it("disables beer_price_segment when only N/A values exist", () => {
        const cr = runWithFilters({}, [
          { ...baseRow, beer_price_segment: "N/A" },
        ]);
        expect(cr.beer_price_segment.enabled).toBe(false);
        expect(cr.beer_price_segment.values).toEqual([]);
      });

      it("disables portfolios when only N/A values exist", () => {
        const cr = runWithFilters({}, [{ ...baseRow, portfolio: "N/A" }]);
        expect(cr.portfolios.enabled).toBe(false);
        expect(cr.portfolios.values).toEqual([]);
      });
    });

    describe("value integrity", () => {
      it("all five filter fields return only non-empty string values when no cross-filter is active", () => {
        const cr = runWithFilters({}, fullDatasetRows);
        for (const field of [
          cr.category,
          cr.non_alcoholic,
          cr.growth_levers,
          cr.beer_price_segment,
          cr.portfolios,
        ]) {
          for (const opt of field.values) {
            expect(typeof opt.value).toBe("string");
            expect(opt.value.trim().length).toBeGreaterThan(0);
          }
        }
      });

      it("no filter field returns an empty or whitespace value under any cross-filter restriction", () => {
        const scenarios: PresetDefinition[] = [
          { commercial_results_filters: { category: "Beer" } },
          { commercial_results_filters: { category: "Adj" } },
          { commercial_results_filters: { growth_levers: "Beyond Beer" } },
          { commercial_results_filters: { growth_levers: "Superior Core" } },
          { commercial_results_filters: { non_alcoholic: "Yes" } },
          { commercial_results_filters: { beer_price_segment: "Core" } },
          { commercial_results_filters: { portfolios: "Megabrands" } },
        ];

        for (const preset of scenarios) {
          const cr = runWithFilters(preset, fullDatasetRows);
          for (const field of [
            cr.category,
            cr.non_alcoholic,
            cr.growth_levers,
            cr.beer_price_segment,
            cr.portfolios,
          ]) {
            for (const opt of field.values) {
              expect(opt.value.trim().length).toBeGreaterThan(0);
            }
          }
        }
      });
    });
  });

  describe("handle() — brand-scoped region, channel, and pack_type (tier 3)", () => {
    const hoegaardenBrand = "Hoegaarden";

    const brandsUnionRows = [
      {
        ...brandRow,
        country_iso_code_3: "ZAF",
        region: "Cape",
        brand: hoegaardenBrand,
        channel: "In Home",
        pack_type: "Dr",
      },
      {
        ...brandRow,
        country_iso_code_3: "ZAF",
        region: "Central",
        brand: hoegaardenBrand,
        channel: "Main Market",
        pack_type: "Can",
      },
      {
        ...brandRow,
        country_iso_code_3: "ZAF",
        region: "Cape",
        brand: "Red Bull",
        channel: "Out Of Home",
        pack_type: "Can",
      },
    ];

    const hoegaardenMainRows = [
      {
        ...mainRow,
        country_iso_code_3: "ZAF",
        region: "Cape",
        brand: hoegaardenBrand,
        channel: "In Home",
        pack_type: "Dr",
      },
      {
        ...mainRow,
        country_iso_code_3: "ZAF",
        region: "Central",
        brand: hoegaardenBrand,
        channel: "Out Of Home",
        pack_type: "Dr",
      },
    ];

    it("restricts channel, pack_type, and region to the selected brand main dataset", () => {
      const cr = runHandle(
        { commercial_results_filters: { brand: hoegaardenBrand } },
        dataset(COMMERCIAL_RESULTS_DATASET_ID, hoegaardenMainRows),
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, brandsUnionRows),
      );

      expect(cr.channel.values.map((v) => v.value)).toEqual([
        "All",
        "In Home",
        "Out Of Home",
      ]);
      expect(cr.pack_type.values.map((v) => v.value)).toEqual(["All", "Dr"]);
      expect(cr.region.values["ZAF"].map((r) => r.value)).toEqual([
        "Cape",
        "Central",
      ]);
    });

    it("restricts V2 classification filters to the selected brand main dataset", () => {
      const blackCrownBrand = "Black Crown";

      const brandsUnionRowsWithNab = [
        {
          ...brandRow,
          country_iso_code_3: "ZAF",
          brand: blackCrownBrand,
          category: "Adj",
          growth_levers: "Beyond Beer",
          non_alc_beer: "No",
          beer_price_segment: "Core",
          portfolio: "Tail",
        },
        {
          ...brandRow,
          country_iso_code_3: "ZAF",
          brand: blackCrownBrand,
          category: "Beer + Adj",
          growth_levers: "Lead Premium",
          non_alc_beer: "Yes",
          beer_price_segment: "Premium",
          portfolio: "Megabrands",
        },
        {
          ...brandRow,
          country_iso_code_3: "ZAF",
          brand: "Some NAB Brand",
          category: "NAB",
          growth_levers: "Balanced Choices",
          non_alc_beer: "No",
          beer_price_segment: "Value",
          portfolio: "Sustain",
        },
      ];

      const blackCrownMainRows = [
        {
          ...mainRow,
          country_iso_code_3: "ZAF",
          brand: blackCrownBrand,
          category: "Adj",
          growth_levers: "Beyond Beer",
          non_alc_beer: "No",
          beer_price_segment: "Core",
          portfolio: "Tail",
        },
        {
          ...mainRow,
          country_iso_code_3: "ZAF",
          brand: blackCrownBrand,
          category: "Beer + Adj",
          growth_levers: "Lead Premium",
          non_alc_beer: "Yes",
          beer_price_segment: "Premium",
          portfolio: "Megabrands",
        },
      ];

      const cr = runHandle(
        { commercial_results_filters: { brand: blackCrownBrand } },
        dataset(COMMERCIAL_RESULTS_DATASET_ID, blackCrownMainRows),
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, brandsUnionRowsWithNab),
      );

      const categoryValues = cr.category.values
        .map((v) => v.value)
        .filter((v) => v !== "All");
      expect(categoryValues).toEqual(["Adj", "Beer + Adj"]);
      expect(categoryValues).not.toContain("NAB");

      const growthLeversValues = cr.growth_levers.values
        .map((v) => v.value)
        .filter((v) => v !== "All");
      expect(growthLeversValues).toEqual(["Beyond Beer", "Lead Premium"]);

      const portfolioValues = cr.portfolios.values
        .map((v) => v.value)
        .filter((v) => v !== "All");
      expect(portfolioValues).toEqual(["Megabrands", "Tail"]);
    });

    it("keeps the country-wide union when brand is All (tier 2)", () => {
      const cr = runHandle(
        {},
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, brandsUnionRows),
      );

      expect(cr.channel.values.map((v) => v.value)).toEqual([
        "All",
        "In Home",
        "Main Market",
        "Out Of Home",
      ]);
      expect(cr.pack_type.values.map((v) => v.value)).toEqual([
        "All",
        "Can",
        "Dr",
      ]);
      expect(cr.region.values["ZAF"].map((r) => r.value)).toEqual([
        "Cape",
        "Central",
      ]);
    });

    it("restricts region to brand-specific rows (e.g. Newlands Spring only in Cape)", () => {
      const newlandsBrand = "Newlands Spring";
      const cr = runHandle(
        { commercial_results_filters: { brand: newlandsBrand } },
        dataset(COMMERCIAL_RESULTS_DATASET_ID, [
          {
            ...mainRow,
            country_iso_code_3: "ZAF",
            region: "Cape",
            brand: newlandsBrand,
            channel: "In Home",
            pack_type: "Nrb",
          },
        ]),
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, [
          {
            ...brandRow,
            country_iso_code_3: "ZAF",
            region: "Cape",
            brand: newlandsBrand,
            channel: "In Home",
            pack_type: "Nrb",
          },
          {
            ...brandRow,
            country_iso_code_3: "ZAF",
            region: "Inland",
            brand: "Corona",
            channel: "Main Market",
            pack_type: "Nrb",
          },
        ]),
      );

      expect(cr.region.values["ZAF"].map((r) => r.value)).toEqual(["Cape"]);
    });
  });

  describe("handle() — flat-driver cross-filtering (tier 2)", () => {
    const crossFilterRows = [
      {
        ...brandRow,
        country_iso_code_3: "ZAF",
        region: "Cape",
        brand: "Newlands Spring",
        channel: "In Home",
        pack_type: "Nrb",
      },
      {
        ...brandRow,
        country_iso_code_3: "ZAF",
        region: "Central",
        brand: "Hoegaarden",
        channel: "In Home",
        pack_type: "Dr",
      },
      {
        ...brandRow,
        country_iso_code_3: "ZAF",
        region: "Cape",
        brand: "Red Bull",
        channel: "Out Of Home",
        pack_type: "Can",
      },
    ];

    it("restricts brands, region, and pack_type when channel is selected first", () => {
      const cr = runHandle(
        { commercial_results_filters: { channel: "In Home" } },
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, crossFilterRows),
      );

      expect(cr.brands.values.map((v) => v.value)).toEqual([
        "All",
        "Hoegaarden",
        "Newlands Spring",
      ]);
      expect(cr.channel.values.map((v) => v.value)).toEqual([
        "All",
        "In Home",
        "Out Of Home",
      ]);
      expect(cr.pack_type.values.map((v) => v.value)).toEqual([
        "All",
        "Dr",
        "Nrb",
      ]);
      expect(cr.region.values["ZAF"].map((r) => r.value)).toEqual([
        "Cape",
        "Central",
      ]);
    });

    it("keeps all region options selectable when a region is already selected", () => {
      const cr = runHandle(
        { commercial_results_filters: { region: "Cape" } },
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, crossFilterRows),
      );

      expect(cr.region.values["ZAF"].map((r) => r.value)).toEqual([
        "Cape",
        "Central",
      ]);
    });

    it("restricts brands when region is selected first", () => {
      const cr = runHandle(
        { commercial_results_filters: { region: "Cape" } },
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, crossFilterRows),
      );

      expect(cr.brands.values.map((v) => v.value)).toEqual([
        "All",
        "Newlands Spring",
        "Red Bull",
      ]);
    });

    it("restricts brands when pack_type is selected first", () => {
      const cr = runHandle(
        { commercial_results_filters: { pack_type: "Can" } },
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, crossFilterRows),
      );

      expect(cr.brands.values.map((v) => v.value)).toEqual(["All", "Red Bull"]);
    });

    it("restricts brands when packType override uses camelCase from query parser", () => {
      const cr = runHandle(
        { commercial_results_filters: { packType: "Can" } },
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, crossFilterRows),
      );

      expect(cr.brands.values.map((v) => v.value)).toEqual(["All", "Red Bull"]);
      expect(cr.pack_type.values.map((v) => v.value)).toEqual([
        "All",
        "Can",
        "Dr",
        "Nrb",
      ]);
    });

    it("intersects channel and brand drivers (scenario C)", () => {
      const cr = runHandle(
        {
          commercial_results_filters: {
            brand: "Newlands Spring",
            channel: "In Home",
          },
        },
        dataset(COMMERCIAL_RESULTS_DATASET_ID, [
          {
            ...mainRow,
            country_iso_code_3: "ZAF",
            region: "Cape",
            brand: "Newlands Spring",
            channel: "In Home",
            pack_type: "Nrb",
          },
        ]),
        dataset(COMMERCIAL_RESULTS_BRANDS_DATASET_ID, crossFilterRows),
      );

      expect(cr.channel.values.map((v) => v.value)).toEqual(["All", "In Home"]);
      expect(cr.brands.values.map((v) => v.value)).toEqual([
        "All",
        "Hoegaarden",
        "Newlands Spring",
      ]);
    });
  });
});

import { getCountryFlag } from "@common/utils/images/country-image.utils";
import { performanceToolHandler } from "@domain/config/presets/performance-tool/performance-tool.handler";
import { performanceToolAssetKeyIncludesLogical } from "@domain/config/presets/performance-tool/performance-tool.global-image-assets";
import {
  PERFORMANCE_TOOL_DATASET_ID,
  PERFORMANCE_TOOL_FILTER_SP_NAME,
} from "@domain/config/presets/performance-tool/performance-tool.types";
import {
  DeltalakeExecutionType,
  DeltalakeFetchDataConfig,
} from "@domain/factories/dataset-repository.factory";
import { KPI_GROUP_DATASET_ID } from "@domain/config/presets/kpi-group/kpi-group.types";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import { Dataset } from "@domain/entities/common/base-config.entity";

function unwrapPerformanceTool(
  result: PresetResponse,
): Record<string, unknown> {
  const inner = result["performance-tool"];
  if (!inner || typeof inner !== "object") {
    throw new Error('Expected result["performance-tool"] preset payload');
  }
  return inner as Record<string, unknown>;
}

function assetUrlForLogicalKey(
  assets: Record<string, unknown>,
  logicalKey: string,
): string {
  for (const [k, v] of Object.entries(assets)) {
    if (typeof v !== "string") continue;
    if (performanceToolAssetKeyIncludesLogical(k, logicalKey)) return v;
  }
  throw new Error(`Missing asset logical key: ${logicalKey}`);
}

describe("performanceToolHandler", () => {
  it("declares the performance-tool filter as an owr_result_query_sp call", () => {
    const ds = performanceToolHandler.datasets?.() ?? [];
    const filterDataset = ds.find((d) => d.id === PERFORMANCE_TOOL_DATASET_ID);
    expect(filterDataset).toBeDefined();

    const { procedure, executionType } = filterDataset!
      .config as DeltalakeFetchDataConfig;
    expect(procedure).toContain("{{DATABRICKS_SCHEMA}}.owr_result_query_sp");
    expect(procedure).toContain(PERFORMANCE_TOOL_FILTER_SP_NAME);
    expect(procedure).toContain('"environment"');
    expect(executionType).toBe(DeltalakeExecutionType.procedure);
  });

  it("also declares the kpi-group dataset so refresh dates are query-backed", () => {
    const ds = performanceToolHandler.datasets?.() ?? [];
    expect(ds).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: KPI_GROUP_DATASET_ID,
          config: expect.objectContaining({
            query: "presets/kpi-group/kpi-group",
            type: expect.any(String),
          }),
        }),
      ]),
    );
  });

  it("returns kpis_filter, zones, countries, and kpi from mock when dataset is empty", () => {
    const preset: PresetDefinition = {};
    const result = performanceToolHandler.handle(preset, []);
    const block = unwrapPerformanceTool(result);

    expect(Array.isArray(block.kpis_filter)).toBe(true);
    expect((block.kpis_filter as unknown[]).length).toBe(6);
    expect(block.zones).toBeDefined();
    expect(block.countries).toBeDefined();
    const countries = block.countries as Array<Record<string, unknown>>;
    const abi = countries.find((c) => c.id === "ABI");
    expect(abi?.image_url).toBe(getCountryFlag("ABI"));
    const eurAgg = countries.find((c) => c.id === "EUR");
    expect(eurAgg?.image_url).toBe(getCountryFlag("ABI"));
    const zones = block.zones as Array<Record<string, unknown>>;
    const abiZone = zones.find((z) => z.value === "ABI");
    expect(abiZone?.image_url).toBe(getCountryFlag("ABI"));
    const eurZone = zones.find((z) => z.value === "EUR");
    expect(eurZone?.image_url).toBe(getCountryFlag("EUR"));
    const brandAssets = block.brand_assets as Record<string, unknown>;
    expect(brandAssets).toBeDefined();
    expect(block.subbrand_assets).toBeUndefined();
    for (const b of [
      "Budweiser",
      "Corona",
      "Michelob Ultra",
      "Stella Artois",
    ] as const) {
      const entryKey = Object.keys(brandAssets).find((k) =>
        performanceToolAssetKeyIncludesLogical(k, b),
      );
      expect(entryKey).toBeDefined();
      const url = brandAssets[entryKey!];
      expect(typeof url).toBe("string");
      expect(url).toMatch(/square\.png$/);
      expect(url).not.toContain("no-image-available");
    }
    const kpi = block.kpi as Record<string, unknown>;
    expect(kpi.volume).toBeDefined();
    expect(kpi.power).toBeDefined();
    expect((kpi.nr as Record<string, unknown>)?.relations).toEqual(
      (kpi.volume as Record<string, unknown>)?.relations,
    );
    expect((kpi.cores as Record<string, unknown>)?.relations).toEqual(
      (kpi.volume as Record<string, unknown>)?.relations,
    );
  });

  it("ingests a VOLUME row and surfaces country in zone_countries", () => {
    const preset: PresetDefinition = {};
    const datasets: Dataset[] = [
      {
        id: PERFORMANCE_TOOL_DATASET_ID,
        data: [
          {
            filter: "VOLUME",
            ABI_ZONE: "AFR",
            COUNTRY_ISO_CODE_3: "ZAF",
            RAW_GEOGRAPHY: "South Africa",
            RAW_BRAND: "BrandX",
            SEGMENT: "Megabrands",
            SUBBRAND: "",
            GROWTHLEVER: "Superior Core",
            GLOBALBRAND: "",
            PRICE_TIER: "",
          },
        ],
      },
    ];
    const result = performanceToolHandler.handle(preset, datasets);
    const block = unwrapPerformanceTool(result);
    const vol = (block.kpi as Record<string, unknown>).volume as Record<
      string,
      unknown
    >;
    const rel = vol.relations as Record<string, unknown>;
    const zc = rel.zone_countries as Record<string, string>;
    expect(zc.AFR).toContain("ZAF");
    const globalBa = block.brand_assets as Record<string, unknown>;
    expect(
      Object.keys(globalBa).find((k) =>
        performanceToolAssetKeyIncludesLogical(k, "BrandX"),
      ),
    ).toBeUndefined();
    const zones = block.zones as Array<Record<string, unknown>>;
    const afr = zones.find((z) => z.value === "AFR");
    expect(afr?.image_url).toBe(getCountryFlag("AFR"));
  });

  it("ingests lowercase columns the same way as uppercase ones", () => {
    const upper = performanceToolHandler.handle({}, [
      {
        id: PERFORMANCE_TOOL_DATASET_ID,
        data: [
          {
            KPI_NAME: "VOLUME",
            ABI_ZONE: "AFR",
            COUNTRY_ISO_CODE_3: "ZAF",
            RAW_GEOGRAPHY: "South Africa",
            RAW_BRAND: "BrandX",
            SEGMENT: "Megabrands",
            SUBBRAND: "",
            GROWTHLEVER: "Superior Core",
            GLOBALBRAND: "",
            PRICE_TIER: "",
          },
        ],
      },
    ]);
    const lower = performanceToolHandler.handle({}, [
      {
        id: PERFORMANCE_TOOL_DATASET_ID,
        data: [
          {
            kpi_name: "VOLUME",
            abi_zone: "AFR",
            country_iso_code_3: "ZAF",
            raw_geography: "South Africa",
            raw_brand: "BrandX",
            segment: "Megabrands",
            subbrand: "",
            growthlever: "Superior Core",
            globalbrand: "",
            price_tier: "",
          },
        ],
      },
    ]);

    expect(unwrapPerformanceTool(lower)).toEqual(unwrapPerformanceTool(upper));

    const vol = (unwrapPerformanceTool(lower).kpi as Record<string, unknown>)
      .volume as Record<string, unknown>;
    const zc = (vol.relations as Record<string, unknown>)
      .zone_countries as Record<string, string>;
    expect(zc.AFR).toContain("ZAF");
  });

  it("uses RAW_BRAND only for All Brands / Portfolio (SUBBRAND ignored)", () => {
    const datasets: Dataset[] = [
      {
        id: PERFORMANCE_TOOL_DATASET_ID,
        data: [
          {
            filter: "VOLUME",
            ABI_ZONE: "AFR",
            COUNTRY_ISO_CODE_3: "ZAF",
            RAW_GEOGRAPHY: "South Africa",
            RAW_BRAND: "Budweiser",
            SEGMENT: "Megabrands",
            SUBBRAND: "ShouldNotAppearInBrandLists",
            GROWTHLEVER: "Superior Core",
            GLOBALBRAND: "",
            PRICE_TIER: "",
          },
        ],
      },
    ];
    const result = performanceToolHandler.handle({}, datasets);
    const block = unwrapPerformanceTool(result);
    const vol = (block.kpi as Record<string, unknown>).volume as Record<
      string,
      unknown
    >;
    const rel = vol.relations as Record<string, unknown>;
    const allBrands = rel.brand_classification as Record<string, unknown>;
    const ab = allBrands["All Brands"] as Record<string, string>;
    expect(ab.ZAF).toContain("Budweiser");
    expect(ab.ZAF).not.toContain("ShouldNotAppearInBrandLists");

    const portfolio = allBrands.Portfolio as Record<string, unknown>;
    const meg = portfolio.Megabrands as Record<string, unknown>;
    const megBrands = meg.brands as Record<string, string>;
    expect(megBrands.ZAF).toContain("Budweiser");
    expect(megBrands.ZAF).not.toContain("ShouldNotAppearInBrandLists");

    const globalBa = block.brand_assets as Record<string, unknown>;
    expect(assetUrlForLogicalKey(globalBa, "Budweiser")).toMatch(
      /square\.png$/,
    );
    for (const logicalKey of [
      "ShouldNotAppearInBrandLists",
      "Budweiser|ShouldNotAppearInBrandLists",
    ] as const) {
      const k = Object.keys(globalBa).find((x) =>
        performanceToolAssetKeyIncludesLogical(x, logicalKey),
      );
      if (k !== undefined) {
        expect(String(globalBa[k])).toMatch(/square\.png$/);
      }
    }
  });

  it("derives Time Period dates for every enabled KPI from its group", () => {
    const datasets: Dataset[] = [
      {
        id: KPI_GROUP_DATASET_ID,
        data: [
          { kpi_name: "volume", time_frame: "15-07-2099" },
          { kpi_name: "finance", time_frame: "15-05-2099" },
        ],
      },
    ];
    const result = performanceToolHandler.handle({}, datasets);
    const block = unwrapPerformanceTool(result);
    const kpis = block.kpi as Record<string, unknown>;
    const vol = kpis.volume as Record<string, unknown>;
    const nr = kpis.nr as Record<string, unknown>;
    const cores = kpis.cores as Record<string, unknown>;
    const periods = vol.periods as { values: { label: string }[] };
    const labels = periods.values.map((p) => p.label).join("|");
    expect(labels).toContain("Jul'99");
    expect(vol.time_period).toEqual({
      values: [
        { value: "YTD", label: "Year to Date" },
        { value: "HALF", label: "Half" },
        { value: "QTR", label: "Quarter" },
        { value: "R3M", label: "Rolling 3 Months" },
        { value: "MTH", label: "Month" },
        { value: "FY", label: "Full Year" },
      ],
      default: { value: "YTD", label: "Year to Date" },
      max_dt_end: "2099-07-01",
      default_dt_end: "2099-07-01",
    });
    expect(nr.time_period).toEqual(
      expect.objectContaining({
        max_dt_end: "2099-05-01",
        default_dt_end: "2099-05-01",
      }),
    );
    expect(cores.time_period).toEqual(
      expect.objectContaining({
        max_dt_end: "2099-05-01",
        default_dt_end: "2099-05-01",
      }),
    );
  });

  it("keeps country_brands isolated per KPI (no shared nested objects)", () => {
    const datasets: Dataset[] = [
      {
        id: PERFORMANCE_TOOL_DATASET_ID,
        data: [
          {
            filter: "VOLUME",
            ABI_ZONE: "AFR",
            COUNTRY_ISO_CODE_3: "ZAF",
            RAW_GEOGRAPHY: "South Africa",
            RAW_BRAND: "Budweiser",
            SEGMENT: "",
            SUBBRAND: "",
            GROWTHLEVER: "",
            GLOBALBRAND: "",
            PRICE_TIER: "",
          },
          {
            filter: "POWER",
            ABI_ZONE: "AFR",
            COUNTRY_ISO_CODE_3: "ZAF",
            RAW_GEOGRAPHY: "South Africa",
            RAW_BRAND: "Antarctica - Others",
            SEGMENT: "",
            SUBBRAND: "",
            GROWTHLEVER: "",
            GLOBALBRAND: "",
            PRICE_TIER: "",
          },
        ],
      },
    ];
    const result = performanceToolHandler.handle({}, datasets);
    const block = unwrapPerformanceTool(result);
    const kpi = block.kpi as Record<string, unknown>;

    const volAb = (
      (
        (kpi.volume as Record<string, unknown>).relations as Record<
          string,
          unknown
        >
      ).brand_classification as Record<string, unknown>
    )["All Brands"] as Record<string, string>;
    const powerAb = (
      (
        (kpi.power as Record<string, unknown>).relations as Record<
          string,
          unknown
        >
      ).brand_classification as Record<string, unknown>
    )["All Brands"] as Record<string, string>;

    expect(volAb.ZAF).toContain("Budweiser");
    expect(volAb.ZAF).not.toContain("Antarctica - Others");
    expect(powerAb.ZAF).toContain("Antarctica - Others");
    expect(powerAb.ZAF).not.toContain("Budweiser");

    const unionBrands = block.brand_assets as Record<string, unknown>;
    expect(assetUrlForLogicalKey(unionBrands, "Budweiser")).toMatch(
      /square\.png$/,
    );
    expect(
      Object.keys(unionBrands).find((k) =>
        performanceToolAssetKeyIncludesLogical(k, "Antarctica - Others"),
      ),
    ).toBeUndefined();
  });

  it("surfaces REGION values per country, skips blank and Residual (any case or spacing), no global entry", () => {
    const datasets: Dataset[] = [
      {
        id: PERFORMANCE_TOOL_DATASET_ID,
        data: [
          {
            KPI_NAME: "POWER",
            ABI_ZONE: "AFR",
            COUNTRY_ISO_CODE_3: "ZAF",
            RAW_GEOGRAPHY: "South Africa",
            RAW_BRAND: "Budweiser",
            SEGMENT: "Megabrands",
            SUBBRAND: "",
            GROWTHLEVER: "",
            GLOBALBRAND: "",
            PRICE_TIER: "",
            REGION: "Gauteng",
          },
          {
            KPI_NAME: "POWER",
            ABI_ZONE: "AFR",
            COUNTRY_ISO_CODE_3: "ZAF",
            RAW_GEOGRAPHY: "South Africa",
            RAW_BRAND: "Budweiser",
            SEGMENT: "Megabrands",
            SUBBRAND: "",
            GROWTHLEVER: "",
            GLOBALBRAND: "",
            PRICE_TIER: "",
            REGION: "",
          },
          {
            KPI_NAME: "POWER",
            ABI_ZONE: "AFR",
            COUNTRY_ISO_CODE_3: "ZAF",
            RAW_GEOGRAPHY: "South Africa",
            RAW_BRAND: "Budweiser",
            SEGMENT: "Megabrands",
            SUBBRAND: "",
            GROWTHLEVER: "",
            GLOBALBRAND: "",
            PRICE_TIER: "",
            REGION: "Residual",
          },
          {
            KPI_NAME: "POWER",
            ABI_ZONE: "AFR",
            COUNTRY_ISO_CODE_3: "ZAF",
            RAW_GEOGRAPHY: "South Africa",
            RAW_BRAND: "Budweiser",
            SEGMENT: "Megabrands",
            SUBBRAND: "",
            GROWTHLEVER: "",
            GLOBALBRAND: "",
            PRICE_TIER: "",
            REGION: "  Residual  ",
          },
        ],
      },
    ];
    const result = performanceToolHandler.handle({}, datasets);
    const block = unwrapPerformanceTool(result);
    const region = block.region as {
      default: { value: string; label: string };
      values: Record<string, Array<{ value: string; label: string }>>;
    };

    expect(region.default).toEqual({ value: "All", label: "Select a Region" });
    expect(region.values.ABI).toBeUndefined();
    expect(region.values.ZAF).toEqual([{ value: "Gauteng", label: "Gauteng" }]);
  });
});

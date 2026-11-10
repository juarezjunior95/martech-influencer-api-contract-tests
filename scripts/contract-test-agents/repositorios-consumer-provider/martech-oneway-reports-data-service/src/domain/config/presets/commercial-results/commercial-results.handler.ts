import {
  Dataset,
  DatasetConfig,
  Filter,
} from "@domain/entities/common/base-config.entity";
import {
  PresetDefinition,
  PresetResponse,
  trimByCountryAccess,
} from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { UserEntity } from "@domain/entities/user.entity";
import {
  createDeltalakeFetchDataConfig,
  createDeltalakeProcedureFetchDataConfig,
} from "@domain/factories/dataset-repository.factory";
import kpiGroupTimeFrame from "@domain/config/config-groups/kpi-group-time-frame.config";
import { kpiGroupHandler } from "@domain/config/presets/kpi-group/kpi-group.handler";
import {
  KPI_GROUP_DATASET_ID,
  KPI_GROUP_DATASET_QUERY,
} from "@domain/config/presets/kpi-group/kpi-group.types";
import {
  getMonthlyTimeframes,
  parseRefreshDateUtc,
} from "@domain/config/presets/performance-tool/performance-tool.periods";
import {
  CommercialResultsFilterRawRow,
  CommercialResultsFilterResponse,
  CommercialResultsCountryEntry,
  CommercialResultsListDimension,
  CommercialResultsZoneOption,
  CommercialResultsPeriodOption,
  CommercialResultsOption,
  CommercialResultsSkuOption,
  CommercialResultsPresetConfig,
  COMMERCIAL_RESULTS_DATASET_ID,
  COMMERCIAL_RESULTS_BRANDS_DATASET_ID,
  COMMERCIAL_RESULTS_GEO_DATASET_ID,
  COMMERCIAL_RESULTS_SP_NAME,
  filterRowsByActiveDrivers,
  isCommercialResultsBrandAll,
  isCommercialResultsPresetConfig,
  normalizeCommercialResultsPresetConfig,
} from "./commercial-results.types";
import {
  BEER_PRICE_SEGMENT_ALLOWED_SET,
  COMMERCIAL_RESULTS_DEFAULT_KPI,
  COMMERCIAL_RESULTS_KPI_OPTIONS,
  COMMERCIAL_RESULTS_PERIOD_KPI_GROUPS,
  FILTER_PLACEHOLDERS,
  GROWTH_LEVERS_ALLOWED_SET,
  PERIOD_ORDER,
  PERIOD_NORMALIZATION,
  PORTFOLIOS_ALLOWED_SET,
  STATIC_PERIOD_OPTIONS,
} from "./commercial-results.constants";
import { computeEffectiveZones } from "@domain/config/presets/common/effective-zones";
import {
  computeZoneCountryDefaults,
  type ZoneCountryEntry,
} from "@domain/config/presets/common/zone-country-defaults";
import { countriesRegistry } from "@domain/registries/countries.registry";
import { zonesRegistry } from "@domain/registries/zones.registry";
import { getBrandImageFields } from "@common/utils/images/brand-image.utils";
import { resolveCommercialGeoDefault } from "./commercial-results.geo-defaults";

const GLOBAL_ZONE = "ABI";

const createCommercialResultsProcedureConfig = (
  parameters: string[],
  staticParams?: Record<string, string>,
) => ({
  ...createDeltalakeProcedureFetchDataConfig({
    functionName: COMMERCIAL_RESULTS_SP_NAME,
    parameters,
    staticParams,
  }),
  parameters,
});

const COMMERCIAL_RESULTS_CLASSIFICATION_DRIVER_KEYS = [
  "category",
  "non_alcoholic",
  "growth_levers",
  "beer_price_segment",
  "portfolios",
] as const;

class CommercialResultsPresetHandler implements IPresetHandler<PresetDefinition> {
  get name(): string {
    return this.constructor.name;
  }

  filters(): Filter[] {
    return [
      { name: "country", value: "ABI" },
      { name: "zone", value: "ABI" },
      { name: "brand", value: "All" },
      { name: "kpi", value: "volume" },
    ];
  }

  datasets(expanded?: PresetDefinition): DatasetConfig[] {
    const cfg = this.resolvePresetConfig(expanded);
    const isBrandAll = isCommercialResultsBrandAll(cfg);

    const mainConfig: DatasetConfig = {
      id: COMMERCIAL_RESULTS_DATASET_ID,
      config: createCommercialResultsProcedureConfig([
        "country",
        "zone",
        "brand",
        "kpi",
      ]),
    };

    const brandsConfig: DatasetConfig = {
      id: COMMERCIAL_RESULTS_BRANDS_DATASET_ID,
      config: createCommercialResultsProcedureConfig(
        ["country", "zone", "kpi"],
        {
          brand: "All",
        },
      ),
    };

    const geoConfig: DatasetConfig = {
      id: COMMERCIAL_RESULTS_GEO_DATASET_ID,
      config: createCommercialResultsProcedureConfig(["kpi"], {
        country: "ABI",
        zone: "ABI",
        brand: "All",
      }),
    };

    const kpiGroupConfig: DatasetConfig = {
      id: KPI_GROUP_DATASET_ID,
      config: createDeltalakeFetchDataConfig({
        query: KPI_GROUP_DATASET_QUERY,
      }),
    };

    const isGlobalContext = !cfg?.country || cfg.country === "ABI";

    if (isGlobalContext) {
      return isBrandAll
        ? [kpiGroupConfig, geoConfig]
        : [kpiGroupConfig, mainConfig, geoConfig];
    }

    return isBrandAll
      ? [kpiGroupConfig, brandsConfig, geoConfig]
      : [kpiGroupConfig, mainConfig, brandsConfig, geoConfig];
  }

  handle(
    preset: PresetDefinition,
    datasets?: Dataset[],
    user?: UserEntity,
  ): PresetResponse {
    if (user?.policy.mode === "deny") {
      return this.emptyResponse();
    }

    const cfg = this.resolvePresetConfig(preset);
    const isBrandAll = isCommercialResultsBrandAll(cfg);

    const rows = this.extractRows(datasets, COMMERCIAL_RESULTS_DATASET_ID);
    const brandRows = this.extractRows(
      datasets,
      COMMERCIAL_RESULTS_BRANDS_DATASET_ID,
    );
    const geoRows = this.extractRows(
      datasets,
      COMMERCIAL_RESULTS_GEO_DATASET_ID,
    );

    const effectiveRows = rows.length > 0 ? rows : brandRows;
    const baseDimensionRows = isBrandAll ? brandRows : effectiveRows;
    const brandListRows = filterRowsByActiveDrivers(brandRows, cfg, {
      skipKeys: ["brand"],
    });
    const regionRows = filterRowsByActiveDrivers(baseDimensionRows, cfg, {
      skipKeys: ["region"],
    });
    const channelRows = filterRowsByActiveDrivers(baseDimensionRows, cfg, {
      skipKeys: ["channel"],
    });
    const packTypeRows = filterRowsByActiveDrivers(baseDimensionRows, cfg, {
      skipKeys: ["pack_type"],
    });
    const portfolioRows = filterRowsByActiveDrivers(baseDimensionRows, cfg, {
      skipKeys: ["portfolios"],
    });
    const scopedEffectiveRows = filterRowsByActiveDrivers(effectiveRows, cfg);
    const classificationRows = filterRowsByActiveDrivers(
      baseDimensionRows,
      cfg,
      {
        skipKeys: [...COMMERCIAL_RESULTS_CLASSIFICATION_DRIVER_KEYS],
      },
    );
    // growth_levers/beer_price_segment already narrow each other and
    // category/non_alcoholic via hardcoded rules below; this additionally
    // lets an active portfolios selection narrow them by real row
    // co-occurrence, mirroring buildPortfolio's own data-driven narrowing.
    const rowsNarrowedByPortfolio = filterRowsByActiveDrivers(
      baseDimensionRows,
      cfg,
      {
        skipKeys: [
          "category",
          "non_alcoholic",
          "growth_levers",
          "beer_price_segment",
        ],
      },
    );

    const geoSource = geoRows.length > 0 ? geoRows : brandRows;
    const { country, zones } = buildGeoFilters(geoSource, user);
    const region = this.buildRegion(regionRows, user);

    const subBrandPlaceholder = isBrandAll
      ? FILTER_PLACEHOLDERS.subBrandNoBrand
      : FILTER_PLACEHOLDERS.subBrand;

    const response: PresetResponse = {
      kpis: {
        enabled: true,
        default: { ...COMMERCIAL_RESULTS_DEFAULT_KPI },
        values: COMMERCIAL_RESULTS_KPI_OPTIONS.map((option) => ({ ...option })),
      },
      zones,
      country,
      region,
      periods: this.buildPeriods(geoSource, datasets, cfg?.kpi),
      brands: this.buildList(
        brandListRows.map((r) => r.brand),
        FILTER_PLACEHOLDERS.brand,
        (value, label) => ({
          value,
          label,
          ...getBrandImageFields(value),
        }),
      ),
      sub_brands: this.buildSubBrandList(
        scopedEffectiveRows,
        subBrandPlaceholder,
      ),
      channel: this.buildList(
        channelRows.map((r) => r.channel),
        FILTER_PLACEHOLDERS.channel,
      ),
      pack_type: this.buildList(
        packTypeRows.map((r) => r.pack_type),
        FILTER_PLACEHOLDERS.packType,
      ),
      sku: this.buildSku(scopedEffectiveRows, isBrandAll),
      category: this.buildCategory(classificationRows, cfg),
      non_alcoholic: this.buildNonAlcBeer(classificationRows, cfg),
      growth_levers: this.buildGrowthLevers(rowsNarrowedByPortfolio, cfg),
      beer_price_segment: this.buildBeerPriceSegment(
        rowsNarrowedByPortfolio,
        cfg,
      ),
      portfolios: this.buildPortfolio(portfolioRows, cfg),
    };

    return response;
  }

  private resolvePresetConfig(
    preset?: PresetDefinition,
  ): CommercialResultsPresetConfig | undefined {
    const raw = preset?.["commercial_results_filters"];
    if (!isCommercialResultsPresetConfig(raw)) return undefined;
    return normalizeCommercialResultsPresetConfig(raw);
  }

  private emptyResponse(): PresetResponse {
    return {
      kpis: { enabled: false, default: null, values: [] },
      zones: { enabled: false, default: null, values: [] },
      country: { enabled: false, default: null, values: {} },
      region: { enabled: false, default: null, values: {} },
      periods: { enabled: false, default: null, values: [] },
      brands: { enabled: false, default: null, values: [] },
      sub_brands: { enabled: false, default: null, values: [] },
      channel: { enabled: false, default: null, values: [] },
      pack_type: { enabled: false, default: null, values: [] },
      sku: { enabled: false, default: null, values: {} },
      category: { enabled: false, default: null, values: [] },
      non_alcoholic: { enabled: false, default: null, values: [] },
      growth_levers: { enabled: false, default: null, values: [] },
      beer_price_segment: { enabled: false, default: null, values: [] },
      portfolios: { enabled: false, default: null, values: [] },
    };
  }

  private extractRows(
    datasets: Dataset[] | undefined,
    id: string,
  ): CommercialResultsFilterRawRow[] {
    return (datasets?.find((d) => d.id === id)?.data ??
      []) as unknown as CommercialResultsFilterRawRow[];
  }

  private buildRegion(
    rows: CommercialResultsFilterRawRow[],
    user?: UserEntity,
  ): CommercialResultsFilterResponse["region"] {
    const byCountry = groupByKey(
      rows,
      (r) => r.country_iso_code_3,
      (r) => r.region,
      (region): CommercialResultsOption => ({ value: region, label: region }),
    );

    const rawValues: Record<string, CommercialResultsOption[]> = {
      ABI: [FILTER_PLACEHOLDERS.region],
    };

    for (const [country, entries] of Object.entries(byCountry)) {
      if (country !== "ABI") rawValues[country] = entries;
    }

    const values = user
      ? trimByCountryAccess(rawValues, user, { keepKeys: ["ABI"] })
      : rawValues;

    return {
      enabled: true,
      default: FILTER_PLACEHOLDERS.region,
      values,
    };
  }

  private resolvePeriodRefreshDate(datasets?: Dataset[], kpi?: string): string {
    const kpiGroup =
      kpi?.toLowerCase() === "nr"
        ? COMMERCIAL_RESULTS_PERIOD_KPI_GROUPS.nr
        : COMMERCIAL_RESULTS_PERIOD_KPI_GROUPS.volume;
    const queried = kpiGroupHandler.handle({}, datasets);
    const fromQuery = queried[kpiGroup];

    if (typeof fromQuery === "string" && fromQuery.length > 0) {
      return fromQuery;
    }

    return kpiGroup === COMMERCIAL_RESULTS_PERIOD_KPI_GROUPS.volume
      ? (kpiGroupTimeFrame.config.sku_pnl ?? "")
      : "";
  }

  private buildPeriods(
    rows: CommercialResultsFilterRawRow[],
    datasets?: Dataset[],
    kpi?: string,
  ): CommercialResultsFilterResponse["periods"] {
    const present = new Set(
      uniqueClean(rows.map((r) => r.period)).map(
        (p) => PERIOD_NORMALIZATION[p] ?? p,
      ),
    );

    const refresh = this.resolvePeriodRefreshDate(datasets, kpi);
    const parsed = parseRefreshDateUtc(refresh);
    const allOptions = parsed
      ? getMonthlyTimeframes(parsed)
      : STATIC_PERIOD_OPTIONS;
    const periodByValue = new Map(allOptions.map((o) => [o.value, o]));

    const values = PERIOD_ORDER.filter((p) => present.has(p))
      .map((p) => periodByValue.get(p))
      .filter((o): o is CommercialResultsPeriodOption => o !== undefined);

    const defaultOption =
      (present.has("YTD") ? periodByValue.get("YTD") : undefined) ??
      values[0] ??
      STATIC_PERIOD_OPTIONS[0];

    return {
      enabled: true,
      default: defaultOption,
      values,
    };
  }

  private buildList(
    rawValues: (string | undefined | null)[],
    placeholder: CommercialResultsOption,
    mapOption: (value: string, label: string) => CommercialResultsOption = (
      value,
      label,
    ) => ({ value, label }),
  ): CommercialResultsListDimension {
    const options = uniqueClean(rawValues)
      .map((value) => mapOption(value, value))
      .sort(byValue);

    if (options.length === 0) {
      return { enabled: false, default: null, values: [] };
    }

    return {
      enabled: true,
      default: placeholder,
      values: [mapOption(placeholder.value, placeholder.label), ...options],
    };
  }

  private buildSubBrandList(
    rows: CommercialResultsFilterRawRow[],
    placeholder: CommercialResultsOption,
  ): CommercialResultsListDimension {
    const subBrandToBrand = new Map<string, string>();
    for (const row of rows) {
      if (isClean(row.sub_brand) && isClean(row.brand)) {
        subBrandToBrand.set(row.sub_brand, row.brand);
      }
    }

    const placeholderWithImage: CommercialResultsOption = {
      ...placeholder,
      ...getBrandImageFields(placeholder.value),
    };
    const options = [...subBrandToBrand.keys()]
      .sort(byString)
      .map<CommercialResultsOption>((value) => {
        const brandFamily = subBrandToBrand.get(value);
        return {
          value,
          label: value,
          ...getBrandImageFields(
            value,
            brandFamily ? { brand_family: brandFamily } : undefined,
          ),
        };
      });

    if (options.length === 0) {
      return { enabled: false, default: null, values: [] };
    }

    return {
      enabled: true,
      default: placeholderWithImage,
      values: [placeholderWithImage, ...options],
    };
  }

  private buildCategory(
    rows: CommercialResultsFilterRawRow[],
    cfg: CommercialResultsPresetConfig | undefined,
  ): CommercialResultsListDimension {
    let values = uniqueClean(rows.map((r) => r.category));

    const gl = cfg?.growth_levers;
    if (gl === "Beyond Beer") {
      values = values.filter((v) => v === "Adj");
    } else if (isClean(gl)) {
      values = values.filter((v) => v === "Beer");
    }
    if (isClean(cfg?.beer_price_segment))
      values = values.filter((v) => v === "Beer");
    if (isClean(cfg?.non_alcoholic))
      values = values.filter((v) => v === "Beer" || v === "Beer + Adj");
    if (isClean(cfg?.portfolios)) values = values.filter((v) => v !== "NAB");

    return this.buildList(values, FILTER_PLACEHOLDERS.category);
  }

  private buildNonAlcBeer(
    rows: CommercialResultsFilterRawRow[],
    cfg: CommercialResultsPresetConfig | undefined,
  ): CommercialResultsListDimension {
    const cat = cfg?.category;
    if (
      cat === "Adj" ||
      cat === "NAB" ||
      cfg?.growth_levers === "Beyond Beer"
    ) {
      return { enabled: false, default: null, values: [] };
    }
    return this.buildList(
      rows.map((r) => r.non_alc_beer),
      FILTER_PLACEHOLDERS.nonAlcoholic,
    );
  }

  private buildGrowthLevers(
    rows: CommercialResultsFilterRawRow[],
    cfg: CommercialResultsPresetConfig | undefined,
  ): CommercialResultsListDimension {
    const cat = cfg?.category;
    if (cat === "NAB") return { enabled: false, default: null, values: [] };

    let values = filterToAllowedValues(
      uniqueClean(rows.map((r) => r.growth_levers)),
      GROWTH_LEVERS_ALLOWED_SET,
    );

    if (cat === "Adj") {
      values = values.filter((v) => v === "Beyond Beer");
    } else if (
      cat === "Beer" ||
      isClean(cfg?.non_alcoholic) ||
      isClean(cfg?.beer_price_segment)
    ) {
      values = values.filter((v) => v !== "Beyond Beer");
    }

    const bps = cfg?.beer_price_segment;
    if (bps === "Core" || bps === "Value") {
      values = values.filter(
        (v) => v === "Superior Core" || v === "Balanced Choices",
      );
    } else if (
      bps === "Super Premium" ||
      bps === "Premium" ||
      bps === "Core+"
    ) {
      values = values.filter(
        (v) => v === "Lead Premium" || v === "Balanced Choices",
      );
    }

    return this.buildList(values, FILTER_PLACEHOLDERS.growthLevers);
  }

  private buildBeerPriceSegment(
    rows: CommercialResultsFilterRawRow[],
    cfg: CommercialResultsPresetConfig | undefined,
  ): CommercialResultsListDimension {
    const cat = cfg?.category;
    const gl = cfg?.growth_levers;

    if (cat === "Adj" || cat === "NAB" || gl === "Beyond Beer") {
      return { enabled: false, default: null, values: [] };
    }

    let values = filterToAllowedValues(
      uniqueClean(rows.map((r) => r.beer_price_segment)),
      BEER_PRICE_SEGMENT_ALLOWED_SET,
    );

    if (gl === "Superior Core") {
      values = values.filter((v) => v === "Core" || v === "Value");
    } else if (gl === "Lead Premium") {
      values = values.filter(
        (v) => v === "Super Premium" || v === "Premium" || v === "Core+",
      );
    }

    return this.buildList(values, FILTER_PLACEHOLDERS.beerPriceSegment);
  }

  private buildPortfolio(
    rows: CommercialResultsFilterRawRow[],
    cfg: CommercialResultsPresetConfig | undefined,
  ): CommercialResultsListDimension {
    if (cfg?.category === "NAB")
      return { enabled: false, default: null, values: [] };
    return this.buildList(
      filterToAllowedValues(
        uniqueClean(rows.map((r) => r.portfolio)),
        PORTFOLIOS_ALLOWED_SET,
      ),
      FILTER_PLACEHOLDERS.portfolios,
    );
  }

  private buildSku(
    rows: CommercialResultsFilterRawRow[],
    isBrandAll: boolean,
  ): CommercialResultsFilterResponse["sku"] {
    const placeholder = isBrandAll
      ? FILTER_PLACEHOLDERS.skuNoBrand
      : FILTER_PLACEHOLDERS.sku;

    const byBrand = groupSkuByBrand(rows);

    const brands = Object.keys(byBrand);
    if (brands.length === 0) {
      return { enabled: false, default: null, values: {} };
    }

    const skuPlaceholder = FILTER_PLACEHOLDERS.sku;
    const values: Record<string, CommercialResultsSkuOption[]> = {};
    for (const brand of brands) {
      values[brand] = [skuPlaceholder, ...byBrand[brand]];
    }

    return {
      enabled: true,
      default: placeholder,
      values,
    };
  }
}

/** Builds country + zone dimensions (values and user-aware defaults). */
function buildGeoFilters(
  geoRows: CommercialResultsFilterRawRow[],
  user?: UserEntity,
): Pick<CommercialResultsFilterResponse, "country" | "zones"> {
  const countryValues = buildCountryValues(geoRows, user);
  const zoneValues = buildZoneValues(geoRows, countryValues);

  const { effective: reachable } = computeEffectiveZones(undefined, user);
  const geoZoneIds = new Set(
    uniqueClean(geoRows.map((r) => r.zone)).filter((z) => z !== GLOBAL_ZONE),
  );
  const regionalEffective = reachable.filter(
    (z) =>
      z !== GLOBAL_ZONE &&
      geoZoneIds.has(z) &&
      Boolean(countryValues[z]?.length),
  );

  const availableCountryIds = new Set(
    Object.values(countryValues).flatMap((entries) =>
      entries.map((e) => e.value),
    ),
  );
  const defaults =
    regionalEffective.length > 0
      ? (resolveCommercialGeoDefault(
          user,
          regionalEffective,
          availableCountryIds,
        ) ??
        computeZoneCountryDefaults(
          regionalEffective,
          user,
          availableCountryIds,
        ))
      : null;

  return {
    country: {
      enabled: true,
      default: defaults
        ? toCountryDefault(defaults.country, countryValues)
        : null,
      values: countryValues,
    },
    zones: {
      enabled: true,
      default: defaults ? toZoneDefault(defaults.zone) : null,
      values: zoneValues,
    },
  };
}

function buildCountryValues(
  rows: CommercialResultsFilterRawRow[],
  user?: UserEntity,
): Record<string, CommercialResultsCountryEntry[]> {
  const byZone = groupByKey(
    rows,
    (r) => r.zone,
    (r) => r.country_iso_code_3,
    (iso, zone): CommercialResultsCountryEntry => {
      const record = countriesRegistry[iso];
      return {
        value: iso,
        label: record?.title ?? iso,
        zone,
        quick_filter_label: record?.quick_filter_label ?? iso,
      };
    },
  );
  for (const zone of Object.keys(byZone)) byZone[zone].sort(byValue);

  const values: Record<string, CommercialResultsCountryEntry[]> = {};
  for (const [zone, entries] of Object.entries(byZone)) {
    if (zone !== GLOBAL_ZONE) values[zone] = entries;
  }

  if (user?.policy.mode === "explicit") {
    for (const zone of Object.keys(values)) {
      if (zone === GLOBAL_ZONE) continue;
      values[zone] = values[zone].filter((e) => user.hasCountryAccess(e.value));
      if (values[zone].length === 0) delete values[zone];
    }
  }

  return values;
}

function buildZoneValues(
  rows: CommercialResultsFilterRawRow[],
  countryValues: Record<string, CommercialResultsCountryEntry[]>,
): CommercialResultsZoneOption[] {
  const survivingZones = new Set(
    Object.keys(countryValues).filter((z) => z !== GLOBAL_ZONE),
  );

  return uniqueClean(rows.map((r) => r.zone))
    .filter((zone) => zone !== GLOBAL_ZONE && survivingZones.has(zone))
    .map<CommercialResultsZoneOption>((zone) => ({
      value: zone,
      label: zonesRegistry[zone]?.title ?? zone,
    }))
    .sort(byValue);
}

function toCountryDefault(
  picked: ZoneCountryEntry,
  countryValues: Record<string, CommercialResultsCountryEntry[]>,
): CommercialResultsCountryEntry {
  const record = countriesRegistry[picked.value];
  const zone = record?.zone ?? "";
  return (
    countryValues[zone]?.find((entry) => entry.value === picked.value) ?? {
      value: picked.value,
      label: record?.title ?? picked.label,
      zone,
      quick_filter_label:
        record?.quick_filter_label ?? picked.quick_filter_label,
    }
  );
}

function toZoneDefault(picked: ZoneCountryEntry): CommercialResultsZoneOption {
  return {
    value: picked.value,
    label: zonesRegistry[picked.value]?.title ?? picked.label,
  };
}

function isClean(value: string | undefined | null): value is string {
  return !!value && value.toLowerCase() !== "all";
}

const byValue = (a: { value: string }, b: { value: string }): number =>
  a.value.localeCompare(b.value);

const byString = (a: string, b: string): number => a.localeCompare(b);

function uniqueClean(values: (string | undefined | null)[]): string[] {
  return [...new Set(values.filter(isClean))];
}

function filterToAllowedValues(
  values: string[],
  allowed: ReadonlySet<string>,
): string[] {
  return values.filter((value) => allowed.has(value));
}

function groupSkuByBrand(
  rows: CommercialResultsFilterRawRow[],
): Record<string, CommercialResultsSkuOption[]> {
  const groups = new Map<
    string,
    { seen: Set<string>; options: CommercialResultsSkuOption[] }
  >();

  for (const { brand, sku, sub_brand } of rows) {
    if (!isClean(brand) || !isClean(sku)) continue;

    let group = groups.get(brand);
    if (!group) {
      group = { seen: new Set(), options: [] };
      groups.set(brand, group);
    }
    if (group.seen.has(sku)) continue;

    group.seen.add(sku);
    const option: CommercialResultsSkuOption = { value: sku, label: sku };
    if (isClean(sub_brand)) {
      option.sub_brand = sub_brand;
    }
    group.options.push(option);
  }

  return Object.fromEntries(
    [...groups.entries()].map(([brand, { options }]) => [brand, options]),
  );
}

function groupByKey<T>(
  rows: CommercialResultsFilterRawRow[],
  selectKey: (row: CommercialResultsFilterRawRow) => string,
  selectValue: (row: CommercialResultsFilterRawRow) => string,
  makeItem: (value: string, key: string) => T,
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  const seen: Record<string, Set<string>> = {};

  for (const row of rows) {
    const key = selectKey(row);
    const value = selectValue(row);
    if (!isClean(key) || !isClean(value)) continue;

    if (!groups[key]) {
      groups[key] = [];
      seen[key] = new Set();
    }
    if (!seen[key].has(value)) {
      seen[key].add(value);
      groups[key].push(makeItem(value, key));
    }
  }

  return groups;
}

export const commercialResultsHandler = new CommercialResultsPresetHandler();

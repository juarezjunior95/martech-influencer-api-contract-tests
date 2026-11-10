import {
  ALL_BRANDS,
  BEER_PRICE_SEGMENT,
  COUNTRY_EUR,
  COUNTRY_GLOBAL,
  COUNTRY_MAPPING,
  GLOBAL_BRANDS,
  KPIS_MAPPING,
  PORTFOLIO,
  PORTFOLIO_ORDER,
  REGION_PLACEHOLDER,
  ZONE_EUR,
  ZONE_GLOBAL,
  ZONE_MAPPING,
} from "@domain/config/presets/performance-tool/performance-tool.constants";
import {
  buildPeriodOptionsForKpi,
  buildTimePeriodConfig,
} from "@domain/config/presets/performance-tool/performance-tool.periods";
import {
  getGlobalDefault,
  getGlRules,
  isGlClassificationAvailable,
  SOURCE_GLOBAL_BRANDS,
  VALUE_ALL,
} from "@domain/config/presets/performance-tool/performance-tool.ui-rules";
import type { BoolTree } from "@domain/config/presets/performance-tool/performance-tool.relation-collector";
import { PerformanceToolRelationCollector } from "@domain/config/presets/performance-tool/performance-tool.relation-collector";
import { buildGlobalPerformanceToolImageAssets } from "@domain/config/presets/performance-tool/performance-tool.global-image-assets";
import { getCountryFlag } from "@common/utils/images/country-image.utils";
import { buildStaticDimensionConfig } from "./performance-tool.dimensions";

function boolKeys(tree: BoolTree | boolean | undefined): string[] {
  if (!tree || typeof tree !== "object") {
    return [];
  }
  return Object.keys(tree).filter((k) => (tree as BoolTree)[k] === true);
}

export class PerformanceToolFilterContext {
  private enabledKpis: string[] = [];

  private kpiRefreshDates: Record<string, string> = {};

  private zones: Record<string, Record<string, unknown>> = {};

  private countries: Record<string, Record<string, unknown>> = {};

  private regions: Record<string, Set<string>> = {};

  private readonly collector = new PerformanceToolRelationCollector();

  initialize(
    enabledKpis: readonly string[],
    kpiRefreshDates: Record<string, string> = {},
  ): void {
    this.enabledKpis = [...enabledKpis];
    this.kpiRefreshDates = { ...kpiRefreshDates };
    this.zones = {};
    this.countries = {};
    this.regions = {};
    this.collector.initialize(enabledKpis);
  }

  getCollector(): PerformanceToolRelationCollector {
    return this.collector;
  }

  addZone(zone: string): void {
    if (!zone || this.zones[zone]) {
      return;
    }
    this.zones[zone] =
      zone === ZONE_GLOBAL
        ? { ...ZONE_MAPPING[zone], image_url: getCountryFlag(zone) }
        : { label: zone, value: zone, image_url: getCountryFlag(zone) };
  }

  addCountry(iso: string, name: string, zone: string): void {
    if (!iso || this.countries[iso]) {
      return;
    }
    const mapped = COUNTRY_MAPPING[iso];
    const flagKey = mapped?.value ?? iso;
    if (mapped) {
      this.countries[iso] = {
        id: iso,
        ...mapped,
        image_url: getCountryFlag(flagKey),
      };
    } else {
      this.countries[iso] = {
        id: iso,
        label: name,
        zone,
        value: iso,
        image_url: getCountryFlag(iso),
      };
    }
  }

  addRegion(country: string, region: string): void {
    if (!country || !region) {
      return;
    }
    if (!this.regions[country]) {
      this.regions[country] = new Set<string>();
    }
    this.regions[country].add(region);
  }

  toArray(): Record<string, unknown> {
    const { brand_assets } = buildGlobalPerformanceToolImageAssets(
      this.enabledKpis,
      (kpi) => this.collector.getRelationsForKpi(kpi),
    );
    return {
      kpis_filter: this.buildKpisFilter(),
      zones: this.buildSortedList(this.zones, "value", ZONE_GLOBAL, "value"),
      countries: this.buildSortedList(
        this.countries,
        "label",
        COUNTRY_GLOBAL,
        "id",
      ),
      brand_assets,
      kpi: this.buildKpiRelations(),
      region: this.buildRegion(),
    };
  }

  private buildRegion(): {
    default: { value: string; label: string };
    values: Record<string, { value: string; label: string }[]>;
  } {
    const values: Record<string, { value: string; label: string }[]> = {};

    for (const country of Object.keys(this.regions)) {
      if (country === COUNTRY_GLOBAL) {
        continue;
      }
      values[country] = [...this.regions[country]!]
        .sort((a, b) => a.localeCompare(b))
        .map((region) => ({ value: region, label: region }));
    }

    return {
      default: { ...REGION_PLACEHOLDER },
      values,
    };
  }

  private buildKpisFilter(): Array<{ label: string; value: string }> {
    const result: Array<{ label: string; value: string }> = [];
    for (const kpi of this.enabledKpis) {
      const m = KPIS_MAPPING[kpi];
      if (m) {
        result.push({
          label: m.label,
          value: m.value ?? kpi,
        });
      }
    }
    return result;
  }

  private buildSortedList(
    items: Record<string, Record<string, unknown>>,
    sortKey: "label" | "value",
    globalId: string,
    idKey: "id" | "value",
  ): Record<string, unknown>[] {
    const list = Object.values(items) as Record<string, unknown>[];
    list.sort((first, second) => {
      const a = first[idKey] as string;
      const b = second[idKey] as string;
      if (a === globalId) return -1;
      if (b === globalId) return 1;
      const sa = String(first[sortKey] ?? "");
      const sb = String(second[sortKey] ?? "");
      return sa.localeCompare(sb);
    });
    return list;
  }

  private buildKpiRelations(): Record<string, unknown> {
    const globalBrands = this.collector.getGlobalBrands();
    const globalBrandsFormatted = this.buildStringFormat(
      Object.keys(globalBrands),
    );
    const toBeCloned: Record<string, string> = {};
    const result: Record<string, unknown> = {};

    for (const kpi of this.enabledKpis) {
      const config = (KPIS_MAPPING[kpi] ?? {}) as {
        group?: string;
        periods?: readonly string[];
        brands_classification?: string[];
        growth_levers_classification?: string[];
        cloneOf?: string;
        timePeriod?: boolean;
        weight_type?: { label: string; value: string }[];
      };
      const relations = this.collector.getRelationsForKpi(kpi);

      const { values: periodValues, default: periodDefault } =
        buildPeriodOptionsForKpi(
          kpi,
          config.group,
          config.periods,
          this.kpiRefreshDates,
        );

      const weightType = buildStaticDimensionConfig(config.weight_type);

      result[kpi] = {
        brands_classification: config.brands_classification ?? [],
        growth_levers: config.growth_levers_classification ?? [],
        periods: { values: periodValues, default: periodDefault },
        weight_type: weightType ?? undefined,
        relations: this.formatRelations(kpi, relations, globalBrandsFormatted),
      };

      if (config.cloneOf) {
        toBeCloned[kpi] = config.cloneOf;
      }
    }

    for (const kpi of Object.keys(toBeCloned)) {
      const cloneOf = toBeCloned[kpi];
      if (!cloneOf || !result[cloneOf]) continue;
      const base = result[cloneOf] as Record<string, unknown>;
      const self = result[kpi] as Record<string, unknown>;
      result[kpi] = {
        ...base,
        periods: self?.periods ?? { values: [], default: null },
      };
    }

    // Attach after clone resolution so NR/CORES do not inherit Volume's
    // Time Period capability through `cloneOf: volume`.
    for (const kpi of this.enabledKpis) {
      const config = KPIS_MAPPING[kpi];
      if (!config?.timePeriod) continue;

      const refreshKey = config.group ?? kpi;
      const timePeriod = buildTimePeriodConfig(
        this.kpiRefreshDates[refreshKey],
      );
      if (!timePeriod) continue;

      result[kpi] = {
        ...(result[kpi] as Record<string, unknown>),
        time_period: timePeriod,
      };
    }

    return result;
  }

  private formatRelations(
    kpi: string,
    relations: Record<string, unknown>,
    globalBrandsFormatted: string,
  ): Record<string, unknown> {
    const out: Record<string, unknown> = {
      zone_countries: this.formatZoneCountries(
        (relations.zone_countries as BoolTree) ?? {},
      ),
      brand_classification: this.formatBrandClassification(
        kpi,
        relations,
        globalBrandsFormatted,
      ),
      subbrands: {
        country_subbrands: this.mapToStringFormat(
          (relations.country_subbrands as BoolTree) ?? {},
        ),
        brand_country_subbrands: this.mapNestedToStringFormat(
          (relations.brand_country_subbrands as BoolTree) ?? {},
        ),
      },
    };

    if (relations.gl) {
      out.growth_levers = this.formatGrowthLevers(
        relations.gl as Record<string, unknown>,
        globalBrandsFormatted,
      );
    }

    return out;
  }

  private formatZoneCountries(data: BoolTree): Record<string, string> {
    const result: Record<string, string> = {};
    const allCountriesMap: BoolTree = {};
    const hasGlobalCountry = Boolean(data[COUNTRY_GLOBAL]);
    const eurTree = data[ZONE_EUR] as BoolTree | undefined;
    const hasEURCountry = Boolean(
      eurTree && (eurTree as Record<string, unknown>)[COUNTRY_EUR],
    );

    for (const zone of Object.keys(data)) {
      const countries = data[zone] as BoolTree;
      let list = boolKeys(countries);
      list.sort((a, b) => a.localeCompare(b));

      if (zone === ZONE_EUR && hasEURCountry) {
        list = list.filter((c) => c !== COUNTRY_EUR);
        list = [COUNTRY_EUR, ...list];
      }

      result[zone] = list.join("|");
      Object.assign(allCountriesMap, countries);
    }

    delete (allCountriesMap as Record<string, unknown>)[COUNTRY_GLOBAL];
    delete (allCountriesMap as Record<string, unknown>)[COUNTRY_EUR];

    if (Object.keys(allCountriesMap).length > 0 && hasGlobalCountry) {
      const allCountries = Object.keys(allCountriesMap);
      allCountries.sort((a, b) => a.localeCompare(b));
      result[ZONE_GLOBAL] = `${COUNTRY_GLOBAL}|${allCountries.join("|")}`;
    }

    const keys = Object.keys(result).sort((first, second) => {
      if (first === ZONE_GLOBAL) return -1;
      if (second === ZONE_GLOBAL) return 1;
      return first.localeCompare(second);
    });
    const ordered: Record<string, string> = {};
    for (const k of keys) {
      ordered[k] = result[k]!;
    }
    return ordered;
  }

  private formatBrandClassification(
    kpi: string,
    relations: Record<string, unknown>,
    globalBrandsFormatted: string,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const classifications =
      (KPIS_MAPPING[kpi]?.brands_classification as string[]) ?? [];

    for (const className of classifications) {
      const globalDefault = getGlobalDefault(kpi, className, null);
      switch (className) {
        case ALL_BRANDS:
          result[className] = this.formatAllBrands(
            (relations.country_brands as BoolTree) ?? {},
            globalDefault,
            globalBrandsFormatted,
          );
          break;
        case PORTFOLIO:
          result[className] = this.formatNested(
            (relations.portfolio_country_brands as BoolTree) ?? {},
            globalDefault,
            [...PORTFOLIO_ORDER],
            (relations.portfolio_country_subbrands as BoolTree) ?? {},
          );
          break;
        case BEER_PRICE_SEGMENT:
          result[className] = this.formatNested(
            (relations.bps_country_brands as BoolTree) ?? {},
            globalDefault,
          );
          break;
        case GLOBAL_BRANDS:
          result[className] = this.formatGlobalBrands(
            (relations.global_brand_countries as BoolTree) ?? {},
            globalBrandsFormatted,
          );
          break;
        default:
          break;
      }
    }

    return result;
  }

  private formatAllBrands(
    countryBrands: BoolTree,
    globalDefault: string | null,
    globalBrandsFormatted: string,
  ): Record<string, string> {
    const result: Record<string, string> = {};

    if (globalDefault === VALUE_ALL) {
      result[ZONE_GLOBAL] = VALUE_ALL;
    } else if (globalDefault === SOURCE_GLOBAL_BRANDS) {
      result[ZONE_GLOBAL] = `${VALUE_ALL}|${globalBrandsFormatted}`;
    }

    for (const country of Object.keys(countryBrands)) {
      const brands = countryBrands[country] as BoolTree;
      result[country] =
        `${VALUE_ALL}|${this.buildStringFormat(boolKeys(brands))}`;
    }

    const keys = Object.keys(result).sort();
    const ordered: Record<string, string> = {};
    for (const k of keys) {
      ordered[k] = result[k]!;
    }

    return ordered;
  }

  private formatNested(
    data: BoolTree,
    globalDefault: string | null,
    customOrder: string[] = [],
    subbrandsData?: BoolTree,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    const classValues =
      subbrandsData !== undefined
        ? Array.from(
            new Set([...Object.keys(data), ...Object.keys(subbrandsData)]),
          )
        : Object.keys(data);

    for (const classValue of classValues) {
      const rowData = (data[classValue] as BoolTree) ?? {};
      const brands: Record<string, string> = {};

      if (globalDefault === VALUE_ALL) {
        brands[ZONE_GLOBAL] = VALUE_ALL;
      }

      for (const country of Object.keys(rowData)) {
        const countryBrands = rowData[country] as BoolTree;
        brands[country] =
          `${VALUE_ALL}|${this.buildStringFormat(boolKeys(countryBrands))}`;
      }

      const brandKeys = Object.keys(brands).sort();
      const sortedBrands: Record<string, string> = {};
      for (const k of brandKeys) {
        sortedBrands[k] = brands[k]!;
      }

      if (subbrandsData === undefined) {
        result[classValue] = sortedBrands;
        continue;
      }

      const subMap = (subbrandsData[classValue] as BoolTree) ?? {};
      const subbrands = this.mapToStringFormat(subMap);

      result[classValue] = {
        brands: sortedBrands,
        subbrands: subbrands,
      };
    }

    if (customOrder.length > 0) {
      const ordered: Record<string, unknown> = {};
      for (const key of customOrder) {
        if (key in result) {
          ordered[key] = result[key];
        }
      }
      return ordered;
    }

    const sortedKeys = Object.keys(result).sort();
    const sortedResult: Record<string, unknown> = {};
    for (const k of sortedKeys) {
      sortedResult[k] = result[k];
    }
    return sortedResult;
  }

  private formatGlobalBrands(
    brandCountries: BoolTree,
    globalBrandsFormatted: string,
  ): Record<string, string> {
    const result: Record<string, string> = {
      [ZONE_GLOBAL]: globalBrandsFormatted,
    };
    const countryBrands: Record<string, Record<string, boolean>> = {};

    for (const brand of Object.keys(brandCountries)) {
      const countries = brandCountries[brand] as BoolTree;
      for (const country of Object.keys(countries)) {
        if (!countryBrands[country]) countryBrands[country] = {};
        countryBrands[country][brand] = true;
      }
    }

    for (const country of Object.keys(countryBrands)) {
      result[country] = this.buildStringFormat(
        Object.keys(countryBrands[country]!),
      );
    }

    const keys = Object.keys(result).sort();
    const ordered: Record<string, string> = {};
    for (const k of keys) {
      ordered[k] = result[k]!;
    }
    return ordered;
  }

  private formatGrowthLevers(
    glData: Record<string, unknown>,
    globalBrandsFormatted: string,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const gl of Object.keys(glData)) {
      const relations = glData[gl] as Record<string, unknown>;
      result[gl] = {
        brand_classification: this.formatGlBrandClassification(
          gl,
          relations,
          globalBrandsFormatted,
        ),
        subbrands: {
          country_subbrands: this.mapToStringFormat(
            (relations.country_subbrands as BoolTree) ?? {},
          ),
          brand_country_subbrands: this.mapNestedToStringFormat(
            (relations.brand_country_subbrands as BoolTree) ?? {},
          ),
          global_brand_country_subbrands: this.mapNestedToStringFormat(
            (relations.global_brand_country_subbrands as BoolTree) ?? {},
          ),
        },
      };
    }
    return result;
  }

  private formatGlBrandClassification(
    gl: string,
    relations: Record<string, unknown>,
    globalBrandsFormatted: string,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const rules = getGlRules(gl) as Record<string, { global_default?: string }>;

    const pairs: Array<
      [
        string,
        "country_brands" | "portfolio_country_brands" | "bps_country_brands",
        "formatAllBrands" | "formatNested",
      ]
    > = [
      [ALL_BRANDS, "country_brands", "formatAllBrands"],
      [PORTFOLIO, "portfolio_country_brands", "formatNested"],
      [BEER_PRICE_SEGMENT, "bps_country_brands", "formatNested"],
    ];

    for (const [className, dataKey, method] of pairs) {
      if (!isGlClassificationAvailable(gl, className)) continue;
      const customOrder = className === PORTFOLIO ? [...PORTFOLIO_ORDER] : [];
      const globalDefault = rules[className]?.global_default ?? null;

      result[className] =
        method === "formatAllBrands"
          ? this.formatAllBrands(
              (relations[dataKey] as BoolTree) ?? {},
              globalDefault ?? null,
              globalBrandsFormatted,
            )
          : this.formatNested(
              (relations[dataKey] as BoolTree) ?? {},
              globalDefault ?? null,
              customOrder,
              className === PORTFOLIO
                ? ((relations.portfolio_country_subbrands as BoolTree) ?? {})
                : undefined,
            );
    }

    if (isGlClassificationAvailable(gl, GLOBAL_BRANDS)) {
      result[GLOBAL_BRANDS] = this.formatGlobalBrands(
        (relations.global_brand_country_subbrands as BoolTree) ?? {},
        globalBrandsFormatted,
      );
    }

    return result;
  }

  private buildStringFormat(items: string[]): string {
    const copy = [...items];
    copy.sort((a, b) => a.localeCompare(b));
    return copy.join("|");
  }

  private mapToStringFormat(data: BoolTree): Record<string, string> {
    const result: Record<string, string> = {};
    for (const key of Object.keys(data)) {
      const v = data[key];
      if (typeof v === "object" && v !== null) {
        result[key] = this.buildStringFormat(boolKeys(v as BoolTree));
      }
    }
    const keys = Object.keys(result).sort();
    const ordered: Record<string, string> = {};
    for (const k of keys) {
      ordered[k] = result[k]!;
    }
    return ordered;
  }

  private mapNestedToStringFormat(
    data: BoolTree,
  ): Record<string, Record<string, string>> {
    const result: Record<string, Record<string, string>> = {};
    for (const key1 of Object.keys(data)) {
      const nested = data[key1] as BoolTree;
      result[key1] = {};
      for (const key2 of Object.keys(nested)) {
        const values = nested[key2];
        if (typeof values === "object" && values !== null) {
          result[key1][key2] = this.buildStringFormat(
            boolKeys(values as BoolTree),
          );
        }
      }
      const nk = Object.keys(result[key1]!).sort();
      const row: Record<string, string> = {};
      for (const k of nk) {
        row[k] = result[key1]![k]!;
      }
      result[key1] = row;
    }
    const outerKeys = Object.keys(result).sort();
    const ordered: Record<string, Record<string, string>> = {};
    for (const k of outerKeys) {
      ordered[k] = result[k]!;
    }
    return ordered;
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceToolFilterContext = void 0;
const performance_tool_constants_1 = require("./performance-tool.constants");
const performance_tool_periods_1 = require("./performance-tool.periods");
const performance_tool_ui_rules_1 = require("./performance-tool.ui-rules");
const performance_tool_relation_collector_1 = require("./performance-tool.relation-collector");
const performance_tool_global_image_assets_1 = require("./performance-tool.global-image-assets");
const country_image_utils_1 = require("../../../../common/utils/images/country-image.utils");
const performance_tool_dimensions_1 = require("./performance-tool.dimensions");
function boolKeys(tree) {
    if (!tree || typeof tree !== "object") {
        return [];
    }
    return Object.keys(tree).filter((k) => tree[k] === true);
}
class PerformanceToolFilterContext {
    constructor() {
        this.enabledKpis = [];
        this.kpiRefreshDates = {};
        this.zones = {};
        this.countries = {};
        this.regions = {};
        this.collector = new performance_tool_relation_collector_1.PerformanceToolRelationCollector();
    }
    initialize(enabledKpis, kpiRefreshDates = {}) {
        this.enabledKpis = [...enabledKpis];
        this.kpiRefreshDates = { ...kpiRefreshDates };
        this.zones = {};
        this.countries = {};
        this.regions = {};
        this.collector.initialize(enabledKpis);
    }
    getCollector() {
        return this.collector;
    }
    addZone(zone) {
        if (!zone || this.zones[zone]) {
            return;
        }
        this.zones[zone] =
            zone === performance_tool_constants_1.ZONE_GLOBAL
                ? { ...performance_tool_constants_1.ZONE_MAPPING[zone], image_url: (0, country_image_utils_1.getCountryFlag)(zone) }
                : { label: zone, value: zone, image_url: (0, country_image_utils_1.getCountryFlag)(zone) };
    }
    addCountry(iso, name, zone) {
        if (!iso || this.countries[iso]) {
            return;
        }
        const mapped = performance_tool_constants_1.COUNTRY_MAPPING[iso];
        const flagKey = mapped?.value ?? iso;
        if (mapped) {
            this.countries[iso] = {
                id: iso,
                ...mapped,
                image_url: (0, country_image_utils_1.getCountryFlag)(flagKey),
            };
        }
        else {
            this.countries[iso] = {
                id: iso,
                label: name,
                zone,
                value: iso,
                image_url: (0, country_image_utils_1.getCountryFlag)(iso),
            };
        }
    }
    addRegion(country, region) {
        if (!country || !region) {
            return;
        }
        if (!this.regions[country]) {
            this.regions[country] = new Set();
        }
        this.regions[country].add(region);
    }
    toArray() {
        const { brand_assets } = (0, performance_tool_global_image_assets_1.buildGlobalPerformanceToolImageAssets)(this.enabledKpis, (kpi) => this.collector.getRelationsForKpi(kpi));
        return {
            kpis_filter: this.buildKpisFilter(),
            zones: this.buildSortedList(this.zones, "value", performance_tool_constants_1.ZONE_GLOBAL, "value"),
            countries: this.buildSortedList(this.countries, "label", performance_tool_constants_1.COUNTRY_GLOBAL, "id"),
            brand_assets,
            kpi: this.buildKpiRelations(),
            region: this.buildRegion(),
        };
    }
    buildRegion() {
        const values = {};
        for (const country of Object.keys(this.regions)) {
            if (country === performance_tool_constants_1.COUNTRY_GLOBAL) {
                continue;
            }
            values[country] = [...this.regions[country]]
                .sort((a, b) => a.localeCompare(b))
                .map((region) => ({ value: region, label: region }));
        }
        return {
            default: { ...performance_tool_constants_1.REGION_PLACEHOLDER },
            values,
        };
    }
    buildKpisFilter() {
        const result = [];
        for (const kpi of this.enabledKpis) {
            const m = performance_tool_constants_1.KPIS_MAPPING[kpi];
            if (m) {
                result.push({
                    label: m.label,
                    value: m.value ?? kpi,
                });
            }
        }
        return result;
    }
    buildSortedList(items, sortKey, globalId, idKey) {
        const list = Object.values(items);
        list.sort((first, second) => {
            const a = first[idKey];
            const b = second[idKey];
            if (a === globalId)
                return -1;
            if (b === globalId)
                return 1;
            const sa = String(first[sortKey] ?? "");
            const sb = String(second[sortKey] ?? "");
            return sa.localeCompare(sb);
        });
        return list;
    }
    buildKpiRelations() {
        const globalBrands = this.collector.getGlobalBrands();
        const globalBrandsFormatted = this.buildStringFormat(Object.keys(globalBrands));
        const toBeCloned = {};
        const result = {};
        for (const kpi of this.enabledKpis) {
            const config = (performance_tool_constants_1.KPIS_MAPPING[kpi] ?? {});
            const relations = this.collector.getRelationsForKpi(kpi);
            const { values: periodValues, default: periodDefault } = (0, performance_tool_periods_1.buildPeriodOptionsForKpi)(kpi, config.group, config.periods, this.kpiRefreshDates);
            const weightType = (0, performance_tool_dimensions_1.buildStaticDimensionConfig)(config.weight_type);
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
            if (!cloneOf || !result[cloneOf])
                continue;
            const base = result[cloneOf];
            const self = result[kpi];
            result[kpi] = {
                ...base,
                periods: self?.periods ?? { values: [], default: null },
            };
        }
        for (const kpi of this.enabledKpis) {
            const config = performance_tool_constants_1.KPIS_MAPPING[kpi];
            if (!config?.timePeriod)
                continue;
            const refreshKey = config.group ?? kpi;
            const timePeriod = (0, performance_tool_periods_1.buildTimePeriodConfig)(this.kpiRefreshDates[refreshKey]);
            if (!timePeriod)
                continue;
            result[kpi] = {
                ...result[kpi],
                time_period: timePeriod,
            };
        }
        return result;
    }
    formatRelations(kpi, relations, globalBrandsFormatted) {
        const out = {
            zone_countries: this.formatZoneCountries(relations.zone_countries ?? {}),
            brand_classification: this.formatBrandClassification(kpi, relations, globalBrandsFormatted),
            subbrands: {
                country_subbrands: this.mapToStringFormat(relations.country_subbrands ?? {}),
                brand_country_subbrands: this.mapNestedToStringFormat(relations.brand_country_subbrands ?? {}),
            },
        };
        if (relations.gl) {
            out.growth_levers = this.formatGrowthLevers(relations.gl, globalBrandsFormatted);
        }
        return out;
    }
    formatZoneCountries(data) {
        const result = {};
        const allCountriesMap = {};
        const hasGlobalCountry = Boolean(data[performance_tool_constants_1.COUNTRY_GLOBAL]);
        const eurTree = data[performance_tool_constants_1.ZONE_EUR];
        const hasEURCountry = Boolean(eurTree && eurTree[performance_tool_constants_1.COUNTRY_EUR]);
        for (const zone of Object.keys(data)) {
            const countries = data[zone];
            let list = boolKeys(countries);
            list.sort((a, b) => a.localeCompare(b));
            if (zone === performance_tool_constants_1.ZONE_EUR && hasEURCountry) {
                list = list.filter((c) => c !== performance_tool_constants_1.COUNTRY_EUR);
                list = [performance_tool_constants_1.COUNTRY_EUR, ...list];
            }
            result[zone] = list.join("|");
            Object.assign(allCountriesMap, countries);
        }
        delete allCountriesMap[performance_tool_constants_1.COUNTRY_GLOBAL];
        delete allCountriesMap[performance_tool_constants_1.COUNTRY_EUR];
        if (Object.keys(allCountriesMap).length > 0 && hasGlobalCountry) {
            const allCountries = Object.keys(allCountriesMap);
            allCountries.sort((a, b) => a.localeCompare(b));
            result[performance_tool_constants_1.ZONE_GLOBAL] = `${performance_tool_constants_1.COUNTRY_GLOBAL}|${allCountries.join("|")}`;
        }
        const keys = Object.keys(result).sort((first, second) => {
            if (first === performance_tool_constants_1.ZONE_GLOBAL)
                return -1;
            if (second === performance_tool_constants_1.ZONE_GLOBAL)
                return 1;
            return first.localeCompare(second);
        });
        const ordered = {};
        for (const k of keys) {
            ordered[k] = result[k];
        }
        return ordered;
    }
    formatBrandClassification(kpi, relations, globalBrandsFormatted) {
        const result = {};
        const classifications = performance_tool_constants_1.KPIS_MAPPING[kpi]?.brands_classification ?? [];
        for (const className of classifications) {
            const globalDefault = (0, performance_tool_ui_rules_1.getGlobalDefault)(kpi, className, null);
            switch (className) {
                case performance_tool_constants_1.ALL_BRANDS:
                    result[className] = this.formatAllBrands(relations.country_brands ?? {}, globalDefault, globalBrandsFormatted);
                    break;
                case performance_tool_constants_1.PORTFOLIO:
                    result[className] = this.formatNested(relations.portfolio_country_brands ?? {}, globalDefault, [...performance_tool_constants_1.PORTFOLIO_ORDER], relations.portfolio_country_subbrands ?? {});
                    break;
                case performance_tool_constants_1.BEER_PRICE_SEGMENT:
                    result[className] = this.formatNested(relations.bps_country_brands ?? {}, globalDefault);
                    break;
                case performance_tool_constants_1.GLOBAL_BRANDS:
                    result[className] = this.formatGlobalBrands(relations.global_brand_countries ?? {}, globalBrandsFormatted);
                    break;
                default:
                    break;
            }
        }
        return result;
    }
    formatAllBrands(countryBrands, globalDefault, globalBrandsFormatted) {
        const result = {};
        if (globalDefault === performance_tool_ui_rules_1.VALUE_ALL) {
            result[performance_tool_constants_1.ZONE_GLOBAL] = performance_tool_ui_rules_1.VALUE_ALL;
        }
        else if (globalDefault === performance_tool_ui_rules_1.SOURCE_GLOBAL_BRANDS) {
            result[performance_tool_constants_1.ZONE_GLOBAL] = `${performance_tool_ui_rules_1.VALUE_ALL}|${globalBrandsFormatted}`;
        }
        for (const country of Object.keys(countryBrands)) {
            const brands = countryBrands[country];
            result[country] =
                `${performance_tool_ui_rules_1.VALUE_ALL}|${this.buildStringFormat(boolKeys(brands))}`;
        }
        const keys = Object.keys(result).sort();
        const ordered = {};
        for (const k of keys) {
            ordered[k] = result[k];
        }
        return ordered;
    }
    formatNested(data, globalDefault, customOrder = [], subbrandsData) {
        const result = {};
        const classValues = subbrandsData !== undefined
            ? Array.from(new Set([...Object.keys(data), ...Object.keys(subbrandsData)]))
            : Object.keys(data);
        for (const classValue of classValues) {
            const rowData = data[classValue] ?? {};
            const brands = {};
            if (globalDefault === performance_tool_ui_rules_1.VALUE_ALL) {
                brands[performance_tool_constants_1.ZONE_GLOBAL] = performance_tool_ui_rules_1.VALUE_ALL;
            }
            for (const country of Object.keys(rowData)) {
                const countryBrands = rowData[country];
                brands[country] =
                    `${performance_tool_ui_rules_1.VALUE_ALL}|${this.buildStringFormat(boolKeys(countryBrands))}`;
            }
            const brandKeys = Object.keys(brands).sort();
            const sortedBrands = {};
            for (const k of brandKeys) {
                sortedBrands[k] = brands[k];
            }
            if (subbrandsData === undefined) {
                result[classValue] = sortedBrands;
                continue;
            }
            const subMap = subbrandsData[classValue] ?? {};
            const subbrands = this.mapToStringFormat(subMap);
            result[classValue] = {
                brands: sortedBrands,
                subbrands: subbrands,
            };
        }
        if (customOrder.length > 0) {
            const ordered = {};
            for (const key of customOrder) {
                if (key in result) {
                    ordered[key] = result[key];
                }
            }
            return ordered;
        }
        const sortedKeys = Object.keys(result).sort();
        const sortedResult = {};
        for (const k of sortedKeys) {
            sortedResult[k] = result[k];
        }
        return sortedResult;
    }
    formatGlobalBrands(brandCountries, globalBrandsFormatted) {
        const result = {
            [performance_tool_constants_1.ZONE_GLOBAL]: globalBrandsFormatted,
        };
        const countryBrands = {};
        for (const brand of Object.keys(brandCountries)) {
            const countries = brandCountries[brand];
            for (const country of Object.keys(countries)) {
                if (!countryBrands[country])
                    countryBrands[country] = {};
                countryBrands[country][brand] = true;
            }
        }
        for (const country of Object.keys(countryBrands)) {
            result[country] = this.buildStringFormat(Object.keys(countryBrands[country]));
        }
        const keys = Object.keys(result).sort();
        const ordered = {};
        for (const k of keys) {
            ordered[k] = result[k];
        }
        return ordered;
    }
    formatGrowthLevers(glData, globalBrandsFormatted) {
        const result = {};
        for (const gl of Object.keys(glData)) {
            const relations = glData[gl];
            result[gl] = {
                brand_classification: this.formatGlBrandClassification(gl, relations, globalBrandsFormatted),
                subbrands: {
                    country_subbrands: this.mapToStringFormat(relations.country_subbrands ?? {}),
                    brand_country_subbrands: this.mapNestedToStringFormat(relations.brand_country_subbrands ?? {}),
                    global_brand_country_subbrands: this.mapNestedToStringFormat(relations.global_brand_country_subbrands ?? {}),
                },
            };
        }
        return result;
    }
    formatGlBrandClassification(gl, relations, globalBrandsFormatted) {
        const result = {};
        const rules = (0, performance_tool_ui_rules_1.getGlRules)(gl);
        const pairs = [
            [performance_tool_constants_1.ALL_BRANDS, "country_brands", "formatAllBrands"],
            [performance_tool_constants_1.PORTFOLIO, "portfolio_country_brands", "formatNested"],
            [performance_tool_constants_1.BEER_PRICE_SEGMENT, "bps_country_brands", "formatNested"],
        ];
        for (const [className, dataKey, method] of pairs) {
            if (!(0, performance_tool_ui_rules_1.isGlClassificationAvailable)(gl, className))
                continue;
            const customOrder = className === performance_tool_constants_1.PORTFOLIO ? [...performance_tool_constants_1.PORTFOLIO_ORDER] : [];
            const globalDefault = rules[className]?.global_default ?? null;
            result[className] =
                method === "formatAllBrands"
                    ? this.formatAllBrands(relations[dataKey] ?? {}, globalDefault ?? null, globalBrandsFormatted)
                    : this.formatNested(relations[dataKey] ?? {}, globalDefault ?? null, customOrder, className === performance_tool_constants_1.PORTFOLIO
                        ? (relations.portfolio_country_subbrands ?? {})
                        : undefined);
        }
        if ((0, performance_tool_ui_rules_1.isGlClassificationAvailable)(gl, performance_tool_constants_1.GLOBAL_BRANDS)) {
            result[performance_tool_constants_1.GLOBAL_BRANDS] = this.formatGlobalBrands(relations.global_brand_country_subbrands ?? {}, globalBrandsFormatted);
        }
        return result;
    }
    buildStringFormat(items) {
        const copy = [...items];
        copy.sort((a, b) => a.localeCompare(b));
        return copy.join("|");
    }
    mapToStringFormat(data) {
        const result = {};
        for (const key of Object.keys(data)) {
            const v = data[key];
            if (typeof v === "object" && v !== null) {
                result[key] = this.buildStringFormat(boolKeys(v));
            }
        }
        const keys = Object.keys(result).sort();
        const ordered = {};
        for (const k of keys) {
            ordered[k] = result[k];
        }
        return ordered;
    }
    mapNestedToStringFormat(data) {
        const result = {};
        for (const key1 of Object.keys(data)) {
            const nested = data[key1];
            result[key1] = {};
            for (const key2 of Object.keys(nested)) {
                const values = nested[key2];
                if (typeof values === "object" && values !== null) {
                    result[key1][key2] = this.buildStringFormat(boolKeys(values));
                }
            }
            const nk = Object.keys(result[key1]).sort();
            const row = {};
            for (const k of nk) {
                row[k] = result[key1][k];
            }
            result[key1] = row;
        }
        const outerKeys = Object.keys(result).sort();
        const ordered = {};
        for (const k of outerKeys) {
            ordered[k] = result[k];
        }
        return ordered;
    }
}
exports.PerformanceToolFilterContext = PerformanceToolFilterContext;
//# sourceMappingURL=performance-tool.filter-context.js.map
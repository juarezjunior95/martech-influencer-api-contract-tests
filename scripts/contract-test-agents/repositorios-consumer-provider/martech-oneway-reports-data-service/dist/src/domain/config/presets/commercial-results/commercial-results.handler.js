"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commercialResultsHandler = void 0;
const preset_entity_1 = require("../../../entities/preset.entity");
const dataset_repository_factory_1 = require("../../../factories/dataset-repository.factory");
const kpi_group_time_frame_config_1 = __importDefault(require("../../config-groups/kpi-group-time-frame.config"));
const kpi_group_handler_1 = require("../kpi-group/kpi-group.handler");
const kpi_group_types_1 = require("../kpi-group/kpi-group.types");
const performance_tool_periods_1 = require("../performance-tool/performance-tool.periods");
const commercial_results_types_1 = require("./commercial-results.types");
const commercial_results_constants_1 = require("./commercial-results.constants");
const effective_zones_1 = require("../common/effective-zones");
const zone_country_defaults_1 = require("../common/zone-country-defaults");
const countries_registry_1 = require("../../../registries/countries.registry");
const zones_registry_1 = require("../../../registries/zones.registry");
const brand_image_utils_1 = require("../../../../common/utils/images/brand-image.utils");
const commercial_results_geo_defaults_1 = require("./commercial-results.geo-defaults");
const GLOBAL_ZONE = "ABI";
const createCommercialResultsProcedureConfig = (parameters, staticParams) => ({
    ...(0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
        functionName: commercial_results_types_1.COMMERCIAL_RESULTS_SP_NAME,
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
];
class CommercialResultsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    filters() {
        return [
            { name: "country", value: "ABI" },
            { name: "zone", value: "ABI" },
            { name: "brand", value: "All" },
            { name: "kpi", value: "volume" },
        ];
    }
    datasets(expanded) {
        const cfg = this.resolvePresetConfig(expanded);
        const isBrandAll = (0, commercial_results_types_1.isCommercialResultsBrandAll)(cfg);
        const mainConfig = {
            id: commercial_results_types_1.COMMERCIAL_RESULTS_DATASET_ID,
            config: createCommercialResultsProcedureConfig([
                "country",
                "zone",
                "brand",
                "kpi",
            ]),
        };
        const brandsConfig = {
            id: commercial_results_types_1.COMMERCIAL_RESULTS_BRANDS_DATASET_ID,
            config: createCommercialResultsProcedureConfig(["country", "zone", "kpi"], {
                brand: "All",
            }),
        };
        const geoConfig = {
            id: commercial_results_types_1.COMMERCIAL_RESULTS_GEO_DATASET_ID,
            config: createCommercialResultsProcedureConfig(["kpi"], {
                country: "ABI",
                zone: "ABI",
                brand: "All",
            }),
        };
        const kpiGroupConfig = {
            id: kpi_group_types_1.KPI_GROUP_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: kpi_group_types_1.KPI_GROUP_DATASET_QUERY,
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
    handle(preset, datasets, user) {
        if (user?.policy.mode === "deny") {
            return this.emptyResponse();
        }
        const cfg = this.resolvePresetConfig(preset);
        const isBrandAll = (0, commercial_results_types_1.isCommercialResultsBrandAll)(cfg);
        const rows = this.extractRows(datasets, commercial_results_types_1.COMMERCIAL_RESULTS_DATASET_ID);
        const brandRows = this.extractRows(datasets, commercial_results_types_1.COMMERCIAL_RESULTS_BRANDS_DATASET_ID);
        const geoRows = this.extractRows(datasets, commercial_results_types_1.COMMERCIAL_RESULTS_GEO_DATASET_ID);
        const effectiveRows = rows.length > 0 ? rows : brandRows;
        const baseDimensionRows = isBrandAll ? brandRows : effectiveRows;
        const brandListRows = (0, commercial_results_types_1.filterRowsByActiveDrivers)(brandRows, cfg, {
            skipKeys: ["brand"],
        });
        const regionRows = (0, commercial_results_types_1.filterRowsByActiveDrivers)(baseDimensionRows, cfg, {
            skipKeys: ["region"],
        });
        const channelRows = (0, commercial_results_types_1.filterRowsByActiveDrivers)(baseDimensionRows, cfg, {
            skipKeys: ["channel"],
        });
        const packTypeRows = (0, commercial_results_types_1.filterRowsByActiveDrivers)(baseDimensionRows, cfg, {
            skipKeys: ["pack_type"],
        });
        const portfolioRows = (0, commercial_results_types_1.filterRowsByActiveDrivers)(baseDimensionRows, cfg, {
            skipKeys: ["portfolios"],
        });
        const scopedEffectiveRows = (0, commercial_results_types_1.filterRowsByActiveDrivers)(effectiveRows, cfg);
        const classificationRows = (0, commercial_results_types_1.filterRowsByActiveDrivers)(baseDimensionRows, cfg, {
            skipKeys: [...COMMERCIAL_RESULTS_CLASSIFICATION_DRIVER_KEYS],
        });
        const rowsNarrowedByPortfolio = (0, commercial_results_types_1.filterRowsByActiveDrivers)(baseDimensionRows, cfg, {
            skipKeys: [
                "category",
                "non_alcoholic",
                "growth_levers",
                "beer_price_segment",
            ],
        });
        const geoSource = geoRows.length > 0 ? geoRows : brandRows;
        const { country, zones } = buildGeoFilters(geoSource, user);
        const region = this.buildRegion(regionRows, user);
        const subBrandPlaceholder = isBrandAll
            ? commercial_results_constants_1.FILTER_PLACEHOLDERS.subBrandNoBrand
            : commercial_results_constants_1.FILTER_PLACEHOLDERS.subBrand;
        const response = {
            kpis: {
                enabled: true,
                default: { ...commercial_results_constants_1.COMMERCIAL_RESULTS_DEFAULT_KPI },
                values: commercial_results_constants_1.COMMERCIAL_RESULTS_KPI_OPTIONS.map((option) => ({ ...option })),
            },
            zones,
            country,
            region,
            periods: this.buildPeriods(geoSource, datasets, cfg?.kpi),
            brands: this.buildList(brandListRows.map((r) => r.brand), commercial_results_constants_1.FILTER_PLACEHOLDERS.brand, (value, label) => ({
                value,
                label,
                ...(0, brand_image_utils_1.getBrandImageFields)(value),
            })),
            sub_brands: this.buildSubBrandList(scopedEffectiveRows, subBrandPlaceholder),
            channel: this.buildList(channelRows.map((r) => r.channel), commercial_results_constants_1.FILTER_PLACEHOLDERS.channel),
            pack_type: this.buildList(packTypeRows.map((r) => r.pack_type), commercial_results_constants_1.FILTER_PLACEHOLDERS.packType),
            sku: this.buildSku(scopedEffectiveRows, isBrandAll),
            category: this.buildCategory(classificationRows, cfg),
            non_alcoholic: this.buildNonAlcBeer(classificationRows, cfg),
            growth_levers: this.buildGrowthLevers(rowsNarrowedByPortfolio, cfg),
            beer_price_segment: this.buildBeerPriceSegment(rowsNarrowedByPortfolio, cfg),
            portfolios: this.buildPortfolio(portfolioRows, cfg),
        };
        return response;
    }
    resolvePresetConfig(preset) {
        const raw = preset?.["commercial_results_filters"];
        if (!(0, commercial_results_types_1.isCommercialResultsPresetConfig)(raw))
            return undefined;
        return (0, commercial_results_types_1.normalizeCommercialResultsPresetConfig)(raw);
    }
    emptyResponse() {
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
    extractRows(datasets, id) {
        return (datasets?.find((d) => d.id === id)?.data ??
            []);
    }
    buildRegion(rows, user) {
        const byCountry = groupByKey(rows, (r) => r.country_iso_code_3, (r) => r.region, (region) => ({ value: region, label: region }));
        const rawValues = {
            ABI: [commercial_results_constants_1.FILTER_PLACEHOLDERS.region],
        };
        for (const [country, entries] of Object.entries(byCountry)) {
            if (country !== "ABI")
                rawValues[country] = entries;
        }
        const values = user
            ? (0, preset_entity_1.trimByCountryAccess)(rawValues, user, { keepKeys: ["ABI"] })
            : rawValues;
        return {
            enabled: true,
            default: commercial_results_constants_1.FILTER_PLACEHOLDERS.region,
            values,
        };
    }
    resolvePeriodRefreshDate(datasets, kpi) {
        const kpiGroup = kpi?.toLowerCase() === "nr"
            ? commercial_results_constants_1.COMMERCIAL_RESULTS_PERIOD_KPI_GROUPS.nr
            : commercial_results_constants_1.COMMERCIAL_RESULTS_PERIOD_KPI_GROUPS.volume;
        const queried = kpi_group_handler_1.kpiGroupHandler.handle({}, datasets);
        const fromQuery = queried[kpiGroup];
        if (typeof fromQuery === "string" && fromQuery.length > 0) {
            return fromQuery;
        }
        return kpiGroup === commercial_results_constants_1.COMMERCIAL_RESULTS_PERIOD_KPI_GROUPS.volume
            ? (kpi_group_time_frame_config_1.default.config.sku_pnl ?? "")
            : "";
    }
    buildPeriods(rows, datasets, kpi) {
        const present = new Set(uniqueClean(rows.map((r) => r.period)).map((p) => commercial_results_constants_1.PERIOD_NORMALIZATION[p] ?? p));
        const refresh = this.resolvePeriodRefreshDate(datasets, kpi);
        const parsed = (0, performance_tool_periods_1.parseRefreshDateUtc)(refresh);
        const allOptions = parsed
            ? (0, performance_tool_periods_1.getMonthlyTimeframes)(parsed)
            : commercial_results_constants_1.STATIC_PERIOD_OPTIONS;
        const periodByValue = new Map(allOptions.map((o) => [o.value, o]));
        const values = commercial_results_constants_1.PERIOD_ORDER.filter((p) => present.has(p))
            .map((p) => periodByValue.get(p))
            .filter((o) => o !== undefined);
        const defaultOption = (present.has("YTD") ? periodByValue.get("YTD") : undefined) ??
            values[0] ??
            commercial_results_constants_1.STATIC_PERIOD_OPTIONS[0];
        return {
            enabled: true,
            default: defaultOption,
            values,
        };
    }
    buildList(rawValues, placeholder, mapOption = (value, label) => ({ value, label })) {
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
    buildSubBrandList(rows, placeholder) {
        const subBrandToBrand = new Map();
        for (const row of rows) {
            if (isClean(row.sub_brand) && isClean(row.brand)) {
                subBrandToBrand.set(row.sub_brand, row.brand);
            }
        }
        const placeholderWithImage = {
            ...placeholder,
            ...(0, brand_image_utils_1.getBrandImageFields)(placeholder.value),
        };
        const options = [...subBrandToBrand.keys()]
            .sort(byString)
            .map((value) => {
            const brandFamily = subBrandToBrand.get(value);
            return {
                value,
                label: value,
                ...(0, brand_image_utils_1.getBrandImageFields)(value, brandFamily ? { brand_family: brandFamily } : undefined),
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
    buildCategory(rows, cfg) {
        let values = uniqueClean(rows.map((r) => r.category));
        const gl = cfg?.growth_levers;
        if (gl === "Beyond Beer") {
            values = values.filter((v) => v === "Adj");
        }
        else if (isClean(gl)) {
            values = values.filter((v) => v === "Beer");
        }
        if (isClean(cfg?.beer_price_segment))
            values = values.filter((v) => v === "Beer");
        if (isClean(cfg?.non_alcoholic))
            values = values.filter((v) => v === "Beer" || v === "Beer + Adj");
        if (isClean(cfg?.portfolios))
            values = values.filter((v) => v !== "NAB");
        return this.buildList(values, commercial_results_constants_1.FILTER_PLACEHOLDERS.category);
    }
    buildNonAlcBeer(rows, cfg) {
        const cat = cfg?.category;
        if (cat === "Adj" ||
            cat === "NAB" ||
            cfg?.growth_levers === "Beyond Beer") {
            return { enabled: false, default: null, values: [] };
        }
        return this.buildList(rows.map((r) => r.non_alc_beer), commercial_results_constants_1.FILTER_PLACEHOLDERS.nonAlcoholic);
    }
    buildGrowthLevers(rows, cfg) {
        const cat = cfg?.category;
        if (cat === "NAB")
            return { enabled: false, default: null, values: [] };
        let values = filterToAllowedValues(uniqueClean(rows.map((r) => r.growth_levers)), commercial_results_constants_1.GROWTH_LEVERS_ALLOWED_SET);
        if (cat === "Adj") {
            values = values.filter((v) => v === "Beyond Beer");
        }
        else if (cat === "Beer" ||
            isClean(cfg?.non_alcoholic) ||
            isClean(cfg?.beer_price_segment)) {
            values = values.filter((v) => v !== "Beyond Beer");
        }
        const bps = cfg?.beer_price_segment;
        if (bps === "Core" || bps === "Value") {
            values = values.filter((v) => v === "Superior Core" || v === "Balanced Choices");
        }
        else if (bps === "Super Premium" ||
            bps === "Premium" ||
            bps === "Core+") {
            values = values.filter((v) => v === "Lead Premium" || v === "Balanced Choices");
        }
        return this.buildList(values, commercial_results_constants_1.FILTER_PLACEHOLDERS.growthLevers);
    }
    buildBeerPriceSegment(rows, cfg) {
        const cat = cfg?.category;
        const gl = cfg?.growth_levers;
        if (cat === "Adj" || cat === "NAB" || gl === "Beyond Beer") {
            return { enabled: false, default: null, values: [] };
        }
        let values = filterToAllowedValues(uniqueClean(rows.map((r) => r.beer_price_segment)), commercial_results_constants_1.BEER_PRICE_SEGMENT_ALLOWED_SET);
        if (gl === "Superior Core") {
            values = values.filter((v) => v === "Core" || v === "Value");
        }
        else if (gl === "Lead Premium") {
            values = values.filter((v) => v === "Super Premium" || v === "Premium" || v === "Core+");
        }
        return this.buildList(values, commercial_results_constants_1.FILTER_PLACEHOLDERS.beerPriceSegment);
    }
    buildPortfolio(rows, cfg) {
        if (cfg?.category === "NAB")
            return { enabled: false, default: null, values: [] };
        return this.buildList(filterToAllowedValues(uniqueClean(rows.map((r) => r.portfolio)), commercial_results_constants_1.PORTFOLIOS_ALLOWED_SET), commercial_results_constants_1.FILTER_PLACEHOLDERS.portfolios);
    }
    buildSku(rows, isBrandAll) {
        const placeholder = isBrandAll
            ? commercial_results_constants_1.FILTER_PLACEHOLDERS.skuNoBrand
            : commercial_results_constants_1.FILTER_PLACEHOLDERS.sku;
        const byBrand = groupSkuByBrand(rows);
        const brands = Object.keys(byBrand);
        if (brands.length === 0) {
            return { enabled: false, default: null, values: {} };
        }
        const skuPlaceholder = commercial_results_constants_1.FILTER_PLACEHOLDERS.sku;
        const values = {};
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
function buildGeoFilters(geoRows, user) {
    const countryValues = buildCountryValues(geoRows, user);
    const zoneValues = buildZoneValues(geoRows, countryValues);
    const { effective: reachable } = (0, effective_zones_1.computeEffectiveZones)(undefined, user);
    const geoZoneIds = new Set(uniqueClean(geoRows.map((r) => r.zone)).filter((z) => z !== GLOBAL_ZONE));
    const regionalEffective = reachable.filter((z) => z !== GLOBAL_ZONE &&
        geoZoneIds.has(z) &&
        Boolean(countryValues[z]?.length));
    const availableCountryIds = new Set(Object.values(countryValues).flatMap((entries) => entries.map((e) => e.value)));
    const defaults = regionalEffective.length > 0
        ? ((0, commercial_results_geo_defaults_1.resolveCommercialGeoDefault)(user, regionalEffective, availableCountryIds) ??
            (0, zone_country_defaults_1.computeZoneCountryDefaults)(regionalEffective, user, availableCountryIds))
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
function buildCountryValues(rows, user) {
    const byZone = groupByKey(rows, (r) => r.zone, (r) => r.country_iso_code_3, (iso, zone) => {
        const record = countries_registry_1.countriesRegistry[iso];
        return {
            value: iso,
            label: record?.title ?? iso,
            zone,
            quick_filter_label: record?.quick_filter_label ?? iso,
        };
    });
    for (const zone of Object.keys(byZone))
        byZone[zone].sort(byValue);
    const values = {};
    for (const [zone, entries] of Object.entries(byZone)) {
        if (zone !== GLOBAL_ZONE)
            values[zone] = entries;
    }
    if (user?.policy.mode === "explicit") {
        for (const zone of Object.keys(values)) {
            if (zone === GLOBAL_ZONE)
                continue;
            values[zone] = values[zone].filter((e) => user.hasCountryAccess(e.value));
            if (values[zone].length === 0)
                delete values[zone];
        }
    }
    return values;
}
function buildZoneValues(rows, countryValues) {
    const survivingZones = new Set(Object.keys(countryValues).filter((z) => z !== GLOBAL_ZONE));
    return uniqueClean(rows.map((r) => r.zone))
        .filter((zone) => zone !== GLOBAL_ZONE && survivingZones.has(zone))
        .map((zone) => ({
        value: zone,
        label: zones_registry_1.zonesRegistry[zone]?.title ?? zone,
    }))
        .sort(byValue);
}
function toCountryDefault(picked, countryValues) {
    const record = countries_registry_1.countriesRegistry[picked.value];
    const zone = record?.zone ?? "";
    return (countryValues[zone]?.find((entry) => entry.value === picked.value) ?? {
        value: picked.value,
        label: record?.title ?? picked.label,
        zone,
        quick_filter_label: record?.quick_filter_label ?? picked.quick_filter_label,
    });
}
function toZoneDefault(picked) {
    return {
        value: picked.value,
        label: zones_registry_1.zonesRegistry[picked.value]?.title ?? picked.label,
    };
}
function isClean(value) {
    return !!value && value.toLowerCase() !== "all";
}
const byValue = (a, b) => a.value.localeCompare(b.value);
const byString = (a, b) => a.localeCompare(b);
function uniqueClean(values) {
    return [...new Set(values.filter(isClean))];
}
function filterToAllowedValues(values, allowed) {
    return values.filter((value) => allowed.has(value));
}
function groupSkuByBrand(rows) {
    const groups = new Map();
    for (const { brand, sku, sub_brand } of rows) {
        if (!isClean(brand) || !isClean(sku))
            continue;
        let group = groups.get(brand);
        if (!group) {
            group = { seen: new Set(), options: [] };
            groups.set(brand, group);
        }
        if (group.seen.has(sku))
            continue;
        group.seen.add(sku);
        const option = { value: sku, label: sku };
        if (isClean(sub_brand)) {
            option.sub_brand = sub_brand;
        }
        group.options.push(option);
    }
    return Object.fromEntries([...groups.entries()].map(([brand, { options }]) => [brand, options]));
}
function groupByKey(rows, selectKey, selectValue, makeItem) {
    const groups = {};
    const seen = {};
    for (const row of rows) {
        const key = selectKey(row);
        const value = selectValue(row);
        if (!isClean(key) || !isClean(value))
            continue;
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
exports.commercialResultsHandler = new CommercialResultsPresetHandler();
//# sourceMappingURL=commercial-results.handler.js.map
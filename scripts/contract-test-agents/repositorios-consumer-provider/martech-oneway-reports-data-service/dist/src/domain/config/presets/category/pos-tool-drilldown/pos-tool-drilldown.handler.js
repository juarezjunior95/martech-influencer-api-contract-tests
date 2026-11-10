"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posToolDrilldownHandler = exports.CATEGORY_POS_TOOL_DRILLDOWN_PAGE = exports.POS_TOOL_DRILLDOWN_FUNCTION_NAME = exports.POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID = void 0;
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const pos_tool_drilldown_viewby_model_1 = require("./pos-tool-drilldown-viewby.model");
const filter_rules_1 = require("./filter-rules");
const demographic_options_model_1 = require("../../cohorts/demographic-options.model");
const country_types_1 = require("../../country/country.types");
const country_handler_1 = require("../../country/country.handler");
const show_global_data_datasets_1 = require("../../show-global-data/show-global-data.datasets");
const zones_handler_1 = require("../../zones/zones.handler");
const kpis_model_1 = require("../../kpis/kpis.model");
const pos_tool_timeframe_model_1 = require("../pos-tool/pos-tool-timeframe.model");
const time_frame_handler_1 = require("../../time-frame/time-frame.handler");
const pos_tool_drilldown_constants_1 = require("./pos-tool-drilldown.constants");
const performance_tool_constants_1 = require("../../performance-tool/performance-tool.constants");
exports.POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID = "category-pos-tool-drilldown";
exports.POS_TOOL_DRILLDOWN_FUNCTION_NAME = "1_category_home_filters";
exports.CATEGORY_POS_TOOL_DRILLDOWN_PAGE = "category_pos-tool-drilldown";
const ALL_TUPLE = {
    value: "All",
    label: "All",
    full: "",
};
const BRAND_ALL_TUPLE = {
    ...ALL_TUPLE,
    countries: [],
    regions: [],
    manufacturers: [],
    categories: [],
    Portfolio: {},
    "Growth Levers": {},
};
class PosToolDrilldownPresetHandler {
    get name() {
        return this.constructor.name;
    }
    datasets() {
        return [
            {
                id: exports.POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID,
                config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                    functionName: exports.POS_TOOL_DRILLDOWN_FUNCTION_NAME,
                    parameters: [],
                }),
            },
            ...(0, show_global_data_datasets_1.collectShowGlobalDataDatasetConfigs)(["pos"]),
            ...(time_frame_handler_1.timeFrameHandler.datasets?.() ?? []),
        ];
    }
    handle(preset, datasets) {
        const rows = this.extractRows(datasets);
        const timeframeValues = (0, pos_tool_timeframe_model_1.getPosToolDrilldownTimeframeTuples)(datasets);
        const kpiTuples = (0, kpis_model_1.getKpisForGroup)(kpis_model_1.KPI_GROUP_POS_TOOL_DRILLDOWN).map((kpi) => ({
            value: kpi.value,
            label: kpi.label,
            full: kpi.full || kpi.label,
        }));
        const kpiDefault = kpiTuples.find((row) => row.value === "p4w") ??
            kpiTuples[0] ??
            {};
        const kpiGroupsOrder = [];
        const kpiGroupsMap = new Map();
        for (const kpi of kpiTuples) {
            const group = kpi.label.split(" ")[0];
            if (!group) {
                continue;
            }
            if (!kpiGroupsMap.has(group)) {
                kpiGroupsMap.set(group, []);
                kpiGroupsOrder.push(group);
            }
            kpiGroupsMap.get(group)?.push(kpi);
        }
        const kpiGroupedValues = kpiGroupsOrder.map((group) => ({
            group,
            values: kpiGroupsMap.get(group) ?? [],
        }));
        const payload = {
            viewby: this.toDimension((0, pos_tool_drilldown_viewby_model_1.getPosToolDrilldownViewbyTuples)(), "Category"),
            country: this.buildCountryDimension(preset, datasets),
            zone: this.buildZoneDimension(),
            region: this.buildRegionDimension(rows),
            timeframe: {
                enabled: true,
                default: timeframeValues.find((row) => row.value === "R12M") ??
                    timeframeValues[0] ??
                    {},
                values: timeframeValues,
            },
            category: this.toDimension(this.extractDistinctCategoryValues(rows)),
            manufacturer: this.buildManufacturerDimension(rows),
            cohort: this.buildCohortDimension(),
            brand_segments: {
                enabled: true,
                default: ALL_TUPLE,
                values: this.buildBrandSegmentsValues(),
            },
            kpi: {
                enabled: true,
                default: kpiDefault,
                values: kpiGroupedValues,
            },
            brand: this.buildBrandDimension(rows),
            filter_rules: this.buildFilterRules(),
        };
        return { "pos-tool-drilldown": payload };
    }
    buildCohortDimension() {
        return {
            enabled: true,
            default: ALL_TUPLE,
            values: [
                {
                    group: "Gender",
                    values: (0, demographic_options_model_1.getAllGenderTuples)()
                        .filter((r) => r.label !== "All")
                        .map((r) => ({ value: r.value, label: r.label, full: r.full })),
                },
                {
                    group: "Age",
                    values: (0, demographic_options_model_1.getAllAgeGroupTuples)()
                        .filter((r) => r.label !== "All")
                        .map((r) => ({ value: r.value, label: r.label, full: r.full })),
                },
                {
                    group: "Social Economic Level",
                    values: (0, demographic_options_model_1.getAllSocialEconomicLevelTuples)()
                        .filter((r) => r.label !== "All")
                        .map((r) => ({ value: r.value, label: r.label, full: r.full })),
                },
            ],
        };
    }
    extractRows(datasets) {
        const dataset = datasets?.find((d) => d.id === exports.POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID);
        if (!dataset?.data?.length) {
            return [];
        }
        const out = [];
        for (const raw of dataset.data) {
            if (!raw || typeof raw !== "object") {
                continue;
            }
            out.push(raw);
        }
        return out;
    }
    toDimension(values, defaultLabel) {
        const defaultValue = values.find((row) => row.label === defaultLabel) ??
            values[0] ??
            {};
        return {
            enabled: true,
            default: defaultValue,
            values,
        };
    }
    buildCountryDimension(preset, datasets) {
        const raw = preset[exports.CATEGORY_POS_TOOL_DRILLDOWN_PAGE];
        const countryItem = (0, country_types_1.isCountryFilterItem)(raw)
            ? raw
            : {
                type: "country",
                page: exports.CATEGORY_POS_TOOL_DRILLDOWN_PAGE,
                hideGlobalForKpi: "pos",
            };
        const response = country_handler_1.countryHandler.handle({ country: countryItem }, datasets);
        return response.country;
    }
    buildZoneDimension() {
        const preset = {
            zone: { type: "zones" },
        };
        const response = zones_handler_1.zonesHandler.handle(preset);
        return response.zone;
    }
    buildRegionDimension(rows) {
        const regionToCountries = new Map();
        for (const row of rows) {
            const rawRegion = pickString(row, ["region"]);
            const region = rawRegion.trim();
            if (!region) {
                continue;
            }
            const regionKey = region.toLowerCase();
            const existing = regionToCountries.get(regionKey) ?? {
                label: region,
                countries: new Map(),
            };
            const rawCountry = pickString(row, ["country"]);
            const country = rawCountry.trim();
            if (country) {
                const countryKey = country.toLowerCase();
                if (!existing.countries.has(countryKey)) {
                    existing.countries.set(countryKey, country);
                }
            }
            regionToCountries.set(regionKey, existing);
        }
        const values = Array.from(regionToCountries.values())
            .map(({ label, countries }) => ({
            value: label,
            label,
            full: "",
            country: Array.from(countries.values()).sort((a, b) => a.localeCompare(b)),
        }))
            .sort((a, b) => a.label.localeCompare(b.label));
        return {
            enabled: true,
            default: ALL_TUPLE,
            values,
        };
    }
    buildManufacturerDimension(rows) {
        const values = this.extractDistinctValues(rows, ["manufacturer"]);
        return {
            enabled: true,
            default: ALL_TUPLE,
            values: [ALL_TUPLE, ...values],
        };
    }
    extractDistinctCategoryValues(rows) {
        const seen = new Set();
        const values = [];
        for (const row of rows) {
            const raw = pickString(row, ["category"]);
            if (!raw) {
                continue;
            }
            const canonical = raw.trim();
            if (!canonical) {
                continue;
            }
            const seenKey = (0, pos_tool_drilldown_constants_1.resolvePosToolDrilldownCategoryDedupKey)(canonical);
            if (seen.has(seenKey)) {
                continue;
            }
            seen.add(seenKey);
            const normalized = (0, pos_tool_drilldown_constants_1.normalizePosToolDrilldownCategoryValue)(canonical);
            if (!normalized) {
                continue;
            }
            values.push({
                value: normalized,
                label: normalized,
                full: normalized === pos_tool_drilldown_constants_1.POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER
                    ? pos_tool_drilldown_constants_1.POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER
                    : "",
            });
        }
        values.sort((a, b) => a.label.localeCompare(b.label));
        return values;
    }
    extractDistinctValues(rows, keys) {
        const seen = new Set();
        const values = [];
        for (const row of rows) {
            const raw = pickString(row, keys);
            if (!raw) {
                continue;
            }
            const canonical = raw.trim();
            if (!canonical) {
                continue;
            }
            const seenKey = canonical.toLowerCase();
            if (seen.has(seenKey)) {
                continue;
            }
            seen.add(seenKey);
            values.push({
                value: canonical,
                label: canonical,
                full: "",
            });
        }
        values.sort((a, b) => a.label.localeCompare(b.label));
        return values;
    }
    buildBrandSegmentsValues() {
        return [
            {
                group: performance_tool_constants_1.ALL_BRANDS,
                values: [{ value: performance_tool_constants_1.ALL_BRANDS, label: performance_tool_constants_1.ALL_BRANDS, full: "" }],
            },
            {
                group: "Portfolio",
                values: pos_tool_drilldown_constants_1.POS_TOOL_DRILLDOWN_PORTFOLIO.map((row) => ({ ...row })),
            },
            {
                group: "Growth Levers",
                values: pos_tool_drilldown_constants_1.POS_TOOL_DRILLDOWN_GROWTH_LEVERS.map((row) => ({ ...row })),
            },
        ];
    }
    buildBrandDimension(rows) {
        const baseBrandValues = this.extractDistinctValues(rows, ["brand"]);
        const membership = this.buildBrandMembershipMap(rows);
        const values = baseBrandValues.map((brand) => {
            const normalized = normalizeBrand(brand.value);
            const attrs = membership.get(normalized) ?? {
                countries: [],
                regions: [],
                manufacturers: [],
                categories: [],
                portfolio: {},
                growthLevers: {},
            };
            return {
                ...brand,
                countries: attrs.countries,
                regions: attrs.regions,
                manufacturers: attrs.manufacturers,
                categories: attrs.categories,
                Portfolio: attrs.portfolio,
                "Growth Levers": attrs.growthLevers,
            };
        });
        return {
            enabled: true,
            default: ALL_TUPLE,
            values: [BRAND_ALL_TUPLE, ...values],
        };
    }
    buildFilterRules() {
        const commands = (0, filter_rules_1.getPosToolDrilldownFilterRulesCommands)();
        const filters = commands.reduce((acc, command) => {
            acc[command.filterKey] = command.execute();
            return acc;
        }, {});
        return { filters };
    }
    buildBrandMembershipMap(rows) {
        const map = new Map();
        for (const row of rows) {
            const brand = pickString(row, ["brand"]);
            if (!brand) {
                continue;
            }
            const key = normalizeBrand(brand);
            const current = map.get(key) ?? createEmptyBrandMembership();
            const country = pickString(row, ["country"]);
            const region = pickFieldValue(row, ["region"]);
            const manufacturer = pickFieldValue(row, ["manufacturer"]);
            const category = pickFieldValue(row, ["category"]);
            addDistinctValue(current.countries, country);
            addDistinctValue(current.regions, region);
            addDistinctValue(current.manufacturers, manufacturer);
            addDistinctValue(current.categories, category);
            if (country) {
                const portfolio = pickFieldValue(row, ["portfolio"]);
                const growthLever = pickFieldValue(row, ["growth_lever"]);
                if (portfolio) {
                    current.portfolio[country] =
                        (0, pos_tool_drilldown_constants_1.normalizePosToolDrilldownPortfolio)(portfolio);
                }
                if (growthLever) {
                    current.growthLevers[country] =
                        (0, pos_tool_drilldown_constants_1.normalizePosToolDrilldownGrowthLever)(growthLever);
                }
            }
            map.set(key, current);
        }
        return map;
    }
}
function pickString(raw, keys) {
    for (const key of keys) {
        const direct = raw[key];
        if (typeof direct === "string" && direct.trim().length > 0) {
            return direct;
        }
        const upper = raw[key.toUpperCase()];
        if (typeof upper === "string" && upper.trim().length > 0) {
            return upper;
        }
    }
    return "";
}
function pickFieldValue(raw, keys) {
    for (const key of keys) {
        const direct = raw[key];
        if (typeof direct === "string" && direct.trim().length > 0) {
            return normalizeFieldValue(direct);
        }
        const upper = raw[key.toUpperCase()];
        if (typeof upper === "string" && upper.trim().length > 0) {
            return normalizeFieldValue(upper);
        }
    }
    return "";
}
function normalizeFieldValue(value) {
    const trimmed = value.trim();
    if (trimmed.toLowerCase() === "n/a") {
        return "";
    }
    return trimmed;
}
function normalizeBrand(value) {
    return value.trim().toLowerCase();
}
function createEmptyBrandMembership() {
    return {
        countries: [],
        regions: [],
        manufacturers: [],
        categories: [],
        portfolio: {},
        growthLevers: {},
    };
}
function addDistinctValue(list, value) {
    if (!value) {
        return;
    }
    const exists = list.some((entry) => entry.toLowerCase() === value.toLowerCase());
    if (!exists) {
        list.push(value);
    }
}
exports.posToolDrilldownHandler = new PosToolDrilldownPresetHandler();
//# sourceMappingURL=pos-tool-drilldown.handler.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueCreationHandler = void 0;
const scopes_1 = require("../../../entities/scopes");
const resolver_1 = require("../../../registries/resolver");
const dataset_repository_factory_1 = require("../../../factories/dataset-repository.factory");
const kpi_group_time_frame_config_1 = __importDefault(require("../../config-groups/kpi-group-time-frame.config"));
const kpi_group_handler_1 = require("../kpi-group/kpi-group.handler");
const kpi_group_types_1 = require("../kpi-group/kpi-group.types");
const value_creation_defaults_1 = require("./value-creation.defaults");
const value_creation_types_1 = require("./value-creation.types");
const country_image_utils_1 = require("../../../../common/utils/images/country-image.utils");
const ZONE_CODES_IN_ORDER = [
    value_creation_defaults_1.VALUE_CREATION_GEO_ABI,
    "AFR",
    "APAC",
    value_creation_defaults_1.VALUE_CREATION_GEO_EUR,
    "MAZ",
    "NAZ",
    "SAZ",
];
class ValueCreationPresetHandler {
    get name() {
        return this.constructor.name;
    }
    datasets() {
        return [
            {
                id: kpi_group_types_1.KPI_GROUP_DATASET_ID,
                config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                    query: kpi_group_types_1.KPI_GROUP_DATASET_QUERY,
                }),
            },
            {
                id: value_creation_types_1.VALUE_CREATION_DATASET_ID,
                config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                    functionName: value_creation_types_1.VALUE_CREATION_FILTER_SP_NAME,
                    parameters: [],
                }),
            },
        ];
    }
    handle(preset, datasets, user) {
        if (user?.policy.mode === "deny") {
            const empty = {
                country: { default: {}, values: {} },
                zones: { default: {}, values: [] },
                periods: { default: {}, values: [] },
            };
            return { "value-creation": { ...preset, ...empty } };
        }
        const rows = this.extractRows(datasets);
        const rawData = [...this.buildMockData(), ...rows];
        const countryValues = this.extractCountries(rawData, user);
        const zonesValue = this.extractZones(countryValues);
        const periodsValue = this.buildPeriods(datasets);
        const countryDim = {
            default: getDefaultCountry(countryValues),
            values: countryValues,
        };
        const zonesDim = {
            default: getDefaultFromList(zonesValue),
            values: zonesValue,
        };
        const periodsDim = {
            default: getDefaultFromList(periodsValue),
            values: periodsValue,
        };
        const payload = {
            country: countryDim,
            zones: zonesDim,
            periods: periodsDim,
        };
        return { "value-creation": { ...preset, ...payload } };
    }
    extractRows(datasets) {
        const dataset = datasets?.find((d) => d.id === value_creation_types_1.VALUE_CREATION_DATASET_ID);
        if (!dataset?.data?.length) {
            return [];
        }
        const out = [];
        for (const raw of dataset.data) {
            const zone = pickString(raw, ["ABI_ZONE", "abi_zone"]);
            const geography = pickString(raw, ["RAW_GEOGRAPHY", "raw_geography"]);
            const iso = pickString(raw, ["COUNTRY_ISO_CODE_3", "country_iso_code_3"]);
            const growth = pickString(raw, ["GROWTHLEVER", "growthlever"]);
            if (!zone || !geography || !iso || !growth) {
                continue;
            }
            out.push({
                ABI_ZONE: zone,
                RAW_GEOGRAPHY: geography,
                COUNTRY_ISO_CODE_3: iso,
                GROWTHLEVER: growth,
            });
        }
        return out;
    }
    buildMockData() {
        const mock = [];
        for (const growthLever of value_creation_defaults_1.VALUE_CREATION_GROWTH_LEVERS_TEMPLATE) {
            mock.push({
                ABI_ZONE: value_creation_defaults_1.VALUE_CREATION_GEO_ABI,
                RAW_GEOGRAPHY: value_creation_defaults_1.VALUE_CREATION_GEO_ABI,
                COUNTRY_ISO_CODE_3: value_creation_defaults_1.VALUE_CREATION_GEO_ABI,
                GROWTHLEVER: growthLever.value,
            });
            mock.push({
                ABI_ZONE: value_creation_defaults_1.VALUE_CREATION_GEO_EUR,
                RAW_GEOGRAPHY: value_creation_defaults_1.VALUE_CREATION_GEO_EUR,
                COUNTRY_ISO_CODE_3: value_creation_defaults_1.VALUE_CREATION_GEO_ABI,
                GROWTHLEVER: growthLever.value,
            });
        }
        return mock;
    }
    extractCountries(rawData, user) {
        const countries = this.initializeCountriesArray();
        const processedCountries = {};
        for (const row of rawData) {
            const zone = row.ABI_ZONE;
            const country = row.RAW_GEOGRAPHY;
            const countryIsoCode = row.COUNTRY_ISO_CODE_3;
            const growthLever = row.GROWTHLEVER;
            if (!this.rowVisibleForUser(user, countryIsoCode, zone)) {
                continue;
            }
            if (!countries[zone]) {
                countries[zone] = [];
            }
            const zoneBucket = countries[zone];
            const countryIndex = zoneBucket.findIndex((c) => c.value === countryIsoCode);
            let idx;
            if (countryIndex === -1) {
                const mapped = value_creation_defaults_1.VALUE_CREATION_GEO_MAPPING[zone]?.[countryIsoCode] ?? null;
                const entry = mapped
                    ? {
                        value: mapped.value,
                        label: mapped.label,
                        quick_filter_label: mapped.quick_filter_label,
                        zone: mapped.zone,
                        growth_levers: mapped.growth_levers.map((g) => ({ ...g })),
                        image_url: (0, country_image_utils_1.getCountryFlag)(mapped.value),
                    }
                    : {
                        value: countryIsoCode,
                        label: country,
                        quick_filter_label: country,
                        zone,
                        growth_levers: (0, value_creation_defaults_1.cloneGrowthLeverTemplate)(),
                        image_url: (0, country_image_utils_1.getCountryFlag)(countryIsoCode),
                    };
                zoneBucket.push(entry);
                idx = zoneBucket.length - 1;
            }
            else {
                idx = countryIndex;
            }
            const growthLeverIndex = zoneBucket[idx].growth_levers.findIndex((g) => g.value === growthLever);
            if (growthLeverIndex >= 0) {
                zoneBucket[idx].growth_levers[growthLeverIndex].disabled = false;
            }
            if (!(zone === value_creation_defaults_1.VALUE_CREATION_GEO_ABI &&
                countryIsoCode === value_creation_defaults_1.VALUE_CREATION_GEO_ABI)) {
                processedCountries[countryIsoCode] = cloneCountryEntry(zoneBucket[idx]);
            }
        }
        if (countries[value_creation_defaults_1.VALUE_CREATION_GEO_ABI]?.length) {
            const globalZoneCountries = Object.values(processedCountries)
                .filter((c) => c.value !== value_creation_defaults_1.VALUE_CREATION_GEO_ABI)
                .sort((a, b) => a.quick_filter_label.localeCompare(b.quick_filter_label));
            countries[value_creation_defaults_1.VALUE_CREATION_GEO_ABI] = [
                ...countries[value_creation_defaults_1.VALUE_CREATION_GEO_ABI],
                ...globalZoneCountries.map(cloneCountryEntry),
            ];
        }
        return Object.fromEntries(Object.entries(countries).filter(([, list]) => list.length > 0));
    }
    rowVisibleForUser(user, countryIsoCode, zone) {
        if (!user ||
            user.policy.mode === "unrestricted" ||
            user.policy.mode === "all") {
            return true;
        }
        if (user.policy.mode === "deny") {
            return false;
        }
        if (countryIsoCode === value_creation_defaults_1.VALUE_CREATION_GEO_ABI) {
            if (zone === value_creation_defaults_1.VALUE_CREATION_GEO_ABI) {
                return false;
            }
            if (zone === value_creation_defaults_1.VALUE_CREATION_GEO_EUR) {
                return canSeeEurAggregateOption(user);
            }
            return false;
        }
        return user.hasCountryAccess(countryIsoCode);
    }
    initializeCountriesArray() {
        const zones = {};
        for (const code of ZONE_CODES_IN_ORDER) {
            zones[code] = [];
        }
        return zones;
    }
    extractZones(countries) {
        const zones = [];
        for (const [zone, countriesInZone] of Object.entries(countries)) {
            if (countriesInZone.length > 0) {
                zones.push({
                    full: "",
                    label: zone === value_creation_defaults_1.VALUE_CREATION_GEO_ABI ? "Global" : zone,
                    value: zone,
                    image_url: (0, country_image_utils_1.getCountryFlag)(zone),
                });
            }
        }
        return zones;
    }
    buildPeriods(datasets) {
        const queried = kpi_group_handler_1.kpiGroupHandler.handle({}, datasets);
        const fromQuery = typeof queried.volume === "string" && queried.volume.length > 0
            ? queried.volume
            : "";
        const refresh = fromQuery || (kpi_group_time_frame_config_1.default.config.volume ?? "");
        return generateMonthlyTimeframes(refresh);
    }
}
function cloneCountryEntry(entry) {
    return {
        ...entry,
        growth_levers: entry.growth_levers.map((g) => ({ ...g })),
    };
}
function pickString(raw, keys) {
    for (const key of keys) {
        const v = raw[key];
        if (typeof v === "string" && v.length > 0) {
            return v;
        }
    }
    return "";
}
function getDefaultCountry(values) {
    const orderedKeys = ZONE_CODES_IN_ORDER.filter((k) => (values[k] ?? []).length > 0);
    if (orderedKeys.length === 0) {
        return {};
    }
    const firstBucket = values[orderedKeys[0]];
    if (!firstBucket?.length) {
        return {};
    }
    return cloneCountryEntry(firstBucket[0]);
}
function getDefaultFromList(list) {
    if (list.length === 0) {
        return {};
    }
    return { ...list[0] };
}
function canSeeEurAggregateOption(user) {
    if (user.policy.mode !== "explicit") {
        return false;
    }
    if (user.scopes.includes(scopes_1.VIEWER_SCOPES.ZONE.EUR)) {
        return true;
    }
    return coversEveryCountryInZone(user.policy.iso3Set, value_creation_defaults_1.VALUE_CREATION_GEO_EUR);
}
function coversEveryCountryInZone(iso3Set, zoneId) {
    const inZone = (0, resolver_1.resolveCountriesByZone)(zoneId);
    return inZone.length > 0 && inZone.every((c) => iso3Set.has(c.id));
}
function generateMonthlyTimeframes(volumeRefreshDateDdMmYyyy) {
    const parts = volumeRefreshDateDdMmYyyy.split("-");
    if (parts.length !== 3) {
        return [];
    }
    const day = Number(parts[0]);
    const month = Number(parts[1]);
    const year = Number(parts[2]);
    if (![day, month, year].every(Number.isFinite)) {
        return [];
    }
    const utcMs = Date.UTC(year, month - 1, day);
    const cal = new Date(utcMs);
    if (cal.getUTCFullYear() !== year ||
        cal.getUTCMonth() !== month - 1 ||
        cal.getUTCDate() !== day) {
        return [];
    }
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const formattedDateEnd = `${months[cal.getUTCMonth()]}'${String(year).slice(2)}`;
    return [
        {
            value: "YTD",
            label: `YTD ${formattedDateEnd}`,
            full: "Year To Date (YTD)",
        },
        {
            value: "L3M",
            label: `L3M ${formattedDateEnd}`,
            full: "Last 3 Months (L3M)",
        },
        {
            value: "MTD",
            label: formattedDateEnd,
            full: "Month To Date (MTD)",
        },
    ];
}
exports.valueCreationHandler = new ValueCreationPresetHandler();
//# sourceMappingURL=value-creation.handler.js.map
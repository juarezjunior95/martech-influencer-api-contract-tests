"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceToolHandler = void 0;
const dataset_repository_factory_1 = require("../../../factories/dataset-repository.factory");
const kpi_group_time_frame_config_1 = __importDefault(require("../../config-groups/kpi-group-time-frame.config"));
const kpi_group_handler_1 = require("../kpi-group/kpi-group.handler");
const kpi_group_types_1 = require("../kpi-group/kpi-group.types");
const performance_tool_mock_data_1 = require("./performance-tool.mock-data");
const performance_tool_filter_builder_1 = require("./performance-tool.filter-builder");
const performance_tool_constants_1 = require("./performance-tool.constants");
const performance_tool_user_permissions_1 = require("./performance-tool.user-permissions");
const performance_tool_types_1 = require("./performance-tool.types");
const REFRESH_MAP_KEYS = [
    "volume",
    "finance",
    "market_share",
    "market_share_official_total",
    "media",
    "power",
    "p4w",
    "pos",
    "growth_league",
    "innovation",
    "portfolio-health",
    "bees-distribution",
    "pillar-rennovation",
    "category-health",
];
function staticRefreshMap() {
    const c = kpi_group_time_frame_config_1.default.config;
    return {
        volume: c.volume,
        finance: c.finance,
        market_share: c.market_share,
        market_share_official_total: c.market_share_official_total,
        media: c.media,
        power: c.power,
        p4w: c.p4w,
        pos: c.pos,
        growth_league: c.growth_league,
        innovation: c.innovation,
        "portfolio-health": c["portfolio-health"],
        "bees-distribution": c["bees-distribution"],
        "pillar-rennovation": c["pillar-rennovation"],
        "category-health": c["category-health"],
    };
}
function toRefreshMap(datasets) {
    const queried = kpi_group_handler_1.kpiGroupHandler.handle({}, datasets);
    const fallback = staticRefreshMap();
    const out = { ...fallback };
    for (const key of REFRESH_MAP_KEYS) {
        const value = queried[key];
        if (typeof value === "string" && value.length > 0) {
            out[key] = value;
        }
    }
    return out;
}
class PerformanceToolPresetHandler {
    get name() {
        return this.constructor.name;
    }
    datasets() {
        return [
            {
                id: performance_tool_types_1.PERFORMANCE_TOOL_DATASET_ID,
                config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                    functionName: performance_tool_types_1.PERFORMANCE_TOOL_FILTER_SP_NAME,
                    parameters: [],
                }),
            },
            {
                id: kpi_group_types_1.KPI_GROUP_DATASET_ID,
                config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                    query: kpi_group_types_1.KPI_GROUP_DATASET_QUERY,
                }),
            },
        ];
    }
    handle(preset, datasets, user) {
        const userPermissions = (0, performance_tool_user_permissions_1.buildPerformanceToolUserPermissions)(user);
        const kpiRefreshDates = toRefreshMap(datasets);
        const rows = this.extractRows(datasets);
        const rawData = [
            ...rows,
            ...(0, performance_tool_mock_data_1.buildPerformanceToolMockData)(),
        ];
        const filterData = (0, performance_tool_filter_builder_1.buildPerformanceToolFilterPayload)(rawData, performance_tool_constants_1.KPIS_ENABLED, kpiRefreshDates, userPermissions);
        return {
            "performance-tool": {
                ...preset,
                ...filterData,
            },
        };
    }
    extractRows(datasets) {
        const dataset = datasets?.find((d) => d.id === performance_tool_types_1.PERFORMANCE_TOOL_DATASET_ID);
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
}
exports.performanceToolHandler = new PerformanceToolPresetHandler();
//# sourceMappingURL=performance-tool.handler.js.map
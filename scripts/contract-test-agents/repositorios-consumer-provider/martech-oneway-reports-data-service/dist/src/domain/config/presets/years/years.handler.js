"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yearsHandler = void 0;
const dataset_repository_factory_1 = require("../../../factories/dataset-repository.factory");
const kpi_group_time_frame_config_1 = __importDefault(require("../../config-groups/kpi-group-time-frame.config"));
const kpi_group_handler_1 = require("../kpi-group/kpi-group.handler");
const kpi_group_types_1 = require("../kpi-group/kpi-group.types");
const FULL_YEAR_PREFIX = "FY'";
const FULL_YEAR_LABEL = "Full Year (FY)";
function asYear(value, fallback) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string" && /^\d+$/.test(value)) {
        const n = Number(value);
        if (Number.isFinite(n)) {
            return n;
        }
    }
    return fallback;
}
class YearsPresetHandler {
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
        ];
    }
    handle(preset, datasets) {
        const yearsConfig = (preset.years ?? {});
        const { start, end } = this.resolveRange(yearsConfig, datasets);
        const values = this.buildYears(start, end);
        const noDefault = yearsConfig.noDefault === true;
        const defaultTuple = noDefault || values.length === 0 ? {} : { ...values[0] };
        const yearsValue = {
            values,
            default: defaultTuple,
            enabled: true,
        };
        return { ...preset, years: yearsValue };
    }
    resolveRange(config, datasets) {
        const c = kpi_group_time_frame_config_1.default.config;
        const queried = kpi_group_handler_1.kpiGroupHandler.handle({}, datasets);
        const startYear = config.startYear !== undefined
            ? config.startYear
            : asYear(queried.category_health_full_years_start, c.category_health_full_years_start);
        const endYear = config.endYear !== undefined
            ? config.endYear
            : asYear(queried.category_health_full_years_end, c.category_health_full_years_end);
        return startYear <= endYear
            ? { start: startYear, end: endYear }
            : { start: endYear, end: startYear };
    }
    buildYears(start, end) {
        const years = [];
        for (let year = end; year >= start; year--) {
            const shortYear = String(year).slice(-2);
            years.push({
                value: String(year),
                label: `${FULL_YEAR_PREFIX}${shortYear}`,
                full: FULL_YEAR_LABEL,
            });
        }
        return years;
    }
}
exports.yearsHandler = new YearsPresetHandler();
//# sourceMappingURL=years.handler.js.map
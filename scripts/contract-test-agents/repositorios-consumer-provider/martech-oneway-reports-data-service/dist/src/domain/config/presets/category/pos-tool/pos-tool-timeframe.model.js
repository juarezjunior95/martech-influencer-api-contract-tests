"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosToolTimeframeTuples = getPosToolTimeframeTuples;
exports.getPosToolOverviewPeriods = getPosToolOverviewPeriods;
exports.getPosToolDrilldownTimeframeTuples = getPosToolDrilldownTimeframeTuples;
const pos_periods_handler_1 = require("../../pos-periods/pos-periods.handler");
const kpi_group_time_frame_config_1 = __importDefault(require("../../../config-groups/kpi-group-time-frame.config"));
const kpi_group_handler_1 = require("../../kpi-group/kpi-group.handler");
const time_frame_handler_1 = require("../../time-frame/time-frame.handler");
const pos_tool_timeframe_constants_1 = require("./pos-tool-timeframe.constants");
function resolvePosRefreshDate(datasets) {
    const queried = kpi_group_handler_1.kpiGroupHandler.handle({}, datasets);
    const fromQuery = typeof queried.pos === "string" && queried.pos.length > 0
        ? queried.pos
        : "";
    return fromQuery || kpi_group_time_frame_config_1.default.config.pos;
}
function resolveTimeFrameEndDate(datasets) {
    const posRefreshDate = resolvePosRefreshDate(datasets);
    const response = time_frame_handler_1.timeFrameHandler.handle({ "time-frame": { volumeRefreshDate: posRefreshDate } }, datasets);
    const block = response["time-frame"];
    const rawEnd = block?.default?.end ?? block?.values?.end;
    if (typeof rawEnd !== "string") {
        return new Date();
    }
    const parsed = new Date(`${rawEnd}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime())) {
        return new Date();
    }
    return parsed;
}
function resolveCurrentQuarter(datasets) {
    const endDate = resolveTimeFrameEndDate(datasets);
    const month = endDate.getUTCMonth() + 1;
    const quarter = Math.ceil(month / 3);
    return `Q${quarter}`;
}
function resolveCurrentYearTwoDigits(datasets) {
    const endDate = resolveTimeFrameEndDate(datasets);
    const year = endDate.getUTCFullYear();
    return String(year).slice(-2);
}
function getPosToolTimeframeTuples(config, datasets) {
    const quarter = resolveCurrentQuarter(datasets);
    const yy = resolveCurrentYearTwoDigits(datasets);
    const options = pos_periods_handler_1.POS_PERIODS.map((period) => ({
        value: config.valueField === "value" ? period.value : period.label,
        label: `${period.value} ${quarter}'${yy}`,
        full: pos_tool_timeframe_constants_1.POS_TOOL_TIMEFRAME_FULL_LABELS[period.value] ?? period.label,
    }));
    if (!config.order) {
        return options;
    }
    return config.order
        .map((code) => options.find((option) => {
        const period = pos_periods_handler_1.POS_PERIODS.find((row) => row.value === code);
        if (!period) {
            return false;
        }
        const optionValue = config.valueField === "value" ? period.value : period.label;
        return option.value === optionValue;
    }))
        .filter((option) => option !== undefined);
}
function getPosToolOverviewPeriods(datasets) {
    const values = getPosToolTimeframeTuples({ valueField: "value", order: ["R12M", "QTD"] }, datasets);
    const defaultRow = values.find((row) => row.value === "R12M") ??
        values[0] ??
        { value: "", label: "", full: "" };
    return {
        enabled: true,
        values,
        default: { ...defaultRow },
    };
}
function getPosToolDrilldownTimeframeTuples(datasets) {
    return getPosToolTimeframeTuples({ valueField: "label", order: ["R12M", "QTD"] }, datasets);
}
//# sourceMappingURL=pos-tool-timeframe.model.js.map
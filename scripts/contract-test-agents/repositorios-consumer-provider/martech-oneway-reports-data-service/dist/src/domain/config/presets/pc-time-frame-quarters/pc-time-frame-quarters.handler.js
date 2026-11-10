"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pcTimeFrameHandler = void 0;
const dataset_repository_factory_1 = require("../../../factories/dataset-repository.factory");
const kpi_group_time_frame_config_1 = __importDefault(require("../../config-groups/kpi-group-time-frame.config"));
const kpi_group_handler_1 = require("../kpi-group/kpi-group.handler");
const kpi_group_types_1 = require("../kpi-group/kpi-group.types");
class PcTimeFramePresetHandler {
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
        const cfg = preset["pc-time-frame-quarters"];
        const volume = this.resolveVolumeRefreshDate(cfg, datasets);
        if (!isNonEmptyString(volume)) {
            throw new Error("pc-time-frame-quarters requires a non-empty volume refresh date (kpi_group row `volume` / `time_frame`, optional preset override, or kpi_group_time_frame.config.volume as DD-MM-YYYY)");
        }
        return {
            ...preset,
            "pc-time-frame-quarters": this.buildFromVolumeRefreshDate(volume),
        };
    }
    resolveVolumeRefreshDate(cfg, datasets) {
        const override = cfg?.volumeRefreshDate;
        if (isNonEmptyString(override)) {
            return override;
        }
        const queried = kpi_group_handler_1.kpiGroupHandler.handle({}, datasets);
        if (isNonEmptyString(queried.volume)) {
            return queried.volume;
        }
        return kpi_group_time_frame_config_1.default.config.volume;
    }
    buildFromVolumeRefreshDate(volumeRefreshDate) {
        const { ytdYear, month } = parseVolumeDate(volumeRefreshDate);
        const ytdQuarter = monthToQuarter(month);
        const hasClosedQuarterInCurrentYear = month >= 3;
        const starterYear = hasClosedQuarterInCurrentYear ? ytdYear : ytdYear - 1;
        const starterTopQuarter = hasClosedQuarterInCurrentYear ? ytdQuarter : 4;
        const values = [
            ...buildYearQuarters(starterYear, starterTopQuarter),
            ...buildYearQuarters(starterYear - 1, 4),
        ];
        return {
            values,
            default: values.length > 0 ? { ...values[0] } : {},
            enabled: true,
        };
    }
}
function isNonEmptyString(value) {
    return typeof value === "string" && value.length > 0;
}
function buildYearQuarters(year, topQuarter) {
    const tuples = [];
    for (let quarter = topQuarter; quarter >= 1; quarter--) {
        tuples.push({
            value: `${year}_Q${quarter}`,
            label: `${year} - Q${quarter}`,
            full: "",
        });
    }
    return tuples;
}
function monthToQuarter(month) {
    return Math.max(1, Math.floor(month / 3));
}
function parseVolumeDate(raw) {
    const parts = raw.split("-");
    if (parts.length !== 3) {
        throw new Error(`Expected DD-MM-YYYY volume date, got: ${raw}`);
    }
    const day = Number(parts[0]);
    const month = Number(parts[1]);
    const ytdYear = Number(parts[2]);
    if (![day, month, ytdYear].every(Number.isFinite)) {
        throw new Error(`Invalid volume date: ${raw}`);
    }
    const utcMs = Date.UTC(ytdYear, month - 1, day);
    const cal = new Date(utcMs);
    if (cal.getUTCFullYear() !== ytdYear ||
        cal.getUTCMonth() !== month - 1 ||
        cal.getUTCDate() !== day) {
        throw new Error(`Invalid volume date: ${raw}`);
    }
    return { ytdYear, month };
}
exports.pcTimeFrameHandler = new PcTimeFramePresetHandler();
//# sourceMappingURL=pc-time-frame-quarters.handler.js.map
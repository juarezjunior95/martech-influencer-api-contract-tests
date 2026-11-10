"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeFrameHandler = void 0;
const dataset_repository_factory_1 = require("../../../factories/dataset-repository.factory");
const kpi_group_time_frame_config_1 = __importDefault(require("../../config-groups/kpi-group-time-frame.config"));
const kpi_group_handler_1 = require("../kpi-group/kpi-group.handler");
const kpi_group_types_1 = require("../kpi-group/kpi-group.types");
const MIN_PRIOR_YTD_YEAR = 2023;
class TimeFramePresetHandler {
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
        const cfg = preset["time-frame"];
        const override = cfg?.volumeRefreshDate;
        let volume = typeof override === "string" && override.length > 0 ? override : "";
        if (!volume) {
            const queried = kpi_group_handler_1.kpiGroupHandler.handle({}, datasets);
            const fromQuery = typeof queried.volume === "string" && queried.volume.length > 0
                ? queried.volume
                : "";
            volume = fromQuery || kpi_group_time_frame_config_1.default.config.volume;
        }
        if (typeof volume !== "string" || volume.length === 0) {
            throw new Error("time-frame requires a non-empty volume refresh date (kpi_group row `volume` / `time_frame`, optional preset override, or kpi_group_time_frame.config.volume as DD-MM-YYYY)");
        }
        return {
            ...preset,
            "time-frame": this.buildFromVolumeRefreshDate(volume),
        };
    }
    buildFromVolumeRefreshDate(volumeRefreshDate) {
        const { ytdYear, monthPadded } = parseVolumeDate(volumeRefreshDate);
        const minYtd = Math.max(ytdYear - 1, MIN_PRIOR_YTD_YEAR);
        const values = {
            ini: dateToYMDFormat(minYtd, "01"),
            end: dateToYMDFormat(ytdYear, monthPadded),
        };
        const defaultBounds = {
            ini: dateToYMDFormat(ytdYear, "01"),
            end: dateToYMDFormat(ytdYear, monthPadded),
        };
        return {
            values,
            default: defaultBounds,
            enabled: true,
        };
    }
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
    return {
        ytdYear,
        monthPadded: String(month).padStart(2, "0"),
    };
}
function dateToYMDFormat(year, month) {
    const mm = month.padStart(2, "0");
    return `${year}-${mm}-01`;
}
exports.timeFrameHandler = new TimeFramePresetHandler();
//# sourceMappingURL=time-frame.handler.js.map
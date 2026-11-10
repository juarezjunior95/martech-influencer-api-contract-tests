"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ytdMonthHandler = void 0;
const ALL_YTD_MONTHS = [
    { value: "YTD", label: "YTD", full: "Year to Date (YTD)" },
    { value: "Month", label: "MTD", full: "Month to Date (MTD)" },
];
class YtdMonthPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const values = ALL_YTD_MONTHS.map((tuple) => ({ ...tuple }));
        const ytdMonthValue = {
            values,
            default: { ...values[0] },
            enabled: true,
        };
        return { ...preset, "ytd-month": ytdMonthValue };
    }
}
exports.ytdMonthHandler = new YtdMonthPresetHandler();
//# sourceMappingURL=ytd-month.handler.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAxisBreakCommand = void 0;
const parseDate_1 = require("../parseDate");
const AXIS_BREAK_VALUE = "axis_break";
const AXIS_BREAK_YEAR = 2020;
const AXIS_BREAK_QUARTER = 2;
class MarkAxisBreakCommand {
    constructor() {
        this.name = "markAxisBreak";
    }
    execute(value, dateString) {
        const date = (0, parseDate_1.parseDate)(dateString);
        if (!date)
            return value;
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const quarter = Math.floor((month - 1) / 3) + 1;
        if (year === AXIS_BREAK_YEAR && quarter === AXIS_BREAK_QUARTER) {
            return AXIS_BREAK_VALUE;
        }
        return value;
    }
}
exports.MarkAxisBreakCommand = MarkAxisBreakCommand;
//# sourceMappingURL=MarkAxisBreakCommand.js.map
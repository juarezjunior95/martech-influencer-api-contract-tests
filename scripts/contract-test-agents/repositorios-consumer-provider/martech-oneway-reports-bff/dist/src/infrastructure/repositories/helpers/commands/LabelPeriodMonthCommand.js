"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelPeriodMonthCommand = void 0;
class LabelPeriodMonthCommand {
    constructor() {
        this.name = "labelPeriodMonth";
    }
    execute(year, month) {
        const y = Number(year);
        const m = Number(month);
        if (Number.isNaN(y) ||
            Number.isNaN(m) ||
            !Number.isInteger(y) ||
            !Number.isInteger(m) ||
            m < 1 ||
            m > 12 ||
            y < 1) {
            return "";
        }
        return `${LabelPeriodMonthCommand.MONTHS[m - 1]}'${y.toString().slice(-2)}`;
    }
}
exports.LabelPeriodMonthCommand = LabelPeriodMonthCommand;
LabelPeriodMonthCommand.MONTHS = [
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
//# sourceMappingURL=LabelPeriodMonthCommand.js.map
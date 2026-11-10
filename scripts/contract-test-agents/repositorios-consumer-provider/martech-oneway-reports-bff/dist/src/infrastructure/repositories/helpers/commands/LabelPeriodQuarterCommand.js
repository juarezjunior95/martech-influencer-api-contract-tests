"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelPeriodQuarterCommand = void 0;
class LabelPeriodQuarterCommand {
    constructor() {
        this.name = "labelPeriodQuarter";
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
        const quarter = Math.ceil(m / 3);
        const yearShort = y.toString().slice(-2);
        return `Q${quarter}'${yearShort}`;
    }
}
exports.LabelPeriodQuarterCommand = LabelPeriodQuarterCommand;
//# sourceMappingURL=LabelPeriodQuarterCommand.js.map
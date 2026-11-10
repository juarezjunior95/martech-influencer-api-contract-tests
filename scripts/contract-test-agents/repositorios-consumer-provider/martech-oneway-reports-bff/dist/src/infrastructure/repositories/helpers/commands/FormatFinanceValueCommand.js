"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatFinanceValueCommand = void 0;
class FormatFinanceValueCommand {
    constructor() {
        this.name = "formatFinanceValue";
    }
    execute(value) {
        if (typeof value !== "number" || isNaN(value)) {
            return "-";
        }
        const abs = value >= 0 ? value : -value;
        if (abs >= 1e9) {
            return this.formatNumber(value / 1e9) + "B";
        }
        if (abs >= 1e6) {
            return this.formatNumber(value / 1e6) + "M";
        }
        if (abs >= 1000) {
            return this.formatNumber(value / 1000) + "K";
        }
        return this.formatNumber(value);
    }
    formatNumber(n) {
        return Intl.NumberFormat("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
            useGrouping: true,
        }).format(n);
    }
}
exports.FormatFinanceValueCommand = FormatFinanceValueCommand;
//# sourceMappingURL=FormatFinanceValueCommand.js.map
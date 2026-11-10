"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatMonthLabelTitleCommand = void 0;
class FormatMonthLabelTitleCommand {
    constructor() {
        this.name = "formatMonthLabelTitle";
    }
    execute(monthLabel) {
        if (monthLabel === null || monthLabel === undefined) {
            return "";
        }
        const label = String(monthLabel).trim();
        if (!label) {
            return "";
        }
        return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
    }
}
exports.FormatMonthLabelTitleCommand = FormatMonthLabelTitleCommand;
//# sourceMappingURL=FormatMonthLabelTitleCommand.js.map
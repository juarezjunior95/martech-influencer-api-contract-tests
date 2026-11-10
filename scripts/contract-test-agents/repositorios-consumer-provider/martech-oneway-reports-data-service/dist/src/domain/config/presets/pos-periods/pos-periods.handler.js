"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posPeriodsHandler = exports.POS_PERIODS = void 0;
exports.POS_PERIODS = [
    { value: "QTD", label: "Quarter", full: "" },
    { value: "R12M", label: "R12M", full: "" },
];
class PosPeriodsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const values = exports.POS_PERIODS.map((row) => ({ ...row }));
        const posPeriodsValue = {
            values,
            default: { ...values[0] },
            enabled: true,
        };
        return { ...preset, "pos-periods": posPeriodsValue };
    }
}
exports.posPeriodsHandler = new PosPeriodsPresetHandler();
//# sourceMappingURL=pos-periods.handler.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.periodsHandler = void 0;
const ALL_PERIODS = [
    { value: "QTD", label: "QTD", full: "Quarter To Date (QTD)" },
    { value: "R12M", label: "R12M", full: "Rolling 12 Months (R12M)" },
    { value: "YTD", label: "YTD", full: "Year To Date (YTD)" },
];
const DEFAULT_PERIODS = new Set(["QTD", "R12M"]);
const SINGLE_SCOPES = {
    YTD: new Set(["YTD"]),
    QTD: new Set(["QTD"]),
    R12M: new Set(["R12M"]),
};
class PeriodsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const periodsConfig = (preset.periods ?? {});
        const values = this.buildValues(periodsConfig.scope);
        const noDefault = periodsConfig.noDefault === true;
        const defaultTuple = noDefault || values.length === 0 ? {} : { ...values[0] };
        const periodsValue = {
            values,
            default: defaultTuple,
            enabled: true,
        };
        return { ...preset, periods: periodsValue };
    }
    buildValues(scope) {
        const allowed = this.resolveScope(scope);
        return ALL_PERIODS.filter((tuple) => allowed.has(tuple.value)).map((tuple) => ({ ...tuple }));
    }
    resolveScope(scope) {
        if (!scope) {
            return DEFAULT_PERIODS;
        }
        return SINGLE_SCOPES[scope.toUpperCase()] ?? DEFAULT_PERIODS;
    }
}
exports.periodsHandler = new PeriodsPresetHandler();
//# sourceMappingURL=periods.handler.js.map
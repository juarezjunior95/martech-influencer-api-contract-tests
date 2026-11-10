"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioHandler = void 0;
const ALL_PORTFOLIO = {
    value: "ALL",
    label: "All",
    full: "",
};
const NO_DEFAULT_PORTFOLIO = {
    value: "",
    label: "",
    full: "",
};
const BASE_PORTFOLIOS = [
    { value: "Megabrands", label: "Megabrands", full: "" },
    { value: "Expansion", label: "Expansion", full: "" },
    { value: "Sustain", label: "Sustain", full: "" },
    { value: "Tail", label: "Tail", full: "" },
    { value: "NAB", label: "Non-Alcohol Beer", full: "" },
];
class PortfolioPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const portfolioConfig = (preset.portfolio ?? {});
        const includeAll = this.toBool(portfolioConfig.includeAll);
        const ignoreNab = this.toBool(portfolioConfig.ignoreNab);
        const noDefault = this.toBool(portfolioConfig.noDefault);
        const values = this.buildValues(includeAll, ignoreNab);
        const defaultTuple = noDefault || values.length === 0
            ? { ...NO_DEFAULT_PORTFOLIO }
            : { ...values[0] };
        const portfolioValue = {
            values,
            default: defaultTuple,
            enabled: true,
        };
        return { ...preset, portfolio: portfolioValue };
    }
    buildValues(includeAll, ignoreNab) {
        let rows = BASE_PORTFOLIOS.map((row) => ({ ...row }));
        if (includeAll) {
            rows = [{ ...ALL_PORTFOLIO }, ...rows];
        }
        if (ignoreNab) {
            rows = rows.filter((row) => row.value !== "NAB");
        }
        return rows;
    }
    toBool(value) {
        if (typeof value === "boolean") {
            return value;
        }
        if (typeof value === "string") {
            return value.toLowerCase() === "true";
        }
        return false;
    }
}
exports.portfolioHandler = new PortfolioPresetHandler();
//# sourceMappingURL=portfolio.handler.js.map
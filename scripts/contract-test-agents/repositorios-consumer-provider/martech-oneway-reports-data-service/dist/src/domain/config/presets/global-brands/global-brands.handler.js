"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalBrandsHandler = void 0;
const NO_DEFAULT_TUPLE = {
    value: "",
    label: "",
    full: "",
};
const ABI_GLOBAL_BRANDS = [
    { value: "All Global Brands", label: "All Global Brands", full: "" },
    { value: "Michelob Ultra", label: "Michelob Ultra", full: "" },
    { value: "Budweiser", label: "Budweiser", full: "" },
    { value: "Corona", label: "Corona", full: "" },
    { value: "Stella Artois", label: "Stella Artois", full: "" },
];
const COMPETITOR_GLOBAL_BRANDS = [
    { value: "Heineken", label: "Heineken", full: "" },
];
class GlobalBrandsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const cfg = (preset["global-brands"] ?? {});
        const noDefault = this.toBool(cfg.noDefault);
        const groups = this.buildGroups();
        const firstTuple = this.firstTuple(groups);
        const defaultTuple = noDefault || !firstTuple ? { ...NO_DEFAULT_TUPLE } : { ...firstTuple };
        const globalBrandsValue = {
            values: groups,
            default: defaultTuple,
            enabled: true,
        };
        return { ...preset, "global-brands": globalBrandsValue };
    }
    buildGroups() {
        return [
            {
                group: "",
                values: ABI_GLOBAL_BRANDS.map((row) => ({ ...row })),
            },
            {
                group: "Competitor",
                values: COMPETITOR_GLOBAL_BRANDS.map((row) => ({ ...row })),
            },
        ];
    }
    firstTuple(groups) {
        for (const block of groups) {
            const head = block.values[0];
            if (head) {
                return head;
            }
        }
        return undefined;
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
exports.globalBrandsHandler = new GlobalBrandsPresetHandler();
//# sourceMappingURL=global-brands.handler.js.map
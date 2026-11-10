"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distributionsHandler = void 0;
const ALL_DISTRIBUTIONS = [
    { value: "total", label: "Total", full: "" },
    { value: "megabrand", label: "Megabrands", full: "" },
];
class DistributionsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const values = ALL_DISTRIBUTIONS.map((tuple) => ({ ...tuple }));
        const distributionsValue = {
            values,
            default: { ...values[0] },
            enabled: true,
        };
        return { ...preset, distributions: distributionsValue };
    }
}
exports.distributionsHandler = new DistributionsPresetHandler();
//# sourceMappingURL=distributions.handler.js.map
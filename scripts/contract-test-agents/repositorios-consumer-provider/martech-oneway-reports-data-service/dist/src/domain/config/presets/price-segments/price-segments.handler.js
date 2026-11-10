"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceSegmentsHandler = void 0;
const PRICE_SEGMENTS = [
    { value: "core_co", label: "Core Co" },
    { value: "premium_co", label: "Premium Co" },
];
const UNGROUPED_LABEL = "Ungrouped";
class PriceSegmentsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const groups = [
            {
                group: UNGROUPED_LABEL,
                values: PRICE_SEGMENTS.map((row) => ({ ...row })),
            },
        ];
        const priceSegmentsValue = {
            values: groups,
            default: {},
            enabled: true,
        };
        return { ...preset, "price-segments": priceSegmentsValue };
    }
}
exports.priceSegmentsHandler = new PriceSegmentsPresetHandler();
//# sourceMappingURL=price-segments.handler.js.map
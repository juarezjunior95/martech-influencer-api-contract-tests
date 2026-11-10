"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEVEL_COMP = exports.BRAND_COMP_DATASET_QUERY = exports.BRAND_COMP_DATASET_ID = void 0;
exports.isBrandCompFilterItem = isBrandCompFilterItem;
exports.BRAND_COMP_DATASET_ID = "brand-subbrand-comp";
exports.BRAND_COMP_DATASET_QUERY = "presets/brand/brand-subbrand-comp";
exports.LEVEL_COMP = "COMP";
function isBrandCompFilterItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        value.type === "brands-comp");
}
//# sourceMappingURL=brands-comp.types.js.map
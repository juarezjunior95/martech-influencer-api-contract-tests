"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRAND_DATASET_QUERY = exports.BRAND_DATASET_ID = void 0;
exports.isBrandFilterItem = isBrandFilterItem;
exports.BRAND_DATASET_ID = "brand-subbrands";
exports.BRAND_DATASET_QUERY = "presets/brand/brand-subbrands";
function isBrandFilterItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        value.type === "brand");
}
//# sourceMappingURL=brands.types.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEVEL_ABI = exports.BRAND_ABI_DATASET_QUERY = exports.BRAND_ABI_DATASET_ID = void 0;
exports.isBrandAbiFilterItem = isBrandAbiFilterItem;
exports.BRAND_ABI_DATASET_ID = "brand-subbrand-comp";
exports.BRAND_ABI_DATASET_QUERY = "presets/brand/brand-subbrand-comp";
exports.LEVEL_ABI = "ABI";
function isBrandAbiFilterItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        value.type === "brands-abi");
}
//# sourceMappingURL=brands-abi.types.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStaticDimensionConfig = buildStaticDimensionConfig;
function buildStaticDimensionConfig(options) {
    if (!options?.length) {
        return undefined;
    }
    return {
        values: [...options],
        default: options[0],
    };
}
//# sourceMappingURL=performance-tool.dimensions.js.map
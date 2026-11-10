"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDirection = formatDirection;
function formatDirection(value, params = {}) {
    if (value === null || value === undefined) {
        return "";
    }
    const { up = "up", down = "down", center = "center", invert = false, usingCenter = false, positiveZero = false, } = params;
    if (usingCenter && (value === 0 || value === "")) {
        return center;
    }
    if (typeof value === "number") {
        let condition = positiveZero ? value >= 0 : value > 0;
        return getDirectionLabel(condition, invert, { up, down });
    }
    const valueUpper = String(value).toUpperCase();
    const isPositive = valueUpper === "G";
    const isNegative = valueUpper === "R";
    if (isPositive || isNegative) {
        return getDirectionLabel(isPositive, invert, { up, down });
    }
    return "";
}
function getDirectionLabel(isPositive, invert, params) {
    const shouldUseUp = invert ? !isPositive : isPositive;
    return shouldUseUp ? params.up : params.down;
}
//# sourceMappingURL=direction.utils.js.map
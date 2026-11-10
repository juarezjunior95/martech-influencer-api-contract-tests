"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOURCE_GLOBAL_BRANDS = exports.VALUE_ALL = void 0;
exports.getGlobalDefault = getGlobalDefault;
exports.getGlRules = getGlRules;
exports.isGlClassificationAvailable = isGlClassificationAvailable;
const performance_tool_constants_1 = require("./performance-tool.constants");
exports.VALUE_ALL = "All";
exports.SOURCE_GLOBAL_BRANDS = "@global_brands";
const KPI_DEFAULTS = {
    [performance_tool_constants_1.POWER_KPI]: {
        [performance_tool_constants_1.ALL_BRANDS]: exports.VALUE_ALL,
        [performance_tool_constants_1.PORTFOLIO]: exports.VALUE_ALL,
    },
    [performance_tool_constants_1.VOLUME_KPI]: {
        [performance_tool_constants_1.ALL_BRANDS]: exports.SOURCE_GLOBAL_BRANDS,
        [performance_tool_constants_1.PORTFOLIO]: exports.VALUE_ALL,
        [performance_tool_constants_1.BEER_PRICE_SEGMENT]: exports.VALUE_ALL,
        [performance_tool_constants_1.GLOBAL_BRANDS]: exports.SOURCE_GLOBAL_BRANDS,
    },
    [performance_tool_constants_1.MARKET_SHARE_KPI]: {
        [performance_tool_constants_1.ALL_BRANDS]: exports.VALUE_ALL,
    },
    [performance_tool_constants_1.MARKET_SHARE_OFFICIAL_KPI]: {
        [performance_tool_constants_1.ALL_BRANDS]: exports.VALUE_ALL,
        [performance_tool_constants_1.PORTFOLIO]: exports.VALUE_ALL,
        [performance_tool_constants_1.BEER_PRICE_SEGMENT]: exports.VALUE_ALL,
        [performance_tool_constants_1.GLOBAL_BRANDS]: exports.SOURCE_GLOBAL_BRANDS,
    },
};
const GL_RULES = {
    [performance_tool_constants_1.LEAD_PREMIUM]: {
        [performance_tool_constants_1.ALL_BRANDS]: {
            global_default: exports.SOURCE_GLOBAL_BRANDS,
            eur_default: exports.VALUE_ALL,
        },
        [performance_tool_constants_1.PORTFOLIO]: { global_default: exports.VALUE_ALL },
        [performance_tool_constants_1.BEER_PRICE_SEGMENT]: { global_default: exports.VALUE_ALL },
        [performance_tool_constants_1.GLOBAL_BRANDS]: {},
    },
    [performance_tool_constants_1.SUPERIOR_CORE]: {
        [performance_tool_constants_1.ALL_BRANDS]: { global_default: exports.VALUE_ALL, eur_default: exports.VALUE_ALL },
        [performance_tool_constants_1.PORTFOLIO]: { global_default: exports.VALUE_ALL },
        [performance_tool_constants_1.BEER_PRICE_SEGMENT]: { global_default: exports.VALUE_ALL },
    },
    [performance_tool_constants_1.BALANCED_CHOICES]: {
        [performance_tool_constants_1.ALL_BRANDS]: { global_default: exports.VALUE_ALL, eur_default: exports.VALUE_ALL },
        [performance_tool_constants_1.PORTFOLIO]: { global_default: exports.VALUE_ALL },
        [performance_tool_constants_1.BEER_PRICE_SEGMENT]: { global_default: exports.VALUE_ALL },
    },
    [performance_tool_constants_1.BEYOND_BEER]: {
        [performance_tool_constants_1.ALL_BRANDS]: { global_default: exports.VALUE_ALL, eur_default: exports.VALUE_ALL },
        [performance_tool_constants_1.PORTFOLIO]: { global_default: exports.VALUE_ALL },
    },
};
function getGlobalDefault(kpi, classification, gl) {
    if (gl !== null && kpi === performance_tool_constants_1.VOLUME_KPI) {
        const rule = GL_RULES[gl]?.[classification];
        if (rule && "global_default" in rule) {
            return rule.global_default ?? null;
        }
        return null;
    }
    return KPI_DEFAULTS[kpi]?.[classification] ?? null;
}
function getGlRules(gl) {
    return GL_RULES[gl] ?? {};
}
function isGlClassificationAvailable(gl, classification) {
    return classification in (GL_RULES[gl] ?? {});
}
//# sourceMappingURL=performance-tool.ui-rules.js.map
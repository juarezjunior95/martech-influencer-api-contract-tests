"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER = exports.POS_TOOL_DRILLDOWN_GROWTH_LEVERS_ORDER = exports.POS_TOOL_DRILLDOWN_GROWTH_LEVERS = exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB = exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_BEYOND_BEER = exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_PREMIUM_CO = exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_CORE_CO = exports.POS_TOOL_DRILLDOWN_PORTFOLIO_ORDER = exports.POS_TOOL_DRILLDOWN_PORTFOLIO = exports.POS_TOOL_DRILLDOWN_PORTFOLIO_TAIL = exports.POS_TOOL_DRILLDOWN_PORTFOLIO_SUSTAIN = exports.POS_TOOL_DRILLDOWN_PORTFOLIO_EXPANSION = exports.POS_TOOL_DRILLDOWN_PORTFOLIO_MEGABRAND = void 0;
exports.normalizePosToolDrilldownPortfolio = normalizePosToolDrilldownPortfolio;
exports.normalizePosToolDrilldownGrowthLever = normalizePosToolDrilldownGrowthLever;
exports.resolvePosToolDrilldownCategoryLabel = resolvePosToolDrilldownCategoryLabel;
exports.normalizePosToolDrilldownCategoryValue = normalizePosToolDrilldownCategoryValue;
exports.resolvePosToolDrilldownCategoryDedupKey = resolvePosToolDrilldownCategoryDedupKey;
exports.POS_TOOL_DRILLDOWN_PORTFOLIO_MEGABRAND = "Megabrands";
exports.POS_TOOL_DRILLDOWN_PORTFOLIO_EXPANSION = "Expansion";
exports.POS_TOOL_DRILLDOWN_PORTFOLIO_SUSTAIN = "Sustain";
exports.POS_TOOL_DRILLDOWN_PORTFOLIO_TAIL = "Tail";
exports.POS_TOOL_DRILLDOWN_PORTFOLIO = [
    {
        value: exports.POS_TOOL_DRILLDOWN_PORTFOLIO_MEGABRAND,
        label: exports.POS_TOOL_DRILLDOWN_PORTFOLIO_MEGABRAND,
        full: "",
    },
    {
        value: exports.POS_TOOL_DRILLDOWN_PORTFOLIO_EXPANSION,
        label: exports.POS_TOOL_DRILLDOWN_PORTFOLIO_EXPANSION,
        full: "",
    },
    {
        value: exports.POS_TOOL_DRILLDOWN_PORTFOLIO_SUSTAIN,
        label: exports.POS_TOOL_DRILLDOWN_PORTFOLIO_SUSTAIN,
        full: "",
    },
    {
        value: exports.POS_TOOL_DRILLDOWN_PORTFOLIO_TAIL,
        label: exports.POS_TOOL_DRILLDOWN_PORTFOLIO_TAIL,
        full: "",
    },
];
exports.POS_TOOL_DRILLDOWN_PORTFOLIO_ORDER = exports.POS_TOOL_DRILLDOWN_PORTFOLIO.map((row) => row.value);
const PORTFOLIO_ALIASES = {
    "mega brand": exports.POS_TOOL_DRILLDOWN_PORTFOLIO_MEGABRAND,
    megabrand: exports.POS_TOOL_DRILLDOWN_PORTFOLIO_MEGABRAND,
    megabrands: exports.POS_TOOL_DRILLDOWN_PORTFOLIO_MEGABRAND,
    "expansion brand": exports.POS_TOOL_DRILLDOWN_PORTFOLIO_EXPANSION,
    expansion: exports.POS_TOOL_DRILLDOWN_PORTFOLIO_EXPANSION,
    "sustain brand": exports.POS_TOOL_DRILLDOWN_PORTFOLIO_SUSTAIN,
    sustain: exports.POS_TOOL_DRILLDOWN_PORTFOLIO_SUSTAIN,
    "tail brand": exports.POS_TOOL_DRILLDOWN_PORTFOLIO_TAIL,
    tail: exports.POS_TOOL_DRILLDOWN_PORTFOLIO_TAIL,
};
function normalizePosToolDrilldownPortfolio(value) {
    const trimmed = value.trim();
    if (!trimmed) {
        return "";
    }
    const canonical = PORTFOLIO_ALIASES[trimmed.toLowerCase()];
    if (canonical) {
        return canonical;
    }
    return trimmed;
}
exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_CORE_CO = "Core Co";
exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_PREMIUM_CO = "Premium Co";
exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_BEYOND_BEER = "Beyond Beer";
exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB = "NAB";
exports.POS_TOOL_DRILLDOWN_GROWTH_LEVERS = [
    {
        value: exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_CORE_CO,
        label: exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_CORE_CO,
        full: exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_CORE_CO,
    },
    {
        value: exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_PREMIUM_CO,
        label: exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_PREMIUM_CO,
        full: exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_PREMIUM_CO,
    },
    {
        value: exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_BEYOND_BEER,
        label: exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_BEYOND_BEER,
        full: exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_BEYOND_BEER,
    },
    {
        value: exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB,
        label: exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB,
        full: "Non-Alcoholic Beer",
    },
];
exports.POS_TOOL_DRILLDOWN_GROWTH_LEVERS_ORDER = exports.POS_TOOL_DRILLDOWN_GROWTH_LEVERS.map((row) => row.value);
const GROWTH_LEVER_ALIASES = {
    "superior core": exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_CORE_CO,
    "core co": exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_CORE_CO,
    "lead premium": exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_PREMIUM_CO,
    "premium co": exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_PREMIUM_CO,
    "beyond beer": exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_BEYOND_BEER,
    "balanced choices": exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB,
    nab: exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB,
    "non-alcoholic beer": exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB,
    "non alcohol beer": exports.POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB,
};
function normalizePosToolDrilldownGrowthLever(value) {
    const trimmed = value.trim();
    if (!trimmed) {
        return "";
    }
    const canonical = GROWTH_LEVER_ALIASES[trimmed.toLowerCase()];
    if (canonical) {
        return canonical;
    }
    return trimmed;
}
exports.POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER = "Beer + Beyond Beer";
const CATEGORY_LABEL_ALIASES = {
    "beer + bb": exports.POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER,
    "beer + byb": exports.POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER,
    "beer + beyond beer": exports.POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER,
};
function resolvePosToolDrilldownCategoryLabel(value) {
    const trimmed = value.trim();
    if (!trimmed) {
        return "";
    }
    const alias = CATEGORY_LABEL_ALIASES[trimmed.toLowerCase()];
    if (alias) {
        return alias;
    }
    return trimmed;
}
function normalizePosToolDrilldownCategoryValue(value) {
    return resolvePosToolDrilldownCategoryLabel(value);
}
function resolvePosToolDrilldownCategoryDedupKey(value) {
    const trimmed = value.trim();
    if (!trimmed) {
        return "";
    }
    const alias = CATEGORY_LABEL_ALIASES[trimmed.toLowerCase()];
    if (alias) {
        return "beer + bb";
    }
    return trimmed.toLowerCase();
}
//# sourceMappingURL=pos-tool-drilldown.constants.js.map
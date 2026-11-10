"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALUE_CREATION_GEO_MAPPING = exports.VALUE_CREATION_GEO_ABI = exports.VALUE_CREATION_GEO_EUR = exports.VALUE_CREATION_GROWTH_LEVERS_TEMPLATE = exports.VALUE_CREATION_BEYOND_BEER = exports.VALUE_CREATION_BALANCED_CHOICES = exports.VALUE_CREATION_LEAD_PREMIUN = exports.VALUE_CREATION_SUPERIOR_CORE = void 0;
exports.cloneGrowthLeverTemplate = cloneGrowthLeverTemplate;
exports.VALUE_CREATION_SUPERIOR_CORE = "Superior Core";
exports.VALUE_CREATION_LEAD_PREMIUN = "Lead Premium";
exports.VALUE_CREATION_BALANCED_CHOICES = "Balanced Choices";
exports.VALUE_CREATION_BEYOND_BEER = "Beyond Beer";
exports.VALUE_CREATION_GROWTH_LEVERS_TEMPLATE = [
    {
        label: exports.VALUE_CREATION_SUPERIOR_CORE,
        value: exports.VALUE_CREATION_SUPERIOR_CORE,
        disabled: true,
    },
    {
        label: exports.VALUE_CREATION_LEAD_PREMIUN,
        value: exports.VALUE_CREATION_LEAD_PREMIUN,
        disabled: true,
    },
    {
        label: exports.VALUE_CREATION_BALANCED_CHOICES,
        value: exports.VALUE_CREATION_BALANCED_CHOICES,
        disabled: true,
    },
    {
        label: exports.VALUE_CREATION_BEYOND_BEER,
        value: exports.VALUE_CREATION_BEYOND_BEER,
        disabled: true,
    },
];
exports.VALUE_CREATION_GEO_EUR = "EUR";
exports.VALUE_CREATION_GEO_ABI = "ABI";
exports.VALUE_CREATION_GEO_MAPPING = {
    [exports.VALUE_CREATION_GEO_ABI]: {
        [exports.VALUE_CREATION_GEO_ABI]: {
            label: "All",
            quick_filter_label: "Global",
            zone: exports.VALUE_CREATION_GEO_ABI,
            value: exports.VALUE_CREATION_GEO_ABI,
            growth_levers: exports.VALUE_CREATION_GROWTH_LEVERS_TEMPLATE.map((g) => ({
                ...g,
            })),
        },
    },
    [exports.VALUE_CREATION_GEO_EUR]: {
        [exports.VALUE_CREATION_GEO_ABI]: {
            label: "All",
            quick_filter_label: "Europe",
            zone: exports.VALUE_CREATION_GEO_EUR,
            value: exports.VALUE_CREATION_GEO_ABI,
            growth_levers: exports.VALUE_CREATION_GROWTH_LEVERS_TEMPLATE.map((g) => ({
                ...g,
            })),
        },
    },
};
function cloneGrowthLeverTemplate() {
    return exports.VALUE_CREATION_GROWTH_LEVERS_TEMPLATE.map((g) => ({ ...g }));
}
//# sourceMappingURL=value-creation.defaults.js.map
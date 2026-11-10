"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_VALIDATION_PAGES = void 0;
exports.pageAllowsAllOptions = pageAllowsAllOptions;
exports.NO_VALIDATION_PAGES = [
    "category_home",
    "category_category-health",
    "category_pos-results",
    "category_pos-results-export",
    "brand-power-results",
    "category_pos-tool-overview",
    "category_pos-tool-drilldown",
    "brand-power-results-export",
];
function pageAllowsAllOptions(page) {
    return exports.NO_VALIDATION_PAGES.includes(page ?? "");
}
//# sourceMappingURL=no-validation-pages.js.map
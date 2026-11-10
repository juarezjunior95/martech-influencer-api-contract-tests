"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRAND_POWER_RESULTS_PERFORMANCE_BREAKDOWN_FUNCTION = void 0;
exports.createBrandPowerResultsProcedureFetchDataConfig = createBrandPowerResultsProcedureFetchDataConfig;
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
exports.BRAND_POWER_RESULTS_PERFORMANCE_BREAKDOWN_FUNCTION = "3_portfolio_brand_power-book_overview_breakdown";
function createBrandPowerResultsProcedureFetchDataConfig(filters, staticParams) {
    return (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
        functionName: exports.BRAND_POWER_RESULTS_PERFORMANCE_BREAKDOWN_FUNCTION,
        parameters: filters.map((filter) => filter.name),
        staticParams,
    });
}
//# sourceMappingURL=performance-breakdown-and-summary-power.datasource.js.map
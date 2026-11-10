"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_SP_NAME = exports.INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const portfolio_big_numbers_handler_1 = require("../../../../../handlers/innovation/innovation-hub/overview/portfolio-big-numbers.handler");
exports.INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_DATASET_ID = "portfolio-big-numbers";
exports.INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_SP_NAME = "4_innovation_innovation-performance_overview_innovation-portfolio-big-numbers";
const filters = [
    { name: "country", required: true },
    { name: "dt_end", required: true },
];
const config = {
    version: "1.0.0",
    entityClass: kpi_entity_1.KpiEntity,
    datasets: [
        {
            id: exports.INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: exports.INNOVATION_HUB_OVERVIEW_PORTFOLIO_BIG_NUMBERS_SP_NAME,
                parameters: filters.map((f) => f.name),
                staticParams: { kpi: "all" },
            }),
        },
    ],
    handler: portfolio_big_numbers_handler_1.portfolioBigNumbersHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=portfolio-big-numbers.datasource.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../entities/kpi.entity");
const filters = [
    {
        name: "country",
        required: true,
    },
    {
        name: "timeperiod",
        required: false,
    },
];
const config = {
    entityClass: kpi_entity_1.KpiEntity,
    datasets: [
        {
            id: "portfolio-strategy",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "3_portfolio_brand_home_portfolio-strategy_hybrid-version",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=portfolio-strategy.datasource.js.map
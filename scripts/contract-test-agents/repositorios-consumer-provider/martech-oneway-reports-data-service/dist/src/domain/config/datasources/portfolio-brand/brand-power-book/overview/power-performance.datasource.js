"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const filters = [
    {
        name: "dt_end",
        required: true,
    },
    {
        name: "visual",
        required: true,
    },
    {
        name: "period_type",
        required: false,
    },
    {
        name: "viewtype",
        required: false,
    },
    {
        name: "page_filter",
        required: false,
    },
    {
        name: "country",
        required: false,
    },
];
const config = {
    filters,
    datasets: [
        {
            id: "power_performance",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "3_portfolio_brand_power-book_overview_performance-breakdown",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
};
exports.default = config;
//# sourceMappingURL=power-performance.datasource.js.map
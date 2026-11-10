"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const filters = [
    {
        name: "dt_end",
        required: true,
    },
    {
        name: "page_filter",
        required: true,
    },
    {
        name: "period_type",
        required: false,
    },
];
const config = {
    datasets: [
        {
            id: "countries_contribution",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "3_portfolio_brand_power-book_overview_waterfall",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters,
};
exports.default = config;
//# sourceMappingURL=countries-contribution.datasource.js.map
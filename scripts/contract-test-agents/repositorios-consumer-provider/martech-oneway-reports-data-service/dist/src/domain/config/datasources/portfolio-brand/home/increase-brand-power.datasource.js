"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kpi_entity_1 = require("../../../../entities/kpi.entity");
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const filters = [
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
        required: true,
    },
    {
        name: "zone",
        required: false,
    },
    {
        name: "timeframe",
        required: false,
    },
];
const config = {
    datasets: [
        {
            id: "increase-brand-power",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "3_portfolio_brand_home_increase-brand-power_trend",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters,
};
exports.default = config;
//# sourceMappingURL=increase-brand-power.datasource.js.map
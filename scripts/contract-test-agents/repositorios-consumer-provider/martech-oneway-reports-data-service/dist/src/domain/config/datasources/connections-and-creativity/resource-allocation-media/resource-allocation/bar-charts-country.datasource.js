"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const filters = [
    {
        name: "viewtype",
        required: true,
    },
    {
        name: "kpi_filter",
        required: true,
    },
    {
        name: "country",
        required: true,
    },
    {
        name: "dt_ini",
        required: true,
    },
    {
        name: "dt_end",
        required: true,
    },
];
const config = {
    datasets: [
        {
            id: "bar-charts-country",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "5_connections_creativity_media-campaign_resource-allocation_marketing-package-comparison-country",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters,
};
exports.default = config;
//# sourceMappingURL=bar-charts-country.datasource.js.map
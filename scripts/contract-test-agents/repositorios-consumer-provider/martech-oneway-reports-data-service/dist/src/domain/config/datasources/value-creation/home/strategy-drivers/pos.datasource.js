"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const filters = [
    {
        name: "country",
    },
    {
        name: "dt_end",
    },
    {
        name: "viewtype",
    },
    {
        name: "period",
    },
    {
        name: "growth_lever",
    },
];
const config = {
    datasets: [
        {
            id: "strategy-drivers-pos",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "7_value_creation_home_growth-levers_strategy-drivers",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters,
};
exports.default = config;
//# sourceMappingURL=pos.datasource.js.map
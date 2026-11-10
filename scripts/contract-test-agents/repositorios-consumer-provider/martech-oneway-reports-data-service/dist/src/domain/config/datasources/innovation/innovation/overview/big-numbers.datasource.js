"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const big_numbers_handler_1 = require("../../../../../handlers/innovation/innovation/overview/big-numbers.handler");
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const filters = [
    {
        name: "viewtype",
        required: true,
    },
    {
        name: "country",
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
            id: "big-numbers",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "4_innovation_innovation-performance_overview_big-numbers",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    handler: big_numbers_handler_1.bigNumbersHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=big-numbers.datasource.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const filters = [
    {
        name: "viewtype",
    },
    {
        name: "country",
    },
    {
        name: "dt_end",
    },
    {
        name: "kpi",
    },
];
const config = {
    datasets: [
        {
            id: "yoy-growth",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "4_innovation_innovation-performance_performance-&-breakdown_yoy-growth",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters,
};
exports.default = config;
//# sourceMappingURL=yoy-growth.datasource.js.map
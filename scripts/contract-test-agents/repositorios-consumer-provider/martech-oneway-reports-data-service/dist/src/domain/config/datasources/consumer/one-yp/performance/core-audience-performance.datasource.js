"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "one-yp-core-audience-performance",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "consumer/one-yp/performance/core-audience-performance",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "dt_end",
            required: true,
        },
        {
            name: "brand",
            required: true,
        },
        {
            name: "country",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=core-audience-performance.datasource.js.map
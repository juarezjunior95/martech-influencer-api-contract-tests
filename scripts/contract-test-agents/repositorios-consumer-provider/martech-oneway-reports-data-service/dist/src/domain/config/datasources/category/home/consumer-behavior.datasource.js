"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "consumer-behavior",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "category/home/consumer-behavior",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "country",
            required: true,
        },
        {
            name: "viewtype",
            required: true,
        },
        {
            name: "timeperiod",
            required: true,
        },
        {
            name: "environment",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=consumer-behavior.datasource.js.map
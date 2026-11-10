"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../entities/kpi.entity");
const config = {
    version: "1.0.0",
    entityClass: kpi_entity_1.KpiEntity,
    datasets: [
        {
            id: "card-chart",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "trade-execution/home/home",
            }),
        },
    ],
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
            name: "scope",
            required: true,
        },
        {
            name: "pageview",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=home.datasource.js.map
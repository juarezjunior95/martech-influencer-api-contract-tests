"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "category-health-drill-down-big-numbers",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "category/category-health/drill-down/big-numbers-drill",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "viewtype",
            required: true,
        },
        {
            name: "category",
            required: true,
        },
        {
            name: "country",
            required: true,
        },
        {
            name: "year",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=big-numbers-drill.datasource.js.map
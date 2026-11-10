"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "category-health-overview",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "category/category-health/overview",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "year",
            required: true,
        },
        {
            name: "category",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=overview.datasource.js.map
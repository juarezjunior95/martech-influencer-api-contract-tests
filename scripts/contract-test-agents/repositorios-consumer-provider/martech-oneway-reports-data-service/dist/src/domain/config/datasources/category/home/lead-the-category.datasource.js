"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "lead-the-category",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "category/home/lead-the-category",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        { name: "country", required: true },
        { name: "viewtype", required: true },
        { name: "dt_end", required: true },
    ],
};
exports.default = config;
//# sourceMappingURL=lead-the-category.datasource.js.map
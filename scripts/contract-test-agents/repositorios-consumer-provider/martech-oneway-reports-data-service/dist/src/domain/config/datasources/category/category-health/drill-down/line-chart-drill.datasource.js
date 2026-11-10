"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "category-health-drill-down-line-chart",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "category/category-health/drill-down/line-chart-drill",
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
            name: "kpi_name",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=line-chart-drill.datasource.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "one-yp-breakdown",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "consumer/one-yp/performance/breakdown",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "brand",
            required: true,
        },
        {
            name: "competitor",
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
        {
            name: "dt_end",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=breakdown.datasource.js.map
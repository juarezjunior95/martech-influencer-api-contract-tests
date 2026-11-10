"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "one-yp-participation-breakdown",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "consumer/one-yp/definition/participation-breakdown",
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
            name: "dt_end",
            required: true,
        },
        {
            name: "brand",
            required: true,
        },
        {
            name: "competitor",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=participation-breakdown.datasource.js.map
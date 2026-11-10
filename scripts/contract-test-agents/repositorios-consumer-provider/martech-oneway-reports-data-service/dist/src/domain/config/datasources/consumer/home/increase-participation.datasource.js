"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "increase-participation",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "consumer/home/increase-participation",
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
    ],
};
exports.default = config;
//# sourceMappingURL=increase-participation.datasource.js.map
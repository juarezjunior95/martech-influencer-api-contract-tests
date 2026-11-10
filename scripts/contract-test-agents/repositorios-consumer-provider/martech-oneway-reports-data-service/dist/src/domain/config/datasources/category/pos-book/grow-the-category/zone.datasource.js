"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "zone",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "category/pos-book/grow-the-category/zone",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "pos_kpi",
            required: true,
        },
        {
            name: "timeperiod",
            required: true,
        },
        {
            name: "cohort",
            required: true,
        },
        {
            name: "dt_end",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=zone.datasource.js.map
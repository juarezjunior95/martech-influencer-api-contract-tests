"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "manufacture-participation",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "category/pos-book/lead-the-category/country/manufacture-participation",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "price_segment",
            required: true,
        },
        {
            name: "timeperiod",
            required: true,
        },
        {
            name: "dt_end",
            required: true,
        },
        {
            name: "viewtype",
            required: true,
        },
        {
            name: "country",
            required: true,
        },
        {
            name: "manufacturer",
            required: false,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=manufacture-participation.datasource.js.map
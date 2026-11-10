"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "one-yp-brand-audience",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "consumer/one-yp/definition/brand-audience",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "dt_end",
            required: true,
        },
        {
            name: "brand",
            required: true,
        },
        {
            name: "country",
            required: true,
        },
        {
            name: "product_type",
            required: true,
        },
        {
            name: "age",
            required: false,
        },
        {
            name: "gender",
            required: false,
        },
        {
            name: "socio_economic_level",
            required: false,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=brand-audience.datasource.js.map
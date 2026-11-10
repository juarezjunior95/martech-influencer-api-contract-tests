"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "top-15-countries",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/pr-pages/market-share/top-15-countries",
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
            name: "zone",
            required: true,
        },
        {
            name: "country",
            required: true,
        },
        {
            name: "growth_lever",
            required: true,
        },
        {
            name: "brand",
            required: true,
        },
        {
            name: "sub_brand",
            required: true,
        },
        {
            name: "period_type",
            required: true,
        },
        {
            name: "max_ranked",
            required: false,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=top-15-countries.datasource.js.map
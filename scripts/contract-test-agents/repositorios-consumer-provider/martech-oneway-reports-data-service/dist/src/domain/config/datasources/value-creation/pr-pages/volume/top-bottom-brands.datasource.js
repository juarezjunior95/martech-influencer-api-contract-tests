"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "top-bottom-brands",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/pr-pages/volume/top-bottom-brands",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "kpi",
            required: true,
        },
        {
            name: "dt_end",
            required: true,
        },
        {
            name: "page_type",
            required: true,
        },
        {
            name: "period",
            required: true,
        },
        {
            name: "growth_lever",
            required: true,
        },
        {
            name: "view_level",
            required: true,
        },
        {
            name: "country",
            required: true,
        },
        {
            name: "reporttype",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=top-bottom-brands.datasource.js.map
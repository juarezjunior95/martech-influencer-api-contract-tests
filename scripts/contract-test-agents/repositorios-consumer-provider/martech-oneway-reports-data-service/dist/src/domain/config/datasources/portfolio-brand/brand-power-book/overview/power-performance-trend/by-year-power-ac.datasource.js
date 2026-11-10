"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "yearly_power_ac",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "portfolio-brand/brand-power-book/overview/power-performance-trend/by-year-power-ac",
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
            name: "page_filter",
            required: true,
        },
        {
            name: "viewtype",
            required: true,
        },
        {
            name: "zone",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=by-year-power-ac.datasource.js.map
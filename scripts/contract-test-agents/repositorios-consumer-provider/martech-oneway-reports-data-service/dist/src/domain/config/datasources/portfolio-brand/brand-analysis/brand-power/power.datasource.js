"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "brand-power-power-full-year",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "portfolio-brand/brand-analysis/brand-power/power/full-year",
            }),
        },
        {
            id: "brand-power-power-per-year-qtr",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "portfolio-brand/brand-analysis/brand-power/power/per-year-qtr",
            }),
        },
        {
            id: "brand-power-power-ytd",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "portfolio-brand/brand-analysis/brand-power/power/ytd",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        { name: "dt_end", required: true },
        { name: "viewtype", required: true },
        { name: "zone", required: true },
        { name: "country", required: true },
        { name: "sub_brand", required: true },
        { name: "sub_brand_comp", required: true },
    ],
};
exports.default = config;
//# sourceMappingURL=power.datasource.js.map
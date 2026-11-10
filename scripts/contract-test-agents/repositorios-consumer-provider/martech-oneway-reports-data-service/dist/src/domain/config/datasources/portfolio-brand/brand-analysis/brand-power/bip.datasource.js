"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "brand-power-bip-per-year-qtr",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "portfolio-brand/brand-analysis/brand-power/bip/per-year-qtr",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        { name: "country", required: true },
        { name: "sub_brand", required: true },
        { name: "sub_brand_comp", required: true },
    ],
};
exports.default = config;
//# sourceMappingURL=bip.datasource.js.map
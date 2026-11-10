"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "total-per-year-all-st",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "portfolio-brand/brand-analysis/total-per-year-all-st",
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
            name: "zone",
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
    ],
};
exports.default = config;
//# sourceMappingURL=total-per-year-all-st.datasource.js.map
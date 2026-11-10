"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "non-finance-market-share-overtime-trends-by-snapshot",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/performance-tool/drill-down/non-finance/market-share/overtime-trends/snapshot",
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
            name: "country",
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
//# sourceMappingURL=snapshot.datasource.js.map
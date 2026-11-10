"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kpi_entity_1 = require("../../../../../../../entities/kpi.entity");
const dataset_repository_factory_1 = require("../../../../../../../factories/dataset-repository.factory");
const config = {
    datasets: [
        {
            id: "cores-composition",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/performance-tool/drill-down/finance/cores/composition",
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
            name: "zone",
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
            name: "period_type",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=composition.datasource.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const filters = [
    {
        name: "viewtype",
        required: true,
    },
    {
        name: "country",
        required: true,
    },
    {
        name: "dt_ini",
        required: true,
    },
    {
        name: "dt_end",
        required: true,
    },
];
const config = {
    datasets: [
        {
            id: "owr_connections_creativity_media_drilldown_media_qwoa_fn",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "5_connections_creativity_media-campaign_media-drilldown_media-qwoa",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters,
};
exports.default = config;
//# sourceMappingURL=media-qwoa-bubble-chart.datasource.js.map
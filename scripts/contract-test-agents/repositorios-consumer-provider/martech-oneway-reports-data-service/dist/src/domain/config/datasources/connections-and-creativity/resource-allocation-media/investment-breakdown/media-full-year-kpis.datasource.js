"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const DATASET_ID = "owr_connections_creativity_investment_breakdown_fy_fn";
const PROCEDURE = "5_connections_creativity_media-campaing_investment-breakdown_fy";
const config = {
    datasets: [
        {
            id: DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: PROCEDURE,
                parameters: ["country", "dt_ini", "dt_end"],
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
            name: "dt_ini",
            required: true,
        },
        {
            name: "dt_end",
            required: true,
        },
        {
            name: "viewtype",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=media-full-year-kpis.datasource.js.map
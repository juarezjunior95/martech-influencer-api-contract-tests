"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strategic_innovation_pillars_handler_1 = require("../../../../../handlers/innovation/innovation/overview/strategic-innovation-pillars.handler");
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const filters = [
    {
        name: "viewtype",
    },
    {
        name: "country",
    },
    {
        name: "dt_end",
    },
    {
        name: "kpi",
    },
];
const config = {
    datasets: [
        {
            id: "strategic-innovation-pillars",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "4_innovation_innovation-performance_overview_strategic-innovation-pillars",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    handler: strategic_innovation_pillars_handler_1.strategicInnovationPillarsHandler,
    entityClass: kpi_entity_1.KpiEntity,
    filters,
};
exports.default = config;
//# sourceMappingURL=strategic-innovation-pillars.datasource.js.map
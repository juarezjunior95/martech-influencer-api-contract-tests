"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const filters = [
    {
        name: "dt_end",
        required: true,
    },
];
const config = {
    version: "1.0.0",
    datasets: [
        {
            id: "premier-league-leaderboard",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "7_value_creation_growth-league_overview_leaderboard",
                parameters: filters.map((filter) => filter.name),
                staticParams: { league: "premier" },
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters,
};
exports.default = config;
//# sourceMappingURL=premier-league-leaderboard.datasource.js.map
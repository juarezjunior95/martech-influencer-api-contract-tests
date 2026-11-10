"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_SP_NAME = exports.INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const portfolio_pie_charts_handler_1 = require("../../../../../handlers/innovation/innovation-hub/overview/portfolio-pie-charts.handler");
exports.INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_DATASET_ID = "portfolio-pie-charts";
exports.INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_SP_NAME = "4_innovation_innovation-performance_overview_donut-chart";
const filters = [
    { name: "viewtype", required: true },
    { name: "zone", required: true },
    { name: "country", required: true },
    { name: "dt_end", required: true },
    { name: "period_type", required: true },
];
const config = {
    version: "1.0.0",
    entityClass: kpi_entity_1.KpiEntity,
    datasets: [
        {
            id: exports.INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: exports.INNOVATION_HUB_OVERVIEW_PORTFOLIO_PIE_CHARTS_SP_NAME,
                parameters: filters.map((f) => f.name),
                staticParams: { viewtype: "all" },
            }),
        },
    ],
    handler: portfolio_pie_charts_handler_1.portfolioPieChartsHandler,
    filters,
};
exports.default = config;
//# sourceMappingURL=portfolio-pie-charts.datasource.js.map
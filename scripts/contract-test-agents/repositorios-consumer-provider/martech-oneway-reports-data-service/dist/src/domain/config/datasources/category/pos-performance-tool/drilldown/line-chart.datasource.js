"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const filters = [
    { name: "country", required: true },
    { name: "category", required: true },
    { name: "timeframe", required: true },
    { name: "dt_end", required: true },
    { name: "kpi", required: true },
    { name: "manufacturer", required: true },
    { name: "brand", required: true },
    { name: "brand_segments", required: true },
    { name: "region", required: true },
    { name: "cohort", required: true },
];
const config = {
    datasets: [
        {
            id: "owr_category_pos_tool_drill_down_line_chart_fn",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "1_category_pos-tool_drill-down_line-chart",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters,
};
exports.default = config;
//# sourceMappingURL=line-chart.datasource.js.map
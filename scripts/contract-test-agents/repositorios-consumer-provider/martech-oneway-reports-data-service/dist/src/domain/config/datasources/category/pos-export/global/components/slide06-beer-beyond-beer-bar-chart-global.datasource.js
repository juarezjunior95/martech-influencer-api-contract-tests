"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POS_EXPORT_SLIDE06_BEER_BB_BAR_CHART_GLOBAL_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const slide03_alcohol_bar_chart_datasource_1 = require("../../country/components/slide03-alcohol-bar-chart.datasource");
exports.POS_EXPORT_SLIDE06_BEER_BB_BAR_CHART_GLOBAL_DATASET_ID = "slide06-beer-beyond-beer-bar-chart-global";
const filters = [
    {
        name: "country",
        required: true,
    },
    {
        name: "dt_end",
        required: true,
    },
];
const config = {
    version: "1.0.0",
    entityClass: kpi_entity_1.KpiEntity,
    datasets: [
        {
            id: exports.POS_EXPORT_SLIDE06_BEER_BB_BAR_CHART_GLOBAL_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: slide03_alcohol_bar_chart_datasource_1.POS_EXPORT_BAR_CHART_SP_NAME,
                parameters: filters.map((filter) => filter.name),
                staticParams: { category: "Beer + Beyond Beer" },
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=slide06-beer-beyond-beer-bar-chart-global.datasource.js.map
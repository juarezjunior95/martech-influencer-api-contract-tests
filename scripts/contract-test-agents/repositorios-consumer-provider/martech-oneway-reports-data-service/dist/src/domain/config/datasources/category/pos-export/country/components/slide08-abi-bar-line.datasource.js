"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POS_EXPORT_SLIDE08_ABI_BAR_LINE_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const slide03_alcohol_bar_line_datasource_1 = require("./slide03-alcohol-bar-line.datasource");
exports.POS_EXPORT_SLIDE08_ABI_BAR_LINE_DATASET_ID = "slide08-abi-bar-line";
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
            id: exports.POS_EXPORT_SLIDE08_ABI_BAR_LINE_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: slide03_alcohol_bar_line_datasource_1.POS_EXPORT_LINE_CHART_SP_NAME,
                parameters: filters.map((filter) => filter.name),
                staticParams: {
                    category: "Beer + Beyond Beer",
                    manufacturer: "ABI",
                },
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=slide08-abi-bar-line.datasource.js.map
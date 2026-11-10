"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const table_handler_1 = require("../../../../../../handlers/value-creation/pr-pages/volume/segments-gb/table.handler");
const config = {
    datasets: [
        {
            id: "segments-gb_table",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/pr-pages/volume-beer-adj/segments-gb/table",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    handler: table_handler_1.propertiesTableHandler,
    filters: [
        {
            name: "dt_end",
            required: true,
        },
        {
            name: "page_type",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=table.datasource.js.map
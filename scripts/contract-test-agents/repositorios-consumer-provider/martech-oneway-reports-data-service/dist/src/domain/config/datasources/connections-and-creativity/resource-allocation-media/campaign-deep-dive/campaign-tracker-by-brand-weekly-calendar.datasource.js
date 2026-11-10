"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "campaign-tracker-by-brand-weekly-calendar",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "connections-and-creativity/resource-allocation-media/campaign-deep-dive/campaign-tracker-by-brand-weekly-calendar",
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
    ],
};
exports.default = config;
//# sourceMappingURL=campaign-tracker-by-brand-weekly-calendar.datasource.js.map
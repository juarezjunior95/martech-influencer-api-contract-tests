"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const performance_breakdown_and_summary_power_datasource_1 = require("../performance-breakdown-and-summary-power/performance-breakdown-and-summary-power.datasource");
const filters = [
    {
        name: "page_filter",
        required: true,
    },
    {
        name: "country",
        required: true,
    },
    {
        name: "dt_end",
        required: true,
    },
    {
        name: "period_type",
        required: false,
    },
];
const config = {
    datasets: [
        {
            id: "summary_power_brand_breakdown",
            config: (0, performance_breakdown_and_summary_power_datasource_1.createBrandPowerResultsProcedureFetchDataConfig)(filters, {
                visual: "BRAND",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters,
};
exports.default = config;
//# sourceMappingURL=by-brand-breakdown.datasource.js.map
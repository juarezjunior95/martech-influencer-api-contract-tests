"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const performance_breakdown_and_summary_power_datasource_1 = require("../performance-breakdown-and-summary-power/performance-breakdown-and-summary-power.datasource");
const filters = [
    {
        name: "dt_end",
        required: true,
    },
    {
        name: "page_filter",
        required: true,
    },
    {
        name: "viewtype",
        required: true,
    },
    {
        name: "zone_maturity",
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
            id: "zone_maturity_power_details",
            config: (0, performance_breakdown_and_summary_power_datasource_1.createBrandPowerResultsProcedureFetchDataConfig)(filters, {
                visual: "COUNTRY",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters,
};
exports.default = config;
//# sourceMappingURL=by-zone-maturity-performance-details.datasource.js.map
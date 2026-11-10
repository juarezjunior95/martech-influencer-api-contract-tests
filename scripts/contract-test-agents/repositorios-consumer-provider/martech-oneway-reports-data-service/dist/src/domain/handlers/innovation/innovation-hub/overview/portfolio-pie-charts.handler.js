"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioPieChartsHandler = void 0;
const handler_base_1 = require("../../../handler.base");
const CHART_ID_MAP = {
    "Innovation Pillar": "innovationPillar",
    Innovation: "innovationPillar",
    Megabrands: "megabrandFramework",
    "Liquid Type": "liquidType",
};
const normalizeGeo = (value) => {
    if (value === undefined || value === null) {
        return undefined;
    }
    const normalized = String(value);
    return normalized === "ALL" ? "ABI" : normalized;
};
class PortfolioPieChartsHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset?.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const lakeChart = item.CHART ?? item.chart;
            const chartId = CHART_ID_MAP[String(lakeChart)] ?? String(lakeChart);
            return {
                chart: chartId,
                item: item.ITEM ?? item.item,
                metric: item.METRIC ?? item.metric,
                percentage: item.PERCENTAGE ?? item.percentage,
                country: normalizeGeo(item.COUNTRY_ISO_CODE_3 ?? item.country_iso_code_3 ?? item.country),
                zone: normalizeGeo(item.ABI_ZONE ?? item.abi_zone ?? item.zone),
            };
        });
    }
}
exports.portfolioPieChartsHandler = new PortfolioPieChartsHandler();
//# sourceMappingURL=portfolio-pie-charts.handler.js.map
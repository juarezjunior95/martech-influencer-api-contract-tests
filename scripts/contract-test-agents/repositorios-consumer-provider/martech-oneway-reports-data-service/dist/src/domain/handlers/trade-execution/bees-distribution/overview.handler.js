"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beesDistributionOverviewHandler = void 0;
const handler_base_1 = require("../../handler.base");
const direction_utils_1 = require("../../../../common/utils/direction.utils");
class BeesDistributionOverview extends handler_base_1.BaseHandler {
    async handle(datasets, _defaultDataset) {
        return this.processDatasetData(datasets);
    }
    getKpiConfig(dataItems) {
        const itemWithKpi = dataItems.find((item) => item.kpi_name != null);
        const kpiName = (itemWithKpi?.kpi_name ?? "");
        return (BeesDistributionOverview.KPI_TITLE[kpiName] ?? {
            title: kpiName,
            measure: "",
        });
    }
    processKpiPerformance(value) {
        if (value == null) {
            return "";
        }
        return (0, direction_utils_1.formatDirection)(value, {
            up: "positive",
            down: "negative",
        });
    }
    processDatasetData(datasets) {
        return datasets.map((dataset) => {
            const dataItems = dataset.data;
            const performanceField = BeesDistributionOverview.KPI_PERFORMANCE_CHART_MAP[dataset.id];
            const kpiConfig = this.getKpiConfig(dataItems);
            return {
                id: dataset.id,
                config: dataset?.data && dataset.data.length > 0
                    ? {
                        kpi_title: kpiConfig.title,
                        kpi_unit_of_measure: kpiConfig.measure,
                        kpi_comparison_unit_of_measure: "%",
                    }
                    : {},
                data: dataItems.map((item) => ({
                    ...item,
                    performance: performanceField
                        ? this.processKpiPerformance(item[performanceField])
                        : "",
                })),
            };
        });
    }
}
BeesDistributionOverview.KPI_TITLE = {
    "sku per poc": {
        title: "SKU per POC",
        measure: "[ # ]",
    },
    "bees buyers": {
        title: "Total Buyers",
        measure: "[ Mio ]",
    },
    distribution: {
        title: "Total Distribution",
        measure: "[ Mio ]",
    },
};
BeesDistributionOverview.KPI_PERFORMANCE_CHART_MAP = {
    "bar-chart": "ac_vs_ly",
    "card-chart": "delta_pct",
    "line-chart": "ly",
};
exports.beesDistributionOverviewHandler = new BeesDistributionOverview();
//# sourceMappingURL=overview.handler.js.map
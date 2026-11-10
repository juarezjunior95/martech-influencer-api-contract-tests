"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandPowerResultsHandler = void 0;
const kpi_group_types_1 = require("../kpi-group/kpi-group.types");
const dataset_repository_factory_1 = require("../../../factories/dataset-repository.factory");
const date_utils_1 = require("../common/date-utils");
const EMPTY_DEFAULT = {
    value: "",
    label: "",
    full: "",
};
function getQuarterlyTimeframes(dateEnd) {
    const month = dateEnd.getUTCMonth() + 1;
    let quarter;
    if (month >= 1 && month <= 3)
        quarter = 1;
    else if (month >= 4 && month <= 6)
        quarter = 2;
    else if (month >= 7 && month <= 9)
        quarter = 3;
    else
        quarter = 4;
    const yy = String(dateEnd.getUTCFullYear()).slice(2);
    const formattedDateEnd = `Q${quarter}'${yy}`;
    return [
        {
            value: "YTD",
            label: `YTD ${formattedDateEnd}`,
            full: "Year To Date (YTD)",
        },
        {
            value: "QTD",
            label: `LQ ${formattedDateEnd}`,
            full: "Last Quarter (LQ)",
        },
    ];
}
class BrandPowerResultsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    datasets() {
        return [
            {
                id: kpi_group_types_1.KPI_GROUP_DATASET_ID,
                config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                    query: kpi_group_types_1.KPI_GROUP_DATASET_QUERY,
                }),
            },
        ];
    }
    handle(preset, datasets) {
        const kpiGroup = datasets?.[0].data?.find((kpi) => kpi.kpi_name === "power");
        const refreshDate = kpiGroup?.time_frame ?? "";
        const parsedDate = (0, date_utils_1.parseDateUtc)(refreshDate) ?? new Date();
        const values = getQuarterlyTimeframes(parsedDate);
        const defaultPeriod = values.find((v) => v.value === "QTD") ?? values[0] ?? EMPTY_DEFAULT;
        const brandPowerResultsValue = {
            values,
            default: { ...defaultPeriod },
            enabled: true,
        };
        return {
            ...preset,
            "brand-power-results": {
                periods: brandPowerResultsValue,
            },
        };
    }
}
exports.brandPowerResultsHandler = new BrandPowerResultsPresetHandler();
//# sourceMappingURL=brand-power-results.handler.js.map
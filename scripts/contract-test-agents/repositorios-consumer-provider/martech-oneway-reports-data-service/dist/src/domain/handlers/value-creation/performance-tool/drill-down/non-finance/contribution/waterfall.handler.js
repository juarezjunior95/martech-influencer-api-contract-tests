"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waterfallHandler = void 0;
const direction_utils_1 = require("../../../../../../../common/utils/direction.utils");
const handler_base_1 = require("../../../../../handler.base");
const brand_image_utils_1 = require("../../../../../../../common/utils/images/brand-image.utils");
const country_image_utils_1 = require("../../../../../../../common/utils/images/country-image.utils");
class WaterfallHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        return defaultDataset?.data ? this.processDatasetData(defaultDataset) : [];
    }
    processDatasetData(dataset) {
        const total = dataset.data.length;
        return dataset.data.map((item, index) => {
            const direction = (value) => (0, direction_utils_1.formatDirection)(Number(value), { positiveZero: true });
            let imageValue = this.resolveImage(item);
            const isFirst = index === 0;
            const isLast = index === total - 1;
            const isNotCountry = item.viewtype !== "country";
            const isNotRegion = item.viewtype !== "region";
            if (isNotCountry && isNotRegion && (isFirst || isLast)) {
                imageValue = (0, country_image_utils_1.getCountryFlag)(item.country_iso_code_3);
            }
            const acDeltaValue = isFirst || isLast ? item.ac : item.ac_delta;
            return {
                dt_end: item.dt_end,
                period: item.timeframe,
                label_value: item.bar,
                image_value: imageValue,
                waterfall_filter: item.viewtype,
                unit_of_measure: item.unit_of_measure ?? null,
                comp_unit_of_measure: item.comp_unit_of_measure ?? null,
                ac: item.ac,
                ac_direction: direction(Number(item.ac)),
                ac_delta: acDeltaValue,
                ac_delta_direction: direction(Number(acDeltaValue)),
                nr_weight: item.nr_weight,
                nr_weight_direction: direction(Number(item.nr_weight)),
                ac_vs_lq: item.ac_vs_lq,
                ac_vs_lq_direction: direction(Number(item.ac_vs_lq)),
                ac_vs_ly: item.ac_vs_ly,
                ac_vs_ly_direction: direction(Number(item.ac_vs_ly)),
            };
        });
    }
    resolveImage(item) {
        if (item.viewtype === "brand") {
            return (0, brand_image_utils_1.getBrandImage)(item.bar, {
                format: "square",
                brand_family: item.raw_brand,
            });
        }
        if (item.viewtype === "country") {
            return (0, country_image_utils_1.getCountryFlag)(item.country_iso_code_3);
        }
        return "";
    }
}
exports.waterfallHandler = new WaterfallHandler();
//# sourceMappingURL=waterfall.handler.js.map
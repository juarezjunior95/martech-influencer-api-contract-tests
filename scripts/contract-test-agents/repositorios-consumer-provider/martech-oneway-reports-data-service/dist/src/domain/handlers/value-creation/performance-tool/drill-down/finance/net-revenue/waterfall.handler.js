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
            const labelValue = this.resolveLabel(item);
            let imageValue = this.resolveImage(item);
            const isFirst = index === 0;
            const isLast = index === total - 1;
            if (isFirst || isLast) {
                imageValue = this.resolveTotalImage(item);
            }
            const acDeltaValue = isFirst || isLast ? item.ac : item.ac_vs_ly;
            const badgeFlag = this.resolveBadgeFlag(item, index, total);
            return {
                dt_end: item.dt_end,
                period: item.step_name,
                label_value: this.resolveLabelValue(labelValue, item, badgeFlag),
                image_value: imageValue,
                waterfall_filter: item.waterfall_filter,
                badgeFlag: badgeFlag,
                unit_of_measure: item.unit_of_measure ?? null,
                comp_unit_of_measure: item.comp_unit_of_measure ?? null,
                ac: item.ac,
                ac_direction: direction(Number(item.ac)),
                ac_delta: acDeltaValue,
                ac_delta_direction: direction(Number(acDeltaValue)),
                nr_vs_ly: item.nr_per_hl_vs_ly,
                nr_vs_ly_direction: direction(Number(item.nr_per_hl_vs_ly)),
                vol_vs_ly: item.vol_vs_ly,
                vol_vs_ly_direction: direction(Number(item.vol_vs_ly)),
                ac_vs_ly: item.ac_vs_ly,
                ac_vs_ly_direction: direction(Number(item.ac_vs_ly)),
            };
        });
    }
    resolveLabel(item) {
        switch (item.waterfall_filter) {
            case "portfolio":
                return item.portfolio;
            case "brand":
                return item.raw_brand;
            case "beer_price_segment":
            case "sub_brand":
                return item.step_name;
            default:
                return item.country_iso_code_3;
        }
    }
    resolveImage(item) {
        if (item.waterfall_filter === "brand") {
            return (0, brand_image_utils_1.getBrandImage)(item.raw_brand, {
                format: "square",
            });
        }
        if (item.waterfall_filter === "country") {
            return (0, country_image_utils_1.getCountryFlag)(item.country_iso_code_3);
        }
        return "";
    }
    resolveTotalImage(item) {
        if (item.waterfall_filter === "sub_brand") {
            return (0, brand_image_utils_1.getBrandImage)(item.raw_brand, {
                format: "square",
            });
        }
        return (0, country_image_utils_1.getCountryFlag)(item.country_iso_code_3);
    }
    resolveLabelValue(labelValue, item, badgeFlag) {
        if (badgeFlag) {
            return [labelValue, item.country_iso_code_3];
        }
        return item.waterfall_filter === "brand" ? [labelValue] : labelValue;
    }
    resolveBadgeFlag(item, index, total) {
        const isFirst = index === 0;
        const isLast = index === total - 1;
        const isOthers = item.step_name === "Others" || item.label_value === "Others";
        const isCountry = item.waterfall_filter === "country";
        let countryCode = item.country_iso_code_3 || "";
        if (!countryCode && item.period) {
            const periodParts = item.period.split("\n");
            if (periodParts.length > 1) {
                countryCode = periodParts[1];
            }
        }
        if (isOthers || isCountry || isFirst || isLast || !countryCode) {
            return undefined;
        }
        const countryImage = (0, country_image_utils_1.getCountryFlag)(countryCode);
        return countryImage
            ? {
                src: countryImage,
                alt: countryCode,
            }
            : undefined;
    }
}
exports.waterfallHandler = new WaterfallHandler();
//# sourceMappingURL=waterfall.handler.js.map
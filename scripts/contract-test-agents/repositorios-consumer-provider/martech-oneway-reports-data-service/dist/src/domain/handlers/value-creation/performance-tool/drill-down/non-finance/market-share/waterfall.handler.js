"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketShareWaterfallHandler = void 0;
const direction_utils_1 = require("../../../../../../../common/utils/direction.utils");
const handler_base_1 = require("../../../../../handler.base");
const brand_image_utils_1 = require("../../../../../../../common/utils/images/brand-image.utils");
const country_image_utils_1 = require("../../../../../../../common/utils/images/country-image.utils");
class MarketShareWaterfallHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        return defaultDataset?.data ? this.processDatasetData(defaultDataset) : [];
    }
    processDatasetData(dataset) {
        const total = dataset.data.length;
        return dataset.data.map((item, index) => {
            const direction = (value) => (0, direction_utils_1.formatDirection)(Number(value), {
                positiveZero: true,
            });
            const isFirst = index === 0;
            const isLast = index === total - 1;
            const isTotal = isFirst || isLast;
            const rawBrand = item.raw_brand;
            const countryIso = item.country_iso_code_3;
            const filterZone = item.filter_zone;
            if (filterZone == "EUR" && item.filter_waterfall_filter == "brand") {
                item.filter_waterfall_filter = "brand_eur";
            }
            return {
                waterfall_type: item.filter_waterfall_filter,
                label_value: item.labels,
                image_value: this.resolveImage(rawBrand, countryIso, isTotal),
                badge_value: this.resolveBadge(item, countryIso, isTotal),
                country_iso_code_3: countryIso,
                vol_vs_ly: item.vol_vs_ly,
                vol_vs_ly_direction: direction(Number(item.vol_vs_ly)),
                vol_weight: item.vol_weight,
                vol_weight_direction: direction(Number(item.vol_weight)),
                ac: item.ac,
                ac_direction: direction(Number(item.ac)),
                delta: item.delta,
                ind_vs_ly: item.ind_vs_ly,
                ind_vs_ly_direction: direction(Number(item.ind_vs_ly)),
                vs_ly: item.vs_ly,
                vs_ly_direction: item.vs_ly != null ? direction(Number(item.vs_ly)) : null,
                unit_of_measure: item.unit_of_measure ?? null,
                comp_unit_of_measure: item.comp_unit_of_measure ?? null,
            };
        });
    }
    resolveImage(rawBrand, countryIso, isTotal) {
        if (isTotal && countryIso) {
            return (0, country_image_utils_1.getCountryFlag)(countryIso);
        }
        if (rawBrand) {
            return (0, brand_image_utils_1.getBrandImage)(rawBrand, { format: "square" });
        }
        if (countryIso) {
            return (0, country_image_utils_1.getCountryFlag)(countryIso);
        }
        return "";
    }
    resolveBadge(item, countryIso, isTotal) {
        if (isTotal || item.filter_waterfall_filter == "country") {
            return "";
        }
        if (countryIso != "Others" &&
            item.filter_zone == "EUR" &&
            item.filter_country == "ABI") {
            return (0, country_image_utils_1.getCountryFlag)(countryIso);
        }
        return "";
    }
}
exports.marketShareWaterfallHandler = new MarketShareWaterfallHandler();
//# sourceMappingURL=waterfall.handler.js.map
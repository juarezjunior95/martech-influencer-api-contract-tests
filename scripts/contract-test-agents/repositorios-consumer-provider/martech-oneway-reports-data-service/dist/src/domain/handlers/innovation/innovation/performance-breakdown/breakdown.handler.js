"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.breakdownHandler = void 0;
const brand_image_utils_1 = require("../../../../../common/utils/images/brand-image.utils");
const direction_utils_1 = require("../../../../../common/utils/direction.utils");
const country_image_utils_1 = require("../../../../../common/utils/images/country-image.utils");
const handler_base_1 = require("../../../handler.base");
class BreakdownHandler extends handler_base_1.BaseHandler {
    async handle(datasets, defaultDataset) {
        return this.processDatasetData(defaultDataset);
    }
    processDatasetData(dataset) {
        return dataset.data.map((item) => {
            const leVsLy = this.getValue(item, "LE_VS_LY", "le_vs_ly");
            const leVsBu = this.getValue(item, "LE_VS_BU", "le_vs_bu");
            const growthContrib = this.getValue(item, "GROWTH_CONTRIB", "growth_contrib");
            const rawBrand = this.getValue(item, "RAW_BRAND", "raw_brand");
            const countryIso = this.getValue(item, "COUNTRY_ISO_CODE_3", "country_iso_code_3");
            const variationDirectionVsLy = (0, direction_utils_1.formatDirection)(Number(leVsLy), {
                positiveZero: true,
            });
            const variationDirectionVsBu = (0, direction_utils_1.formatDirection)(Number(leVsBu), {
                positiveZero: true,
            });
            const variationDirectionGrowthCont = (0, direction_utils_1.formatDirection)(Number(growthContrib), {
                positiveZero: true,
            });
            const brandImage = (0, brand_image_utils_1.getBrandImage)(rawBrand, {
                format: "square",
            });
            const countryFlag = (0, country_image_utils_1.getCountryFlag)(countryIso, {
                format: "icon",
            });
            return {
                kpi_name: this.getValue(item, "KPI_NAME", "kpi_name"),
                brand: rawBrand,
                brand_image: brandImage,
                country: countryIso,
                country_flag: countryFlag,
                expiration: this.getValue(item, "EXPIRATION", "expiration"),
                baseline: this.getValue(item, "BASELINE", "baseline"),
                dt_ini: this.getValue(item, "DT_INI", "dt_ini"),
                dt_end: this.getValue(item, "DT_END", "dt_end"),
                le: this.getValue(item, "LE", "le"),
                le_total: this.getValue(item, "LE_TOTAL", "le_total"),
                le_ly_total: this.getValue(item, "LE_LY_TOTAL", "le_ly_total"),
                le_vs_ly: leVsLy,
                le_vs_ly_direction: variationDirectionVsLy,
                le_vs_bu: leVsBu,
                le_vs_bu_direction: variationDirectionVsBu,
                growth_cont: growthContrib,
                growth_cont_direction: variationDirectionGrowthCont,
            };
        });
    }
    getValue(item, ...keys) {
        for (const key of keys) {
            if (item[key] !== undefined) {
                return item[key];
            }
        }
        return undefined;
    }
}
exports.breakdownHandler = new BreakdownHandler();
//# sourceMappingURL=breakdown.handler.js.map
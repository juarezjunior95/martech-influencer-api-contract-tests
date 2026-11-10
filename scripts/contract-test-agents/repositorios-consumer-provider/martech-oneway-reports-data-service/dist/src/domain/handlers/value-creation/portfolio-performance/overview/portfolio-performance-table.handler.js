"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioPerformanceTableHandler = void 0;
const handler_base_1 = require("../../../handler.base");
const direction_utils_1 = require("../../../../../common/utils/direction.utils");
const month_utils_1 = require("../../../../../common/utils/month.utils");
const period_utils_1 = require("../../../../../common/utils/period.utils");
const brand_image_utils_1 = require("../../../../../common/utils/images/brand-image.utils");
const country_image_utils_1 = require("../../../../../common/utils/images/country-image.utils");
function getField(item, key) {
    return item[key] ?? item[key.toLowerCase()];
}
class PortfolioPerformanceTableHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const dtEnd = getField(item, "DT_END");
            const dtIni = getField(item, "DT_INI");
            const ac = getField(item, "AC");
            const acVsLy = getField(item, "AC_VS_LY");
            const kpiName = getField(item, "KPI_NAME");
            const rawBrand = getField(item, "RAW_BRAND");
            const rawCountry = getField(item, "COUNTRY_ISO_CODE_3");
            const refreshMonthLabel = (0, month_utils_1.formatMonth)(dtEnd, {
                includeYear: true,
                yearFormat: "short",
            });
            const refreshPeriodLabel = (0, period_utils_1.formatPeriod)(dtIni, dtEnd, {
                alwaysUseQuarter: true,
                includeYear: true,
                yearFormat: "short",
            });
            const variationDirectionVsLy = (0, direction_utils_1.formatDirection)(Number(acVsLy));
            const variationDirectionAc = (0, direction_utils_1.formatDirection)(Number(ac));
            const unitMeasure = kpiName === "power" ? "pp" : "%";
            const brandImage = (0, brand_image_utils_1.getBrandImage)(rawBrand, {
                format: "square",
            });
            const countryImage = (0, country_image_utils_1.getCountryFlag)(rawCountry, { format: "icon" });
            return {
                segment: getField(item, "SEGMENT"),
                kpi_name: kpiName,
                ac,
                comp_ac_direction: variationDirectionAc,
                ac_vs_ly: acVsLy,
                comp_ac_ly_direction: variationDirectionVsLy,
                unit_measure: unitMeasure,
                country: rawCountry,
                brand: rawBrand,
                brand_family: getField(item, "BRAND_FAMILY"),
                brand_image: brandImage,
                country_image: countryImage,
                period_refresh: refreshPeriodLabel,
                month_refresh: refreshMonthLabel,
            };
        });
    }
}
exports.portfolioPerformanceTableHandler = new PortfolioPerformanceTableHandler();
//# sourceMappingURL=portfolio-performance-table.handler.js.map
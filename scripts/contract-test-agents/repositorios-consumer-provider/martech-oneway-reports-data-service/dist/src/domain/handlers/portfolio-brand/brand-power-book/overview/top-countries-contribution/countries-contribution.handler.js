"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countriesContributionHandler = void 0;
const handler_base_1 = require("../../../../handler.base");
const direction_utils_1 = require("../../../../../../common/utils/direction.utils");
const label_utils_1 = require("../../../../../../common/utils/label.utils");
const country_image_utils_1 = require("../../../../../../common/utils/images/country-image.utils");
const period_utils_1 = require("../../../../../../common/utils/period.utils");
class CountriesContributionHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const period = (0, period_utils_1.formatPeriod)(item.DT_INI, item.DT_END, {
                includeYear: true,
                yearFormat: "short",
            });
            const formattedPeriod = `[${period}]`;
            const labelVsLyValue = (0, label_utils_1.labelVsLy)({
                dtIni: item.DT_INI,
                dtEnd: item.DT_END,
                yearFormat: "short",
            });
            const labelLy = `[${labelVsLyValue}]`;
            const labelFormattedLy = labelLy.replace("vs ", "");
            const variationDirectionVsLy = (0, direction_utils_1.formatDirection)(Number(item.AC_VS_LY));
            const country_flag = (0, country_image_utils_1.getCountryFlag)(item.COUNTRY_ISO_CODE_3);
            return {
                ac_vs_ly_pond: item.AC_VS_LY_POND,
                country: item.COUNTRY_ISO_CODE_3,
                absolute_power_subtitle: formattedPeriod,
                ac: item.AC,
                ly: item.LY,
                comparison_subtitle: labelFormattedLy,
                ac_vs_ly: item.AC_VS_LY,
                nr_contribution_subtitle: formattedPeriod,
                nr_contribution: item.NR_CONTRIBUTION,
                variation_direction_comparison: variationDirectionVsLy,
                country_flag,
            };
        });
    }
}
exports.countriesContributionHandler = new CountriesContributionHandler();
//# sourceMappingURL=countries-contribution.handler.js.map
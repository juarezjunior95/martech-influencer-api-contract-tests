"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mustWinMarketsHandler = void 0;
const handler_base_1 = require("../../../handler.base");
const direction_utils_1 = require("../../../../../common/utils/direction.utils");
const country_image_utils_1 = require("../../../../../common/utils/images/country-image.utils");
class MustWinMarketsHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const variationDirectionVsLy = (0, direction_utils_1.formatDirection)(Number(item.ac_vs_ly));
            const variationDirectionAc = (0, direction_utils_1.formatDirection)(Number(item.ac));
            const countries = item.countries ?? "";
            const countriesList = countries.split(";");
            const countriesImages = countriesList.map((country) => {
                return {
                    alt: country,
                    src: (0, country_image_utils_1.getCountryFlag)(country, {
                        format: "icon",
                    }),
                };
            });
            return {
                dt_ini: item.dt_ini,
                dt_end: item.dt_end,
                period: item.period,
                row_label: item.row_label,
                priorities: item.priorities,
                countries: countriesList,
                countriesImages,
                ac: item.ac,
                variationDirectionAc,
                ac_vs_ly: item.ac_vs_ly,
                vs_ly_pp: item.vs_ly_pp,
                variationDirectionVsLy,
                comp_unit_of_measure: item.comp_unit_of_measure,
            };
        });
    }
}
exports.mustWinMarketsHandler = new MustWinMarketsHandler();
//# sourceMappingURL=must-win-markets.handler.js.map
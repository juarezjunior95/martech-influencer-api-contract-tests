"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioHandler = void 0;
const direction_utils_1 = require("../../../../../common/utils/direction.utils");
const portfolio_utils_1 = require("../../../../../common/utils/portfolio.utils");
const handler_base_1 = require("../../../handler.base");
class PortfolioHandler extends handler_base_1.BaseHandler {
    async handle(datasets, defaultDataset) {
        return this.processDatasetData(defaultDataset);
    }
    processDatasetData(dataset) {
        return dataset.data.map((item) => {
            const variationParams = {
                invert: (0, portfolio_utils_1.isReverseDirection)(String(item.kpi_name)),
            };
            const dir = (field) => (0, direction_utils_1.formatDirection)(Number(item[field]), variationParams);
            return {
                kpi_title: (0, portfolio_utils_1.getKpiTitle)(String(item.kpi_name)),
                kpi_name: item.kpi_name,
                ac: item.ac,
                og_vs_ly: item.og_vs_ly,
                comp_og_vs_ly_direction: dir("og_vs_ly"),
                megabrands_direction: dir("megabrands_og_vs_ly"),
                expansion_direction: dir("expansion_og_vs_ly"),
                sustain_direction: dir("sustain_og_vs_ly"),
                tail_direction: dir("tail_og_vs_ly"),
                megabrands_ac: item.megabrands_ac,
                megabrands_og_vs_ly: item.megabrands_og_vs_ly,
                expansion_ac: item.expansion_ac,
                expansion_og_vs_ly: item.expansion_og_vs_ly,
                sustain_ac: item.sustain_ac,
                sustain_og_vs_ly: item.sustain_og_vs_ly,
                tail_ac: item.tail_ac,
                tail_og_vs_ly: item.tail_og_vs_ly,
            };
        });
    }
}
exports.portfolioHandler = new PortfolioHandler();
//# sourceMappingURL=portfolio.handler.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_base_1 = require("../../handler.base");
class RankingBrandsHandler extends handler_base_1.BaseHandler {
    async handle(datasets, defaultDataset) {
        const dataset = defaultDataset ?? datasets[0];
        return (dataset?.data ?? []).map((item) => {
            const brand = this.getValue(item, "BRAND", "brand");
            const country = this.getValue(item, "COUNTRY", "country");
            return {
                ...item,
                brand_label: brand,
                country_code: country,
                ...(brand !== undefined ? { raw_brand: brand } : {}),
                ...(country !== undefined ? { image_key: country } : {}),
            };
        });
    }
    getValue(item, ...keys) {
        for (const key of keys) {
            if (item[key] !== undefined && item[key] !== null) {
                return String(item[key]);
            }
        }
        return undefined;
    }
}
exports.default = new RankingBrandsHandler();
//# sourceMappingURL=ranking-brands.handler.js.map
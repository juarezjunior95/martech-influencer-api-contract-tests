"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertiesTableHandler = void 0;
const handler_base_1 = require("../../../../handler.base");
const brand_image_utils_1 = require("../../../../../../common/utils/images/brand-image.utils");
const BRAND_REQUIRED_PAGE_TYPES = [
    "Global Brands",
    "Non Alc Beer",
    "Beyond Beer",
];
class PropertiesTableHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        const pageType = defaultDataset.data[0].page_type;
        const isBrandRequired = BRAND_REQUIRED_PAGE_TYPES.includes(pageType);
        return defaultDataset.data.map((item) => {
            if (isBrandRequired) {
                item.brand = {
                    imageSquare: (0, brand_image_utils_1.getBrandImage)(item.priorities, {
                        format: "square",
                    }),
                    imageTable: (0, brand_image_utils_1.getBrandImage)(item.priorities, {
                        format: "table",
                    }),
                };
            }
            return item;
        });
    }
}
exports.propertiesTableHandler = new PropertiesTableHandler();
//# sourceMappingURL=table.handler.js.map
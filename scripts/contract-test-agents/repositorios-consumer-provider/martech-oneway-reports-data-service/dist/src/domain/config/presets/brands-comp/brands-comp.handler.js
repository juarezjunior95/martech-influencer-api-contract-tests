"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandCompHandler = void 0;
const preset_entity_1 = require("../../../entities/preset.entity");
const dataset_repository_factory_1 = require("../../../factories/dataset-repository.factory");
const brands_comp_types_1 = require("./brands-comp.types");
const brands_comp_utils_1 = require("./brands-comp.utils");
class BrandCompFilterHandler {
    get name() {
        return this.constructor.name;
    }
    datasets() {
        return [
            {
                id: brands_comp_types_1.BRAND_COMP_DATASET_ID,
                config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                    query: brands_comp_types_1.BRAND_COMP_DATASET_QUERY,
                }),
            },
        ];
    }
    handle(preset, datasets, user) {
        const rows = this.extractRows(datasets);
        const result = {};
        for (const [key, value] of Object.entries(preset)) {
            if (!(0, brands_comp_types_1.isBrandCompFilterItem)(value)) {
                result[key] = value;
                continue;
            }
            const allowedCountries = value.countries
                ? new Set(value.countries)
                : null;
            const compValues = (0, brands_comp_utils_1.buildCompValuesByCountry)(rows, brands_comp_types_1.LEVEL_COMP, allowedCountries);
            const trimmed = user ? (0, preset_entity_1.trimByCountryAccess)(compValues, user) : compValues;
            const item = {
                values: trimmed,
                default: [],
                enabled: true,
            };
            result[key] = item;
        }
        return result;
    }
    extractRows(datasets) {
        const dataset = datasets?.find((d) => d.id === brands_comp_types_1.BRAND_COMP_DATASET_ID);
        if (!dataset?.data?.length) {
            return [];
        }
        const rows = [];
        for (const raw of dataset.data) {
            const country = (0, brands_comp_utils_1.pickString)(raw, [
                "country_iso_code_3",
                "COUNTRY_ISO_CODE_3",
            ]);
            const level = (0, brands_comp_utils_1.pickString)(raw, ["level_1", "LEVEL_1"]);
            const brand = (0, brands_comp_utils_1.pickString)(raw, ["brand_family", "BRAND_FAMILY"]);
            const subBrand = (0, brands_comp_utils_1.pickString)(raw, ["sub_brand", "SUB_BRAND"]);
            if (!country || !level || !brand) {
                continue;
            }
            rows.push({
                country,
                level,
                brand,
                subBrand: subBrand || brand,
            });
        }
        return rows;
    }
}
exports.brandCompHandler = new BrandCompFilterHandler();
//# sourceMappingURL=brands-comp.handler.js.map
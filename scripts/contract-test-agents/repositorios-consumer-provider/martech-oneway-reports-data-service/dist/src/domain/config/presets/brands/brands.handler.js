"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandsHandler = void 0;
const preset_entity_1 = require("../../../entities/preset.entity");
const dataset_repository_factory_1 = require("../../../factories/dataset-repository.factory");
const brands_types_1 = require("./brands.types");
const brands_utils_1 = require("./brands.utils");
const brand_image_utils_1 = require("../../../../common/utils/images/brand-image.utils");
class BrandFilterHandler {
    get name() {
        return this.constructor.name;
    }
    datasets() {
        return [
            {
                id: brands_types_1.BRAND_DATASET_ID,
                config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                    query: brands_types_1.BRAND_DATASET_QUERY,
                }),
            },
        ];
    }
    handle(preset, datasets, user) {
        const rows = this.extractRows(datasets);
        const result = {};
        for (const [key, value] of Object.entries(preset)) {
            if (!(0, brands_types_1.isBrandFilterItem)(value)) {
                result[key] = value;
                continue;
            }
            (0, brands_utils_1.validateBrandConfig)(value);
            const grouped = this.buildValues(rows, value);
            const trimmed = user
                ? (0, preset_entity_1.trimByCountryAccess)(grouped, user, { keepKeys: ["ABI"] })
                : grouped;
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
        const dataset = datasets?.find((d) => d.id === brands_types_1.BRAND_DATASET_ID);
        if (!dataset?.data?.length) {
            return [];
        }
        const rows = [];
        for (const raw of dataset.data) {
            const country = (0, brands_utils_1.pickString)(raw, [
                "country_iso_code_3",
                "COUNTRY_ISO_CODE_3",
            ]);
            const brand = (0, brands_utils_1.pickString)(raw, ["brand_family", "BRAND_FAMILY"]);
            const subBrand = (0, brands_utils_1.pickString)(raw, ["sub_brand", "SUB_BRAND"]);
            if (!country || !brand) {
                continue;
            }
            rows.push({
                country,
                brand,
                subBrand: subBrand || brands_utils_1.ALL,
            });
        }
        return rows;
    }
    buildValues(rows, filter) {
        const includeAllBrands = filter.includeAllBrands ?? true;
        const includeSubBrands = filter.includeSubBrands ?? true;
        const includeAllSubBrands = filter.includeAllSubBrands ?? true;
        const flatten = filter.flatten ?? false;
        const allowedCountries = filter.countries
            ? new Set(filter.countries)
            : null;
        const grouped = new Map();
        for (const row of rows) {
            if (allowedCountries && !allowedCountries.has(row.country)) {
                continue;
            }
            let perCountry = grouped.get(row.country);
            if (!perCountry) {
                perCountry = new Map();
                grouped.set(row.country, perCountry);
            }
            let subs = perCountry.get(row.brand);
            if (!subs) {
                subs = new Set();
                perCountry.set(row.brand, subs);
            }
            subs.add(row.subBrand);
        }
        const values = {};
        if (filter.includeGlobal === true) {
            values["ABI"] = (0, brands_utils_1.cloneABIEntry)();
        }
        for (const [country, brandsMap] of grouped) {
            const hierarchical = [];
            if (includeAllBrands) {
                hierarchical.push((0, brands_utils_1.buildAllBrandEntry)(includeSubBrands, flatten));
            }
            for (const [brandName, subBrandSet] of brandsMap) {
                if (brandName === brands_utils_1.ALL) {
                    continue;
                }
                hierarchical.push((0, brands_utils_1.buildBrandEntry)(brandName, subBrandSet, {
                    includeSubBrands,
                    includeAllSubBrands,
                    flatten,
                    subFieldLabel: filter.subFieldLabel,
                }));
            }
            let entries;
            if (flatten) {
                entries = (0, brands_utils_1.flattenBrands)(hierarchical);
            }
            else {
                entries = hierarchical;
            }
            if (filter.fieldLabel) {
                const fl = filter.fieldLabel;
                const img = (0, brand_image_utils_1.getBrandImageFields)(fl);
                const labeled = filter.flatten
                    ? { value: fl, label: fl, value_sub_brand: fl, ...img }
                    : { value: fl, label: fl, ...img };
                entries = [labeled, ...entries];
            }
            values[country] = {
                brands: entries,
                default: (0, brands_utils_1.resolveCountryDefault)(country, entries, includeSubBrands),
            };
        }
        return values;
    }
}
exports.brandsHandler = new BrandFilterHandler();
//# sourceMappingURL=brands.handler.js.map
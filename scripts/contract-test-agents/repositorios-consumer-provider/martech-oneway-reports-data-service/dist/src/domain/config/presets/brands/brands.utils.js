"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL = void 0;
exports.validateBrandConfig = validateBrandConfig;
exports.pickString = pickString;
exports.buildAllBrandEntry = buildAllBrandEntry;
exports.buildBrandEntry = buildBrandEntry;
exports.flattenBrands = flattenBrands;
exports.resolveCountryDefault = resolveCountryDefault;
exports.cloneABIEntry = cloneABIEntry;
const common_1 = require("@nestjs/common");
const brands_defaults_1 = require("./brands.defaults");
const brand_image_utils_1 = require("../../../../common/utils/images/brand-image.utils");
exports.ALL = "All";
function brandFields(name, brandFamily) {
    return (0, brand_image_utils_1.getBrandImageFields)(name, brandFamily ? { brand_family: brandFamily } : undefined);
}
function allSubBrandRow(brandFamily) {
    const img = brandFields(exports.ALL, brandFamily);
    return {
        value: exports.ALL,
        label: exports.ALL,
        ...img,
    };
}
function validateBrandConfig(filter) {
    if (filter.includeAllSubBrands === true &&
        filter.includeSubBrands === false) {
        throw new common_1.BadRequestException("It is not possible to use include_all_sub_brands=true and include_sub_brands=false");
    }
}
function pickString(row, keys) {
    for (const key of keys) {
        const v = row[key];
        if (typeof v === "string" && v.length > 0) {
            return v;
        }
    }
    return "";
}
function buildAllBrandEntry(includeSubBrands, flatten) {
    const img = brandFields(exports.ALL);
    const entry = {
        value: exports.ALL,
        label: exports.ALL,
        ...img,
    };
    if (includeSubBrands || flatten) {
        const subBrand = allSubBrandRow();
        entry.sub_brands = [subBrand];
        entry.default = { ...subBrand };
    }
    return entry;
}
function buildBrandEntry(brand, subBrandSet, options) {
    const main = brandFields(brand);
    const entry = {
        value: brand,
        label: brand,
        ...main,
    };
    if (!options.includeSubBrands && !options.flatten) {
        return entry;
    }
    const subBrands = [];
    if (options.subFieldLabel && !options.flatten) {
        const sf = String(options.subFieldLabel);
        subBrands.push({
            value: sf,
            label: sf,
            ...brandFields(sf, brand),
        });
    }
    if (options.includeAllSubBrands || options.flatten) {
        subBrands.push(allSubBrandRow(brand));
    }
    for (const sub of subBrandSet) {
        if (sub.toLowerCase() === exports.ALL.toLowerCase()) {
            continue;
        }
        subBrands.push({
            value: sub,
            label: sub,
            ...brandFields(sub, brand),
        });
    }
    entry.sub_brands = subBrands;
    entry.default = subBrands[0] ?? {
        value: brand,
        label: brand,
        ...brandFields(brand),
    };
    return entry;
}
function flattenBrands(entries) {
    const flat = [];
    for (const brand of entries) {
        const subs = brand.sub_brands ?? [];
        if (subs.length === 2 &&
            subs[0].label === exports.ALL &&
            subs[1].label === brand.label) {
            flat.push({
                value: brand.value,
                value_sub_brand: exports.ALL,
                label: brand.label,
                ...brandFields(brand.value),
            });
            continue;
        }
        for (const sub of subs) {
            const label = sub.label === exports.ALL ? `${brand.label} (All)` : sub.label;
            const isAllSub = sub.value === exports.ALL || sub.label === exports.ALL;
            flat.push({
                value: brand.value,
                value_sub_brand: sub.value,
                label,
                ...(isAllSub
                    ? brandFields(brand.value)
                    : brandFields(sub.value, brand.value)),
            });
        }
    }
    return flat;
}
function resolveCountryDefault(country, entries, includeSubBrands) {
    if (entries.length === 0) {
        return {};
    }
    const defaultId = brands_defaults_1.BRAND_DEFAULT_BY_COUNTRY[country];
    const match = defaultId
        ? entries.find((b) => b.value === defaultId)
        : undefined;
    const chosen = match ?? entries[0];
    if ("value_sub_brand" in chosen) {
        return {
            value: chosen.value,
            value_sub_brand: chosen.value_sub_brand,
            label: chosen.label,
            image_url: chosen.image_url,
            image_variants: chosen.image_variants,
        };
    }
    if (!includeSubBrands) {
        return {
            value: chosen.value,
            label: chosen.label,
            ...brandFields(chosen.value),
        };
    }
    const subs = chosen.sub_brands ?? [];
    const def = chosen.default ??
        subs[0] ?? {
        value: chosen.value,
        label: chosen.label,
        ...brandFields(chosen.value),
    };
    return {
        value: chosen.value,
        label: chosen.label,
        image_url: chosen.image_url,
        image_variants: chosen.image_variants,
        sub_brands: subs.map((s) => ({ ...s })),
        default: { ...def },
    };
}
function cloneABIEntry() {
    const sub = allSubBrandRow();
    const abiImg = brandFields(exports.ALL);
    const brandBlock = {
        value: exports.ALL,
        label: exports.ALL,
        ...abiImg,
        sub_brands: [{ ...sub }],
        default: { ...sub },
    };
    return {
        brands: [brandBlock],
        default: {
            value: exports.ALL,
            label: exports.ALL,
            ...abiImg,
            sub_brands: [{ ...sub }],
            default: { ...sub },
        },
    };
}
//# sourceMappingURL=brands.utils.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL = void 0;
exports.brandAbiAllLabel = brandAbiAllLabel;
exports.pickString = pickString;
exports.buildBrandGroupBlock = buildBrandGroupBlock;
exports.buildAbiValuesByCountry = buildAbiValuesByCountry;
const brand_image_utils_1 = require("../../../../common/utils/images/brand-image.utils");
exports.ALL = "All";
function brandAbiAllLabel() {
    return {
        value: exports.ALL,
        label: exports.ALL,
        ...(0, brand_image_utils_1.getBrandImageFields)(exports.ALL),
    };
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
function buildBrandGroupBlock(brand, subBrandSet) {
    const values = [];
    const ordered = Array.from(subBrandSet).sort((a, b) => a.localeCompare(b));
    for (const sub of ordered) {
        if (sub.toLowerCase() === exports.ALL.toLowerCase()) {
            continue;
        }
        values.push({
            value: sub,
            label: sub,
            ...(0, brand_image_utils_1.getBrandImageFields)(sub, { brand_family: brand }),
        });
    }
    if (values.length === 0) {
        values.push({
            value: brand,
            label: brand,
            ...(0, brand_image_utils_1.getBrandImageFields)(brand),
        });
    }
    return { group: brand, values };
}
function buildAbiValuesByCountry(rows, level, allowedCountries) {
    const grouped = new Map();
    for (const row of rows) {
        if (row.level !== level) {
            continue;
        }
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
    const countries = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));
    for (const country of countries) {
        const brandsMap = grouped.get(country);
        const blocks = [
            {
                group: "",
                values: [brandAbiAllLabel()],
            },
        ];
        const brandNames = Array.from(brandsMap.keys()).sort((a, b) => a.localeCompare(b));
        for (const brandName of brandNames) {
            if (brandName.toLowerCase() === exports.ALL.toLowerCase()) {
                continue;
            }
            blocks.push(buildBrandGroupBlock(brandName, brandsMap.get(brandName)));
        }
        values[country] = blocks;
    }
    return values;
}
//# sourceMappingURL=brands-abi.utils.js.map
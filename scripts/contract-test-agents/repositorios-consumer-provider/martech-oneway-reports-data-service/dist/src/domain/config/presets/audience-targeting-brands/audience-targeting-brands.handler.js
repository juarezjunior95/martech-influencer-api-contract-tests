"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audienceTargetingBrandsHandler = void 0;
const preset_entity_1 = require("../../../entities/preset.entity");
const audience_targeting_brands_defaults_1 = require("./audience-targeting-brands.defaults");
const brand_image_utils_1 = require("../../../../common/utils/images/brand-image.utils");
class AudienceTargetingBrandsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset, _datasets, user) {
        const values = this.cloneByCountry(audience_targeting_brands_defaults_1.AUDIENCE_TARGETING_BRANDS_BY_COUNTRY);
        const trimmed = user ? (0, preset_entity_1.trimByCountryAccess)(values, user) : values;
        const defaultRows = this.defaultForFirstCountry(trimmed);
        const payload = {
            enabled: true,
            values: trimmed,
            default: defaultRows,
        };
        return { ...preset, "audience-targeting-brands": payload };
    }
    defaultForFirstCountry(map) {
        const firstKey = Object.keys(map)[0];
        if (!firstKey) {
            return [];
        }
        const rows = map[firstKey];
        return rows ? rows.map((row) => this.cloneRow(row)) : [];
    }
    cloneByCountry(source) {
        const out = {};
        for (const [country, rows] of Object.entries(source)) {
            out[country] = rows.map((row) => this.cloneRow(row));
        }
        return out;
    }
    cloneRow(row) {
        return {
            value: row.value,
            label: row.label,
            is_sub_brand: row.is_sub_brand,
            ...(0, brand_image_utils_1.getBrandImageFields)(row.value),
            competitor: row.competitor.map((c) => {
                const copy = {
                    value: c.value,
                    label: c.label,
                    ...(0, brand_image_utils_1.getBrandImageFields)(c.value),
                };
                if (c.is_sub_brand !== undefined) {
                    copy.is_sub_brand = c.is_sub_brand;
                }
                return copy;
            }),
        };
    }
}
exports.audienceTargetingBrandsHandler = new AudienceTargetingBrandsPresetHandler();
//# sourceMappingURL=audience-targeting-brands.handler.js.map
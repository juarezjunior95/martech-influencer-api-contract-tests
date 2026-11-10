"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandPowerBookScopesHandler = void 0;
const EMPTY_DEFAULT = {
    value: "",
    label: "",
    full: "",
};
const BRAND_POWER_BOOK_SCOPES = [
    { value: "portfolio", label: "Portfolio", full: "" },
    { value: "global_brands", label: "Global Brands", full: "" },
    { value: "segment", label: "Segment", full: "" },
];
class BrandPowerBookScopesPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const values = BRAND_POWER_BOOK_SCOPES.map((row) => ({ ...row }));
        const brandPowerBookScopesValue = {
            values,
            default: { ...EMPTY_DEFAULT },
            enabled: true,
        };
        return { ...preset, "brand-power-book-scopes": brandPowerBookScopesValue };
    }
}
exports.brandPowerBookScopesHandler = new BrandPowerBookScopesPresetHandler();
//# sourceMappingURL=brand-power-book-scopes.handler.js.map
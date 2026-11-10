"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productScopeHandler = void 0;
const ALL_PRODUCT_SCOPES = [
    {
        value: "Beer + Adjacencies",
        label: "Beer + Adjacencies",
        full: "Beer + Adjacencies (excluding Soft Drinks)",
    },
    {
        value: "Total ABI",
        label: "Total ABI",
        full: "Total ABI (including Soft Drinks)",
    },
];
class ProductScopePresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const values = ALL_PRODUCT_SCOPES.map((tuple) => ({ ...tuple }));
        const productScopeValue = {
            values,
            default: { ...values[0] },
            enabled: true,
        };
        return { ...preset, "product-scope": productScopeValue };
    }
}
exports.productScopeHandler = new ProductScopePresetHandler();
//# sourceMappingURL=product-scope.handler.js.map
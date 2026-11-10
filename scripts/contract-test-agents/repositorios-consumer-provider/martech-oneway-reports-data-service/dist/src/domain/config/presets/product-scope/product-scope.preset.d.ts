import { PresetConfig } from "@domain/entities/preset.entity";
import { ProductScopePresetConfig } from "@domain/config/presets/product-scope/product-scope.handler";
declare const productScopePreset: {
    "product-scope": ProductScopePresetConfig;
};
declare const config: PresetConfig<typeof productScopePreset>;
export default config;
